import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { ChatMessage } from '@astromate/shared';

// Read at call time (not module load time) to ensure dotenv has loaded
function getBaseUrl() {
  return process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
}
function getModel() {
  try {
    const envPaths = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(__dirname, '../../.env'),
    ];
    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const match = content.match(/OLLAMA_MODEL=["']?([^"'\r\n]+)/);
        if (match) return match[1].trim();
      }
    }
  } catch {}
  const model = process.env.OLLAMA_MODEL ?? 'qwen2.5:1.5b';
  return model.replace(/^"|"$/g, ''); // strip any surrounding quotes
}

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
 */
export async function isOllamaRunning(): Promise<boolean> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/tags`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Generates a response from the local Ollama LLM.
 */
export async function generateResponse(
  systemPrompt: string,
  conversationHistory: Array<{ role: 'USER' | 'ASSISTANT'; content: string }>
): Promise<string> {
  const model = getModel();
  const baseUrl = getBaseUrl();

  console.log(`[Ollama] Using model: "${model}" at ${baseUrl}`);

  const messages: OllamaMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map((m) => ({
      role: m.role === 'USER' ? ('user' as const) : ('assistant' as const),
      content: m.content,
    })),
  ];

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        options: {
          temperature: 0.55,
          top_p: 0.9,
          num_predict: 80,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${body}`);
    }

    const data = (await response.json()) as OllamaChatResponse;
    return data.message.content.trim();
  } catch (error) {
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      throw new Error('Ollama is not running. Please start it with: ollama serve');
    }
    throw error;
  }
}

/**
 * Uses Ollama to generate a memory summary of a conversation chunk.
 */
export async function generateMemorySummary(
  messages: ChatMessage[]
): Promise<string> {
  const model = getModel();
  const baseUrl = getBaseUrl();

  const conversation = messages
    .map((m) => `${m.role === 'USER' ? 'User' : 'AI'}: ${m.content}`)
    .join('\n');

  const summaryPrompt = `Summarize the key facts, topics discussed, and anything personal the user shared in this conversation. Be concise (2-3 sentences max). Focus on facts about the user, not the AI's responses.\n\nConversation:\n${conversation}`;

  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
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
 * Generates a proactive message for an inactive user.
 */
export async function generateProactiveMessage(
  systemPrompt: string,
  userName: string,
  daysSinceActive: number
): Promise<string> {
  const model = getModel();
  const baseUrl = getBaseUrl();

  const proactiveInstruction = `${systemPrompt}\n\n${userName} hasn't talked to you in ${daysSinceActive} day(s). Send them a short, casual message to check in. Stay in character. Don't be needy. Be yourself.`;

  const messages: OllamaMessage[] = [
    { role: 'system', content: proactiveInstruction },
    { role: 'user', content: '[Send a proactive check-in message to the user]' },
  ];

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
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
    return 'hey. you alive? just checking.';
  }
}
