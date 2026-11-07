# DevPrep AI — Programming Interview Questions & Adaptive AI Exam App

An AI-powered technical interview preparation and examination web application built with **React**, **Vite**, and **Tailwind CSS**.

## Features

1. **Language Selection Hub (Page 1)**
   - Curated list of popular programming languages (JavaScript, Python, TypeScript, Go, Rust, Java, C++, C#, PHP, Ruby, Swift, Kotlin, SQL).
   - Real-time search and category filtering (Web, Systems, Backend, Mobile, Data).
   - Custom language generator input: type any language (e.g., Zig, Elixir, Haskell) to synthesize questions on demand.

2. **50 AI-Generated Interview Questions (Page 2)**
   - Generates **exactly 50 in-depth interview questions** complete with:
     - Technical answers breaking down internal mechanics and architecture
     - Formatted code snippets with a 1-click copy button
     - Interviewer tips and common gotchas
     - Difficulty tags (Beginner, Intermediate, Advanced) and topic tags
   - Interactive study tools:
     - Search & filter by difficulty or topic
     - Expand/collapse individual questions or all at once
     - "Mark as Mastered / Studied" tracking with real-time percentage progress bar
   - Sticky action bar with **"Done — Proceed to 20-Question Exam"** button.

3. **Adaptive 20-Question Exam Mode (Page 3)**
   - Synthesizes **20 AI questions derived directly from the 50 interview questions** studied on Page 2.
   - Multiple-choice format (A, B, C, D) with randomized distractors.
   - Interactive 20-question palette with status indicators (answered, unanswered, flagged).
   - Countdown exam timer (20 minutes) with pause/resume and automatic submission on expiration.
   - Flag question button for revisiting tricky questions.

4. **Detailed Exam Results & Analytics (Page 4)**
   - Scorecard with percentage, pass/fail status (70% benchmark), and grade badge (A+, A, B, etc.).
   - Confetti celebration upon passing.
   - Topic-by-topic performance breakdown (e.g., Memory, Concurrency, OOP).
   - Complete 20-question review displaying:
     - Candidate's chosen answer vs verified correct answer
     - Detailed explanation linking back to the source interview question
   - Retake exam (generates a fresh 20-question permutation), review 50 questions, or switch languages.
   - Print/Save performance report.

5. **AI Generation Engine**
   - Built-in dynamic AI generator engine working 100% offline out-of-the-box.
   - Optional Google Gemini API integration (user can supply a free Gemini API key to trigger live LLM generation for any programming language).

## Running the Application

```bash
cd /home/sudipta/ai-interview-app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
