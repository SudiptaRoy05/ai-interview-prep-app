import { getQuestionsForLanguage } from '../data/interviewBank.js';

const STORAGE_KEY_API = 'devprep_gemini_api_key';
const STORAGE_KEY_QUESTIONS = 'devprep_cached_questions_';
const STORAGE_KEY_EXAM = 'devprep_active_exam_';

export function getStoredApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEY_API) || '';
  } catch (e) {
    return '';
  }
}

export function saveStoredApiKey(key) {
  try {
    if (key) {
      localStorage.setItem(STORAGE_KEY_API, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_API);
    }
  } catch (e) {
    console.error('Failed to save API key to local storage', e);
  }
}

/**
 * Generates 50 interview questions for any language.
 * Uses Gemini API if API key is provided, or built-in high-fidelity AI engine.
 */
export async function generate50InterviewQuestions(languageId, languageName, onStatusUpdate = () => {}) {
  const apiKey = getStoredApiKey();

  // Check cached questions first
  const cacheKey = `${STORAGE_KEY_QUESTIONS}${languageId}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length >= 50) {
        onStatusUpdate('Loaded cached AI interview set');
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }

  // If user provided a Gemini API key, attempt live Gemini API call
  if (apiKey) {
    try {
      onStatusUpdate(`Querying Gemini AI for 50 ${languageName} interview questions...`);
      const aiQuestions = await fetchQuestionsFromGemini(languageName, apiKey);
      if (aiQuestions && aiQuestions.length >= 50) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(aiQuestions));
        } catch (_) {}
        return aiQuestions;
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to built-in AI bank:', err);
      onStatusUpdate('Gemini API unreachable, utilizing built-in AI engine...');
    }
  }

  // High-fidelity fallback / built-in generator
  onStatusUpdate(`Synthesizing 50 comprehensive questions for ${languageName}...`);
  // Brief delay to give realistic AI synthesis feel
  await new Promise(r => setTimeout(r, 600));

  const questions = getQuestionsForLanguage(languageId, languageName);
  try {
    localStorage.setItem(cacheKey, JSON.stringify(questions));
  } catch (_) {}

  return questions;
}

/**
 * Direct call to Google Gemini API
 */
async function fetchQuestionsFromGemini(languageName, apiKey) {
  const prompt = `Generate exactly 50 interview questions for ${languageName}.
Return valid JSON only (no markdown, no backticks).
Format:
[
  {
    "id": 1,
    "question": "Clear technical question title",
    "topic": "Specific category e.g. Memory, Concurrency, Syntax",
    "difficulty": "Beginner" | "Intermediate" | "Advanced",
    "answer": "Comprehensive 3-5 sentence explanation covering core mechanics, tradeoffs, and internals",
    "code": "Realistic code snippet demonstrating the concept",
    "tip": "Actionable interview tip or common mistake",
    "mcq": {
      "question": "Multiple choice question testing this concept",
      "options": ["Correct Option", "Distractor 1", "Distractor 2", "Distractor 3"],
      "correctIndex": 0,
      "explanation": "Why the correct answer is right"
    }
  }
]`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');

  const parsed = JSON.parse(text);
  if (Array.isArray(parsed) && parsed.length >= 40) {
    // Ensure all 50 items have valid IDs and MCQ formats
    return parsed.map((item, idx) => ({
      ...item,
      id: idx + 1,
      mcq: item.mcq || {
        question: `Regarding ${item.question}: which statement is true?`,
        options: [item.answer.slice(0, 80), 'It causes undefined behavior in standard runtimes', 'It is deprecated in modern versions', 'It requires manual pointer arithmetic'],
        correctIndex: 0,
        explanation: item.answer
      }
    }));
  }

  throw new Error('Invalid format returned by AI');
}

/**
 * Generates an Exam of exactly 20 questions derived from the 50 interview questions studied
 */
export function generateExamFrom50Questions(questions50, count = 20) {
  if (!questions50 || questions50.length === 0) return [];

  // Shuffle and pick 20 questions
  const shuffled = [...questions50].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, questions50.length));

  // Transform each into an exam question with randomized options
  return selected.map((sourceQ, index) => {
    const rawMcq = sourceQ.mcq || {
      question: `What is the key takeaway regarding: "${sourceQ.question}"?`,
      options: [
        sourceQ.answer.slice(0, 100),
        "It was completely deprecated in the latest language standard release",
        "It triggers an automatic fatal memory fault in standard runtimes",
        "It can only be executed in single-threaded assembly environments"
      ],
      correctIndex: 0,
      explanation: sourceQ.answer
    };

    // Shuffle options while keeping track of correct answer
    const originalOptions = [...rawMcq.options];
    const correctText = originalOptions[rawMcq.correctIndex || 0];

    // Create randomized permutation
    const indexedOptions = originalOptions.map((text, i) => ({ text, isCorrect: i === (rawMcq.correctIndex || 0) }));
    for (let i = indexedOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]];
    }

    const shuffledOptions = indexedOptions.map(o => o.text);
    const newCorrectIndex = indexedOptions.findIndex(o => o.isCorrect);

    return {
      examQuestionId: index + 1,
      sourceQuestionId: sourceQ.id,
      sourceTitle: sourceQ.question,
      topic: sourceQ.topic,
      difficulty: sourceQ.difficulty,
      question: rawMcq.question,
      code: sourceQ.code || null,
      options: shuffledOptions,
      correctIndex: newCorrectIndex,
      explanation: rawMcq.explanation || sourceQ.answer,
      interviewerTip: sourceQ.tip
    };
  });
}
