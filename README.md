# Sally's AI Career Coach

Sally's AI Career Coach is a beginner-friendly React app that helps turn a
resume and job description into a practical Apply Today workspace.

## What The App Does

- Lets you paste a resume into one text box.
- Lets you upload a `.docx` resume and review the extracted text.
- Lets you paste a job description into another text box.
- Sends both pieces of text to a small local server.
- The local server safely calls the OpenAI API using the key in `.env`.
- Includes a **Fit Check** for application readiness, ATS match, missing areas,
  biggest risks, and a job-ad-specific recruiter 8-second scan.
- Fit Check starts with a practical **Should I apply based on fit?** answer:
  Yes, Not yet, or No.
- Includes separate **ATS + Bullets** and **Profile + Key Capabilities**
  modules for paste-ready wording suggestions.
- Includes a shared **Known experience or keywords to consider** box for
  truthful capabilities that are relevant but not obvious in the resume yet.
- Fit Check is recommended but optional. You can start with any module, then
  run or re-run Fit Check later.
- Fit Check is diagnostic only. Detailed wording changes belong in the
  ATS + Bullets and Profile + Key Capabilities modules.
- For now, re-review is handled by pasting the updated resume back into the
  resume box and re-running Fit Check.
- Bullet rewrites use a clear what/how/so-what structure, such as
  `Delivered X by Y, resulting in Z`, while staying truthful.
- ATS keyword labels now show priority, resume status, and whether an extra
  known-experience note supports the keyword.
- Profile optimisation can use an optional **What they're looking for** input
  to prioritise the most important job requirements, plus an optional
  motivation note to make the About Me/Profile section more personal.
- Includes a **Follow-up** module for a hiring manager LinkedIn outreach
  message after applying, written in a human tone without pushy action
  requests.
- Includes an **Interview Prep** module for company context, a tailored
  "Tell me about yourself" answer, a role-specific USP, and likely interview
  questions.
- Includes server-side tester access codes with quotas, so shared testers can
  only run a limited number of AI calls while an owner code can stay unlimited.

## How To Run It

Open this folder in PowerShell:

```powershell
cd "C:\Users\sally\OneDrive\Documents\rolefit ai github"
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
APP_INVITE_CODES=SALLYOWNER:unlimited,TESTER123:50
KV_REST_API_URL=your_kv_rest_api_url_here
KV_REST_API_TOKEN=your_kv_rest_api_token_here
```

Never put the API key inside the `src` folder. Anything in `src` is browser
code, which means users can inspect it.

`OPENAI_MODEL` controls which OpenAI model the app uses. The default is
`gpt-5-mini` because it is faster and more cost-efficient for this kind of
well-defined resume analysis.

To try a deeper but more expensive analysis, you can change it to:

```env
OPENAI_MODEL=gpt-5.2
```

After changing `.env`, stop the app with `Ctrl + C`, then start it again.

`APP_INVITE_CODES` controls who can run AI tools. Use this format:

```env
APP_INVITE_CODES=SALLYOWNER:unlimited,ANNA123:50
```

That means:

- `SALLYOWNER` has unlimited owner access.
- `ANNA123` has 50 AI calls.
- Usage is tracked in Upstash/Vercel KV, not in the browser.
- The public website never contains the list of valid codes.
- Owner access stays remembered in the browser. Tester access is remembered for
  20 minutes, then the user must enter the code again.

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

This contains the main Sally's AI Career Coach prompts.

The prompts tell the AI to compare the resume and job description across:

- application readiness
- ATS keyword match
- recruiter 8-second scan against the specific job ad
- missing or weak keywords
- biggest risks
- truthful bullet rewrites
- profile/about me and key capability rewrites

### `server/analysisSchema.js`

This describes the exact JSON shape we want back from OpenAI.

That makes the app easier to build because React receives predictable fields
like:

- `overallMatchScore`
- `atsKeywordMatch`
- `recruiterScan`
- `missingOrWeakKeywords`
- `weakestBullets`
- `improvedProfile`
- `keyCapabilities`

### `src/main.jsx`

This is the starting point for React. It finds the `root` div from
`index.html`, loads `App.jsx`, and displays the app on the page.

### `src/App.jsx`

This is the main screen. It contains:

- the app title
- the resume textarea
- the `.docx` resume upload control
- the job description textarea
- the known experience or keywords textarea
- the Profile module's optional What they're looking for textarea
- the module buttons for Fit Check, ATS + Bullets, Profile + Key Capabilities,
  Follow-up, and Interview Prep
- loading and error states
- the results area

When you click **Start Fit Check**, this file sends the text to the local server at:

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
