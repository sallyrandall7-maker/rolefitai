# RoleFit AI

RoleFit AI is a beginner-friendly React app that compares a resume with a job
description and returns an AI-powered role fit analysis.

## What The App Does

- Lets you paste a resume into one text box.
- Lets you paste a job description into another text box.
- Sends both pieces of text to a small local server.
- The local server safely calls the OpenAI API using the key in `.env`.
- Includes a **Role Match** module for scores, gaps, risks, and interview
  questions.
- Includes an **ATS Bullet Optimiser** module for job keywords, weak resume
  bullets, rewritten bullets, and top fixes.

## How To Run It

Open this folder in PowerShell:

```powershell
cd "C:\Users\sally\OneDrive\Documents\Job search project"
```

Then start the app:

```powershell
npm.cmd run dev
```

This starts two things:

- the React website
- the tiny local API server

Open the local website address shown in the terminal. It is usually:

```text
http://127.0.0.1:5173/
```

If that port is busy, Vite may show a different address such as
`http://127.0.0.1:5174/`.

Leave the terminal window open while using the app.

## Secret Key

Your OpenAI API key belongs in this file:

```text
.env
```

It should look like this:

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5-mini
```

Never put the API key inside the `src` folder. Anything in `src` is browser
code, which means users can inspect it.

`OPENAI_MODEL` controls which OpenAI model RoleFit AI uses. The default is
`gpt-5-mini` because it is faster and more cost-efficient for this kind of
well-defined resume analysis.

To try a deeper but more expensive analysis, you can change it to:

```env
OPENAI_MODEL=gpt-5.2
```

After changing `.env`, stop the app with `Ctrl + C`, then start it again.

## File Guide

### `package.json`

This is the app's settings file. It lists the tools the project needs and the
commands you can run.

Important commands:

- `npm.cmd run dev` starts the React app and the local API server.
- `npm.cmd run dev:client` starts only the React app.
- `npm.cmd run dev:server` starts only the local API server.
- `npm.cmd run build` checks that the React app can be built for production.

The server command uses `--use-system-ca`. This helps Node use the Windows
certificate store when calling the OpenAI API.

### `index.html`

This is the single HTML page that loads the React app. React puts the app inside
this div:

```html
<div id="root"></div>
```

### `vite.config.js`

This tells Vite to use the React plugin. You usually do not need to touch this
file while learning the basics.

### `scripts/dev-all.js`

This starts both parts of the project at once:

- the local API server
- the React website

It exists so you only need one command while developing.

### `api/analyse.js`

This is the Vercel deployment version of the backend. When the app is online,
the browser calls `/api/analyse`, and Vercel runs this file privately on the
server side.

### `vercel.json`

This tells Vercel how to build and serve the app.

### `DEPLOYMENT.md`

This gives step-by-step notes for pushing the project to GitHub and importing it
into Vercel.

### `server/server.js`

This is the tiny backend server. It:

- reads the API key from `.env`
- receives resume and job description text from the React app
- checks that both text boxes have content
- sends the request to OpenAI
- sends the structured analysis back to the React app

This file keeps your API key away from the browser.

### `server/openAiAnalysis.js`

This contains the shared OpenAI request code. The local server and Vercel API
route both use this file.

### `server/analysisPrompt.js`

This contains the main RoleFit AI prompt.

The prompt tells the AI to compare the resume and job description across:

- role fit
- ATS keyword match
- recruiter search visibility
- missing or weak keywords
- resume improvements
- interview risk areas
- likely interview questions

### `server/analysisSchema.js`

This describes the exact JSON shape we want back from OpenAI.

That makes the app easier to build because React receives predictable fields
like:

- `overallMatchScore`
- `atsKeywordMatch`
- `resumeSuggestions`
- `likelyInterviewQuestions`

### `src/main.jsx`

This is the starting point for React. It finds the `root` div from
`index.html`, loads `App.jsx`, and displays the app on the page.

### `src/App.jsx`

This is the main screen. It contains:

- the app title
- the resume textarea
- the job description textarea
- the Analyse button
- loading and error states
- the results area

When you click **Analyse**, this file sends the text to the local server at:

```text
http://127.0.0.1:8787/api/analyse
```

### `src/styles.css`

This file controls how the app looks: spacing, colors, layout, buttons,
textareas, result cards, loading state, error messages, and mobile layout.

### `.gitignore`

This tells Git to ignore generated and private files, including:

- `node_modules`
- `dist`
- `.env`
- any `*.env` file
