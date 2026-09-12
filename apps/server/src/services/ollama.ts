import fetch from 'node-fetch';
import { ChatMessage } from '@astromate/shared';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3';

interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaChatResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

/**
 * Checks if Ollama is running and accessible.
 * @returns True if Ollama is reachable
 */
export async function isOllamaRunning(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Generates a response from the local Ollama LLM.
 * @param systemPrompt - The dynamic system prompt built by the relationship engine
 * @param conversationHistory - Recent messages for context (last 20)
 * @returns The AI's response text
 */
export async function generateResponse(
  systemPrompt: string,
  conversationHistory: Array<{ role: 'USER' | 'ASSISTANT'; content: string }>
): Promise<string> {
  const messages: OllamaMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map((m) => ({
      role: m.role === 'USER' ? ('user' as const) : ('assistant' as const),
      content: m.content,
    })),
  ];

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: false,
        options: {
          temperature: 0.85,
          top_p: 0.9,
          num_predict: 150, // Keep responses short
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as OllamaChatResponse;
    return data.message.content.trim();
  } catch (error) {
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      throw new Error(
        'Ollama is not running. Please start it with: ollama serve'
      );
    }
    throw error;
  }
}

/**
 * Uses Ollama to generate a memory summary of a conversation chunk.
 * Called automatically every 20 messages to maintain long-term memory.
 * @param messages - The messages to summarize
 * @returns A concise summary string
 */
export async function generateMemorySummary(
  messages: ChatMessage[]
): Promise<string> {
  const conversation = messages
    .map((m) => `${m.role === 'USER' ? 'User' : 'AI'}: ${m.content}`)
    .join('\n');

  const summaryPrompt = `Summarize the key facts, topics discussed, and anything personal the user shared in this conversation. Be concise (2-3 sentences max). Focus on facts about the user, not the AI's responses.\n\nConversation:\n${conversation}`;

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: summaryPrompt,
        stream: false,
        options: { temperature: 0.3, num_predict: 100 },
      }),
    });

    if (!response.ok) throw new Error('Failed to generate memory summary');

    const data = (await response.json()) as { response: string };
    return data.response.trim();
  } catch (error) {
    console.error('[Memory] Failed to generate summary:', error);
    return 'User had a conversation with their AstroMate.';
  }
}

/**
 * Generates a proactive message for a user who has been inactive.
 * @param systemPrompt - The user's personalized system prompt
 * @param userName - The user's name
 * @param daysSinceActive - How many days since last activity
 * @returns A proactive message string
 */
export async function generateProactiveMessage(
  systemPrompt: string,
  userName: string,
  daysSinceActive: number
): Promise<string> {
  const proactiveInstruction = `${systemPrompt}\n\n${userName} hasn't talked to you in ${daysSinceActive} day(s). Send them a short, casual message to check in. Stay in character. Don't be needy. Be yourself.`;

  const messages: OllamaMessage[] = [
    { role: 'system', content: proactiveInstruction },
    {
      role: 'user',
      content: '[Send a proactive check-in message to the user]',
    },
  ];

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages,
        stream: false,
        options: { temperature: 0.9, num_predict: 80 },
      }),
    });

    if (!response.ok) throw new Error('Failed to generate proactive message');

    const data = (await response.json()) as OllamaChatResponse;
    return data.message.content.trim();
  } catch (error) {
    console.error('[Proactive] Failed to generate message:', error);
    return "hey. you alive? just checking.";
  }
}
