/**
 * Mentor.ai — AI Client powered by Ollama (local LLM, zero API keys)
 *
 * Connects to Ollama at http://localhost:11434/v1 using llama3.2
 * Each mentor has a unique system prompt that shapes their personality.
 */

const OLLAMA_BASE_URL = "http://localhost:11434/v1";
const MODEL = "llama3.2";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatResponse {
  choices: Array<{ message: { role: string; content: string } }>;
}

export async function chat(
  messages: ChatMessage[],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: options.temperature ?? 0.8,
        max_tokens: options.maxTokens ?? 2048,
      }),
    });

    if (!response.ok) throw new Error(`Ollama error: ${response.status}`);
    const data: ChatResponse = await response.json();
    return data.choices[0]?.message?.content ?? "No response generated.";
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Ollama is not running. Open the Ollama app from Applications.");
    }
    throw error;
  }
}

/** Start or continue a mentoring session with a specific mentor */
export async function mentorChat(
  mentorName: string,
  mentorSystemPrompt: string,
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  const systemMessage: ChatMessage = {
    role: "system",
    content: `${mentorSystemPrompt}

    IMPORTANT RULES:
    - Always respond in first person as ${mentorName}
    - Draw from their documented philosophy, writings, and life experiences
    - Provide actionable advice grounded in their worldview
    - End with a thought-provoking question to deepen the mentee's thinking
    - Be warm but challenging — great mentors push growth
    - Reference specific events from their life when relevant

    DISCLAIMER: AI simulation for educational purposes, not the actual person.`,
  };

  return chat(
    [systemMessage, ...conversationHistory, { role: "user", content: userMessage }],
    { temperature: 0.85, maxTokens: 1500 }
  );
}

/** Mentor Circle — get responses from multiple mentors on one question */
export async function mentorCircle(
  mentors: Array<{ name: string; systemPrompt: string }>,
  question: string
): Promise<Array<{ mentorName: string; response: string }>> {
  // Run all mentor responses in parallel for speed
  const responses = await Promise.all(
    mentors.map(async (mentor) => {
      const response = await mentorChat(mentor.name, mentor.systemPrompt, question);
      return { mentorName: mentor.name, response };
    })
  );
  return responses;
}

/** Generate daily wisdom from a specific mentor */
export async function generateDailyWisdom(mentorName: string, mentorContext: string): Promise<string> {
  return chat([
    {
      role: "system",
      content: `You are ${mentorName}. Share a brief daily wisdom — a thought, quote,
      challenge, or reflection that captures your philosophy. Keep it under 100 words.
      Make it feel personal and powerful. End with a small challenge or question.
      Context about you: ${mentorContext}`,
    },
    {
      role: "user",
      content: "Share your wisdom for today.",
    },
  ], { temperature: 0.9, maxTokens: 300 });
}

/** Generate weekly insight summary from all sessions */
export async function generateInsightSummary(
  insights: Array<{ mentor: string; content: string; date: string }>
): Promise<string> {
  return chat([
    {
      role: "system",
      content: `You are an AI insight analyst. Review the user's saved insights from
      their mentoring sessions and create a weekly summary that identifies:
      1. Common themes across different mentors
      2. Key action items mentioned
      3. Growth patterns
      4. Suggested focus areas for next week
      Be specific and reference the actual insights.`,
    },
    {
      role: "user",
      content: `Here are my saved insights from this week:\n${JSON.stringify(insights, null, 2)}`,
    },
  ]);
}

/** Recommend mentors based on user goals */
export async function recommendMentors(goals: string[]): Promise<string> {
  return chat([
    {
      role: "system",
      content: `You are Mentor.ai's recommendation engine. Based on the user's goals,
      recommend 5 historical/modern mentors and explain why each would be valuable.
      Return JSON: [{"name": "...", "reason": "...", "category": "...", "bestFor": "..."}]`,
    },
    {
      role: "user",
      content: `My goals are: ${goals.join(", ")}. Who should I learn from?`,
    },
  ]);
}

export async function checkAIStatus(): Promise<{ available: boolean; model: string; error?: string }> {
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    if (!response.ok) return { available: false, model: MODEL, error: "Ollama not responding" };
    const data = await response.json();
    const found = data.models?.some((m: { name: string }) => m.name.startsWith(MODEL));
    return { available: !!found, model: MODEL, error: found ? undefined : `Model ${MODEL} not found` };
  } catch {
    return { available: false, model: MODEL, error: "Ollama is not running" };
  }
}
