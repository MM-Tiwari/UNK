const NVIDIA_CHAT_COMPLETIONS_URL =
  `${process.env.NVIDIA_BASE_URL?.trim() || "https://integrate.api.nvidia.com/v1"}/chat/completions`;

export class AIClientError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "missing-key"
      | "bad-request"
      | "rate-limit"
      | "api-error"
      | "network-error"
      | "malformed-output"
  ) {
    super(message);
    this.name = "AIClientError";
  }
}

function getModel() {
  return process.env.AI_MODEL?.trim() || "openai/gpt-oss-20b";
}

export async function createStructuredAnalysis<T>(args: {
  systemPrompt: string;
  userPrompt: string;
  jsonSchema: Record<string, unknown>;
}): Promise<T> {
  const apiKey = process.env.NVIDIA_API_KEY?.trim();

  if (!apiKey) {
    throw new AIClientError(
      "NVIDIA_API_KEY is not configured. Add your NVIDIA NIM API key to .env.local before running an analysis.",
      "missing-key"
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180_000);

  try {
    let response: Response;

    try {
      response = await fetch(NVIDIA_CHAT_COMPLETIONS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: getModel(),
          messages: [
            {
              role: "system",
              content: args.systemPrompt,
            },
            {
              role: "user",
              content: args.userPrompt,
            },
          ],
          max_tokens: 8192,
          temperature: 0.2,
          top_p: 0.7,
          stream: false,
          response_format: {
            type: "json_object",
          },
        }),
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new AIClientError(
          "The AI analysis timed out. Please try again.",
          "network-error"
        );
      }

      throw new AIClientError(
        "Could not reach NVIDIA NIM. Check your internet connection and try again.",
        "network-error"
      );
    }

    const raw = await response.text();

    let payload: unknown = null;

    try {
      payload = raw ? JSON.parse(raw) : null;
    } catch {
      // Handled below as an API error.
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new AIClientError(
          "The NVIDIA API key is invalid or unauthorized. Check NVIDIA_API_KEY in .env.local.",
          "api-error"
        );
      }

      if (response.status === 429) {
        throw new AIClientError(
          "NVIDIA NIM rate limit reached. Please wait a moment and try again.",
          "rate-limit"
        );
      }

      if (response.status === 400) {
        throw new AIClientError(
          extractApiErrorMessage(payload) ||
          "NVIDIA NIM rejected the request. Check the model name and request format.",
          "bad-request"
        );
      }

      throw new AIClientError(
        extractApiErrorMessage(payload) ||
        `NVIDIA NIM returned HTTP ${response.status}.`,
        "api-error"
      );
    }

    const output = extractJsonOutput(payload);

    if (!output) {
      throw new AIClientError(
        "NVIDIA NIM returned no structured analysis.",
        "malformed-output"
      );
    }

    return parseRobustJson<T>(output);
  } finally {
    clearTimeout(timeout);
  }
}

function parseRobustJson<T>(rawContent: string): T {
  let cleaned = rawContent.trim();

  // Strip markdown code fences if present (e.g. ```json ... ``` or ``` ... ```)
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "");
    cleaned = cleaned.replace(/\n?```\s*$/i, "");
    cleaned = cleaned.trim();
  }

  // First attempt: direct parse
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Second attempt: extract outermost JSON object { ... }
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const extracted = cleaned.slice(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(extracted) as T;
      } catch {
        // Fall through to error
      }
    }

    throw new AIClientError(
      "NVIDIA NIM returned malformed structured data.",
      "malformed-output"
    );
  }
}

function extractJsonOutput(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const choices = (payload as { choices?: unknown }).choices;

  if (!Array.isArray(choices)) {
    return null;
  }

  for (const choice of choices) {
    if (!choice || typeof choice !== "object") {
      continue;
    }

    const message = (choice as { message?: unknown }).message;

    if (!message || typeof message !== "object") {
      continue;
    }

    const content = (message as { content?: unknown }).content;

    if (typeof content === "string" && content.trim()) {
      return content.trim();
    }
  }

  return null;
}

function extractApiErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const error = (payload as { error?: unknown }).error;

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error && typeof error === "object") {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  const message = (payload as { message?: unknown }).message;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return null;
}