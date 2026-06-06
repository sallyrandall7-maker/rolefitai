# Deploy RoleFit AI To GitHub And Vercel

This guide gets the current app structure ready for an interview demo.

## Important Safety Rule

Do not upload `.env` to GitHub.

The real API key should only live in:

- your local `.env` file while developing
- Vercel Environment Variables when deployed

The app already has `.env` in `.gitignore`, so Git should ignore it.

## How The Deployed App Works

Local development:

```text
React app -> local Node server -> OpenAI
```

Vercel deployment:

```text
React app -> Vercel /api/analyse function -> OpenAI
```

The browser never receives your OpenAI API key.

## Files Added For Deployment

### `api/analyse.js`

This is the Vercel serverless function. When deployed, the browser calls:

```text
/api/analyse
```

Vercel runs this file on the server side.

### `vercel.json`

This tells Vercel:

- how to build the React app
- where the final built files are
- that the API function can run for up to 60 seconds

### `.env.example`

This is a safe example file. It shows what environment variables are needed, but
it does not contain your real key.

## Step 1: Push To GitHub

In PowerShell:

```powershell
cd "C:\Users\sally\OneDrive\Documents\Job search project"
git init
git add .
git commit -m "Prepare RoleFit AI for Vercel deployment"
```

Then create a new GitHub repository and follow GitHub's instructions to push an
existing project.

Before pushing, check this:

```powershell
git status
```

Make sure `.env` is not listed.

## Step 2: Import Into Vercel

1. Go to Vercel.
2. Choose **Add New Project**.
3. Import the GitHub repository.
4. Keep the framework as **Vite** if Vercel detects it.
5. Add environment variables before deploying.

## Step 3: Add Vercel Environment Variables

Add:

```text
OPENAI_API_KEY
```

with your real OpenAI key.

Also add:

```text
OPENAI_MODEL
```

with:

```text
gpt-5-mini
```

## Step 4: Deploy

Click **Deploy** in Vercel.

After deployment, Vercel gives you a public URL. That is the URL you can use for
an interview demo.

## Cost Reminder

Anyone with the demo URL can use your OpenAI API unless you add access control.

For an interview demo, keep:

- `OPENAI_MODEL=gpt-5-mini`
- OpenAI monthly budget limits enabled
- resume/job text under the app's character limit

Later, you can add a demo password or request limit.
