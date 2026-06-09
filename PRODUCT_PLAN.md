# Sally's AI Career Coach Product Plan

Sally's AI Career Coach is a job application assistant. It helps a candidate move from finding a role to deciding whether to apply, tailoring their resume, and preparing for interviews using only truthful career evidence.

## Product Goal

Help a job seeker move from:

```text
"I found a job I like"
```

to:

```text
"I know how well I match, what to improve, what to submit, and how to prepare."
```

## Product Focus

The immediate product focus is:

```text
Help me decide, tailor, and submit a resume today.
```

Interview preparation is important, but it should come after the resume submission workflow is strong enough to use for real applications.

## Core Inputs

Most tools use the same two inputs:

- Resume
- Job description

The resume input should support:

- Paste resume text
- Upload `.docx` resume
- Later: upload PDF resume
- Later if needed: legacy `.doc` resume support

Later interview tools may add:

- Revised resume
- Career history notes
- Work story bank
- Interview question
- Tone or seniority preference

## Core Principles

- Keep the app beginner-friendly.
- Optimise for real job applications, not generic career advice.
- Prioritise truthful optimisation over keyword stuffing.
- Never invent experience, projects, metrics, responsibilities, or achievements.
- Make outputs practical enough that the user can edit a resume immediately.
- Separate resume submission tools from interview preparation tools.

## Tool Roadmap

### 1. ATS Match & Gap Analysis Agent

Status: Next priority

Purpose: Determine whether the resume is likely to pass ATS screening and identify missing keywords, skills, experience areas, and risks.

Inputs:

- Resume
- Job description

Outputs:

- ATS Score
- Keyword Match Score
- Skills Match Score
- Industry/domain match
- Seniority match
- Technology/platform match
- Leadership match
- Top 10 matching areas
- Top 10 missing areas
- Missing keywords
- Missing experience areas
- Potential ATS risks
- Generic or weak resume sections
- Likelihood of passing ATS
- Specific recommendations to improve ATS performance

User question answered:

```text
Will my resume pass screening for this role, and what is missing?
```

### 2. Recruiter 8-Second Scan Agent

Status: Next priority

Purpose: Simulate how a recruiter would review the resume during a very fast first pass while looking for the specific requirements in the job ad.

Inputs:

- Resume
- Job description

Outputs:

- One-sentence recruiter target summary from the job ad
- What the recruiter is looking for in the job ad
- What the recruiter sees quickly in the resume
- Whether the job-ad target is visible in the resume profile/about me, key capabilities, career summary, qualifications, or first-page content
- Important job-ad signals that need to show faster on the first page
- Attention gate: Passes, Partial, or Misses
- Fast-scan supporting evidence from the second page, later resume content, or previous roles
- Clarity
- Seniority read
- Relevance
- Differentiation
- Credibility
- Recruiter decision: Reject, Maybe, Shortlist, Strong Shortlist, or Must Screen
- Short reason for the decision
- Recommendations to improve recruiter attention and application conversion

Rules:

- The recruiter scan should act as if the recruiter is reading the specific job ad first, then quickly scanning the resume.
- The decision should depend heavily on whether the first page/profile/key capabilities clearly echo the job-ad target.
- If real resume pages are not available, treat the early resume content as the first-page proxy.
- Include a one-sentence recruiter target such as: "I am looking for someone who has owned product vision, roadmap, and can handle regulatory awareness."
- Use a two-stage recruiter model:
  1. First 5 seconds: the first page/top section must capture attention for the job-ad target.
  2. Next 5 seconds: the recruiter quickly scans the second page, later resume content, or previous roles to see whether proof jumps out enough to justify Shortlist, Strong Shortlist, Must Screen, Maybe, or Reject.
- Do not shortlist solely because later experience is strong if the first page fails to make the target visible.
- Later evidence still has to be visible in a fast scan; do not rely on details that require careful reading.

User question answered:

```text
Would a recruiter looking at this specific job ad keep reading this resume?
```

### 3. Executive Profile Generator Agent

Status: Planned for Apply Today workflow

Purpose: Create a strong top-of-resume profile tailored to the target role.

Inputs:

- Resume
- Job description

Outputs:

- Executive Summary
- Why Me Statement
- LinkedIn About Section Version
- Short explanation of what the positioning emphasises

Rules:

- Keep the executive summary to 4-6 lines maximum.
- Immediately establish seniority.
- Highlight relevant experience.
- Include platform ownership and leadership where supported.
- Include scale, budgets, customers, teams, or platforms where supported.

User question answered:

```text
How should I position myself at the top of my resume?
```

### 4. Resume Bullet Optimisation Agent

Status: Planned for Apply Today workflow

Purpose: Improve weak resume bullet points so they are clearer, more outcome-focused, and better aligned to the role.

Inputs:

- Resume
- Job description

Outputs:

- Important job ad keywords
- Resume status for each keyword: Found, Weak, or Missing
- Weak bullets
- Generic bullets
- Bullets lacking outcomes
- Bullets lacking business impact
- Bullets lacking measurable results
- Original bullet
- Improved bullet
- Keywords added or strengthened
- Reason for change
- Truthfulness note

Rules:

- Use strong action verbs.
- Use outcome-focused language.
- Include business impact where supported.
- Include relevant job keywords only where truthful.
- Quantify achievements only where evidence exists.
- Preserve factual accuracy.
- If an important job-ad keyword is not supported by the resume, show it as a gap rather than forcing it into a rewrite.

User question answered:

```text
Which resume bullets should I improve before I apply?
```

### 5. Resume Re-Review Agent

Status: Planned for Apply Today workflow

Purpose: Compare the original and revised resume against the target job description to confirm whether the changes improved the application.

Inputs:

- Original resume
- Revised resume
- Job description

Outputs:

- Before vs After Score
- ATS improvement
- Recruiter appeal improvement
- Hiring manager appeal improvement
- Keyword coverage improvement
- Interview conversion likelihood
- Remaining gaps
- Remaining risks
- Final recommendation
- Final decision: Reject, Maybe, Shortlist, or Strong Contender

User question answered:

```text
Is this revised resume now strong enough to submit?
```

### 6. Cover Letter Generator

Status: Later in Application Pack

Purpose: Generate a tailored cover letter or short application message using the resume and job description.

Inputs:

- Resume
- Job description
- Optional tone

Outputs:

- Cover letter
- Short application email version
- Optional recruiter message

User question answered:

```text
What should I send with this application?
```

### 7. Interview Question Predictor Agent

Status: Later

Purpose: Predict likely interview questions from the job description and resume fit.

Inputs:

- Resume
- Job description

Outputs:

- Critical responsibilities
- Critical stakeholder groups
- Technical expectations
- Leadership expectations
- Delivery expectations
- Top behavioural questions
- Top technical questions
- Stakeholder management questions
- Prioritisation questions
- Risk and governance questions
- Likelihood ranking
- Reason each question is likely

User question answered:

```text
What am I likely to be asked in an interview?
```

### 8. Personal STAR Coach Agent

Status: Later, high value

Purpose: Help the user answer interview questions using only their actual experience.

Inputs:

- Resume
- Job description
- Career history notes or story bank
- Interview question

Outputs:

- Question
- Best matching example from the user's background
- Why that example is strongest
- STAR answer
- Follow-up questions
- Coaching feedback
- Honest note when no suitable example exists
- Conceptual answer guidance when no example exists

Rules:

- Use only the experience provided by the user.
- Never invent examples.
- Never create fictional projects, achievements, or responsibilities.
- Keep answers realistic and conversational.

User question answered:

```text
How do I answer this interview question using my real experience?
```

## Build Phases

### Phase 1: Apply Today

Goal: Make Sally's AI Career Coach useful for real job applications immediately.

Priority:

1. ATS Match & Gap Analysis Agent
2. Recruiter 8-Second Scan Agent
3. Executive Profile Generator Agent
4. Resume Bullet Optimisation Agent
5. Resume Re-Review Agent

Ideal user flow:

```text
Paste resume + job description
Run ATS Match & Gap Analysis
Run Recruiter 8-Second Scan
Generate executive profile
Optimise resume bullets
Paste revised resume
Run Resume Re-Review
Apply
```

### Phase 2: Application Pack

Goal: Help the user create supporting material after the resume is ready.

Priority:

1. Cover Letter Generator
2. Short application email
3. LinkedIn/recruiter message
4. Optional saved application history

### Phase 3: Interview Prep

Goal: Prepare the user once applications start converting into interviews.

Priority:

1. Interview Question Predictor Agent
2. Personal STAR Coach Agent
3. Career story bank
4. Interview answer rehearsal and refinement

## Recommended App Journey

The app should feel like a guided job application workspace, not a collection of disconnected prompts.

### Step 1: Start Application

The user adds:

- Resume
- Job description

For the resume, the user can either paste text or upload a `.docx` file. Upload should extract the resume text into the app so the user can review it before running analysis.

The app shows a clear primary action:

```text
Start Fit Check
```

### Step 2: Fit Check

The app runs the first two decision tools:

- ATS Match & Gap Analysis
- Recruiter 8-Second Scan

The user sees:

- Whether this role is worth applying for
- Whether the resume is likely to pass screening
- What is missing
- What the recruiter is looking for in this specific job ad
- What the recruiter would quickly see in the resume
- Whether the resume currently reads as Reject, Maybe, Shortlist, Strong Shortlist, or Must Screen
- The next best action in the Apply Today workflow

### Step 3: Improve Resume

The app offers focused next actions:

- Generate Executive Profile
- Optimise Resume Bullets

The user can copy improved sections into their resume.

The Resume Bullet Optimiser should show:

- Job ad keyword
- Resume status: Found, Weak, or Missing
- Original weak bullet
- Change to this improved bullet
- Why this helps
- Keywords added or strengthened
- Truthfulness note

This step should answer:

```text
What exact resume text should I change before I apply?
```

### Step 4: Re-Review

The user pastes the revised resume.

The app compares:

- Original resume
- Revised resume
- Job description

The user sees:

- Before vs after score
- Remaining gaps
- Remaining risks
- Final recommendation

### Step 5: Submit

The app can later generate:

- Cover letter
- Short email
- Recruiter message

### Step 6: Prepare For Interview

Later, the app can move from application mode into interview mode:

- Predict questions
- Match questions to real examples
- Draft STAR answers
- Identify missing stories

## UI Look And Feel Options

### Option A: Guided Workflow

Best for: applying today with low overwhelm.

Layout:

```text
Header
Progress steps: Fit Check -> Improve Resume -> Re-Review -> Submit

Resume input | Job description input

Recommended next action
Results
Continue to Improve Resume
```

Feel:

- Calm
- Clear
- Step-by-step
- Good for a non-technical user

Why this is recommended:

- It matches the real job application journey.
- It prevents the user from wondering which tool to run first.
- It can still expose advanced tools later.

### Option B: Tool Dashboard

Best for: power users who know exactly what they want.

Layout:

```text
Resume input | Job description input

Choose tool:
[ATS Match]
[Recruiter Scan]
[Profile Generator]
[Bullet Optimiser]
[Re-Review]

Results
```

Feel:

- Fast
- Direct
- Modular
- Slightly more technical

Tradeoff:

- Easier to build.
- Less guided for a user trying to apply under time pressure.

### Option C: Application Workspace

Best for: a fuller product later.

Layout:

```text
Application title / company / role

Left panel: Inputs and saved versions
Main panel: Current step and results
Right panel: Checklist and next actions
```

Feel:

- More complete
- More professional
- Better once saved jobs and application history exist

Tradeoff:

- Too heavy for the immediate version unless we need saved applications soon.

## Current UI Recommendation

Start with Option A: Guided Workflow.

Use a simple step-based journey:

1. Fit Check
2. Improve Resume
3. Re-Review
4. Submit
5. Interview Prep later

This keeps the first version practical for applying today while leaving room to add a fuller dashboard later.

## Mobile And Upload Requirements

The app must work comfortably on a mobile phone.

Mobile rules:

- Use a single-column layout on phones.
- Stack resume input above job description input.
- Make primary action buttons full-width and easy to tap.
- Keep result sections full-width.
- Keep the next best action near the top of results.
- Do not rely on hover-only controls.
- Make copy buttons large enough for touch use.

Resume upload rules:

- Prioritise `.docx` upload first.
- Extract resume text from the uploaded document.
- Show the extracted text in the resume input box so the user can check it.
- Allow the user to edit the extracted text before analysis.
- Keep paste as a fallback for all users.
- Treat legacy `.doc` support as a later enhancement because it is harder to parse reliably in a browser/server workflow.
