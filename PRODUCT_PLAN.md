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

Interview preparation is important, but it should come after the Apply Today modules are clean enough to use for real applications.

## Core Inputs

Most tools use the same two inputs:

- Resume
- Job description
- Optional known experience or keywords to consider

The Profile + Key Capabilities module may also use:

- Optional priority requirements / "What they're looking for"

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

The optional known experience or keywords input is for truthful capabilities that may not be obvious in the resume yet. For example, if MDM, data governance, or vendor management is relevant to the job ad and genuinely part of the candidate's experience, the user can add it there so the AI can suggest where to weave it into bullets, key capabilities, or profile wording without inventing evidence.

Known experience must stay within the exact scope the user supplied. For example:

- "Built my own personal AI app using OpenAI Codex" can support a modest AI tooling or hands-on AI experimentation line, but must not become enterprise AI platform leadership.
- "Mentored a senior product owner" can support transferable mentoring or product leadership language, but must not become direct Delivery Lead management.

## Core Principles

- Keep the app beginner-friendly.
- Optimise for real job applications, not generic career advice.
- Prioritise truthful optimisation over keyword stuffing.
- Never invent experience, projects, metrics, responsibilities, or achievements.
- Make outputs practical enough that the user can edit a resume immediately.
- Separate resume submission tools from interview preparation tools.
- Require server-side access codes before AI calls when the app is shared with testers. Owner codes can be unlimited; tester codes should have quotas.

## Tool Roadmap

### 1. ATS Match & Gap Analysis Agent

Status: Built in Fit Check module

Purpose: Determine whether the resume is likely to pass ATS screening and identify missing keywords, skills, experience areas, and risks.

Inputs:

- Resume
- Job description
- Optional priority requirements / "What they're looking for"

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
- Biggest risks, shown as diagnostic signals only

Rules:

- ATS and application readiness scores must be based on the resume as written.
- Optional known experience or keywords can help explain possible gaps, but should not inflate the ATS score unless the content is already visible in the resume.
- Fit Check should not generate paste-ready profile, capability, or bullet wording. Those belong in the ATS + Bullets and Profile + Key Capabilities modules.

User question answered:

```text
Will my resume pass screening for this role, and what is missing?
```

### 2. Recruiter 8-Second Scan Agent

Status: Built in Fit Check module

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
- Biggest risks to recruiter attention and application conversion

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

Status: Built as Profile + Key Capabilities module

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

- Use a recruiter, hiring manager, and ATS reviewer lens.
- Do not create a generic professional summary.
- If priority requirements are supplied, treat them as the main target and use the full job description as supporting context.
- The first sentence must immediately establish the candidate as a match for the role.
- Prioritise hard-to-find requirements and map them to actual candidate evidence.
- Every sentence should answer: "Why should I interview this person?"
- Focus on ownership, outcomes, scale, complexity, technical fluency, stakeholder influence, commercial outcomes, leadership, and operating model impact where supported.
- If the candidate lacks a requirement, identify the closest credible equivalent rather than inventing experience.
- Avoid buzzwords, cliches, corporate jargon, and first-person phrasing.

User question answered:

```text
How should I position myself at the top of my resume?
```

### 4. Resume Bullet Optimisation Agent

Status: Built as ATS + Bullets module

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
- Add a new bullet when the keyword is truthful but not currently visible in a useful existing bullet
- Keywords added or strengthened
- Reason for change
- Truthfulness note

Rules:

- Use strong action verbs.
- Use outcome-focused language.
- Rewritten bullets should usually follow: Deliver/Own/Lead X by Y, enabling/resulting in Z.
- Every rewritten bullet must make the "so what" clear: business value, customer impact, risk reduction, delivery confidence, operational improvement, or stakeholder benefit.
- Paste-ready bullets should avoid dash punctuation because it sounds too AI-generated.
- Include business impact where supported.
- Include relevant job keywords only where truthful.
- Quantify achievements only where evidence exists.
- Preserve factual accuracy.
- If an important job-ad keyword is not supported by the resume, show it as a gap rather than forcing it into a rewrite.
- If an important job-ad keyword is supported by optional known experience but not visible in the resume, mark it as missing or weak in the resume and suggest a truthful Add bullet or capability.
- The ATS keyword status must be based on the resume as written, not on optional known experience.
- Added bullets should show the evidence used and a scope check so the user can confirm the wording does not overclaim.
- For Key Capabilities, Keep and Reword should only be used when the current Key Capabilities section already contains the same or closely related capability line.
- If capability evidence appears elsewhere in the resume, such as role detail, profile/about me, or career summary, the action should be Add because it is not currently visible in Key Capabilities.
- Each key capability suggestion should show its evidence source. Keep and Reword must use Current Key Capabilities as the evidence source.

User question answered:

```text
Which resume bullets should I improve before I apply?
```

### 5. Review Agent

Status: Deferred, not built yet

Purpose: Compare an updated resume against the earlier fit read and target job description to show whether the application has improved.

Near-term decision:

- Do not build this as a separate Phase 1 module yet.
- For now, the user can paste the revised resume back into the resume box and re-run Fit Check.
- A dedicated Review module can come later if re-running Fit Check is not enough.

Inputs:

- Original resume
- Revised resume
- Job description
- Earlier Fit Check result where available

Outputs:

- Before vs After Score
- ATS improvement
- Recruiter appeal improvement
- Hiring manager appeal improvement
- Keyword coverage improvement
- Clear comparison notes, such as "ATS is stronger because the updated resume now includes X"
- Missing keywords that are no longer missing
- Remaining missing or weak keywords
- Recruiter decision movement, such as Maybe to Shortlist
- Remaining gaps
- Remaining risks
- Final recommendation
- Final decision: Reject, Maybe, Shortlist, or Strong Contender

User question answered:

```text
Is this updated resume stronger than the previous version, and what still needs work?
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

### 7. Interview Prep Agent

Status: Next planned build

Purpose: Help the user prepare for interviews for a specific role by turning the resume and job description into a focused opening answer, USP, company context, and likely questions.

Inputs:

- Resume
- Job description
- Company name
- Optional interviewer name

Outputs:

- Company context:
  - What the company does
  - Who its customers or users likely are
  - What problem the role is likely trying to solve
  - Optional interviewer context from public web research when an interviewer name is supplied
- "Tell me about yourself" answer up to 2 minutes
- Role-specific USP, based on what the job ad is looking for
- Likely interview questions grouped by theme:
  - Product and role fit
  - Stakeholder and leadership
  - Delivery, governance, and prioritisation
  - Behavioural questions
- Reason each question is likely

User question answered:

```text
How should I introduce myself, what is my strongest angle, and what questions should I prepare for this role?
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
5. Follow-up message module

Ideal user flow:

```text
Paste resume + job description
Run Fit Check if needed
Generate executive profile
Optimise resume bullets
Paste revised resume
Re-run Fit Check if needed
Apply
```

### Phase 2: Interview Prep

Goal: Prepare the user once applications start converting into interviews.

Priority:

1. Interview Prep Agent
2. Tell me about yourself answer
3. Role-specific USP
4. Likely interview questions
5. Company and interviewer context
6. Personal STAR Coach Agent later
7. Career story bank later
8. Interview answer rehearsal and refinement later

### Phase 3: Application Pack

Goal: Help the user create supporting material after the resume is ready.

Priority:

1. Cover Letter Generator
2. Short application email
3. Recruiter message variants
4. Optional saved application history

## Recommended App Journey

The app should feel like an interconnected job application desk. The user should be able to start with the module they need without being forced through a workflow.

### Shared Inputs

The user adds:

- Resume
- Job description
- Optional known experience or keywords to consider

For the resume, the user can either paste text or upload a `.docx` file. Upload should extract the resume text into the app so the user can review and edit it before running analysis.

The optional known experience or keywords box lets the user add truthful capabilities that the resume may not show clearly yet. The AI can then suggest where those capabilities belong, such as a rewritten bullet, a key capability, or the profile/about me section.

### Module 1: Fit Check

Fit Check is recommended but not mandatory. The user can run or re-run it whenever they want a diagnostic.

Fit Check includes:

- ATS Match & Gap Analysis
- Recruiter 8-Second Scan

The user sees:

- Whether this role is worth applying for
- Should I apply based on fit: Yes, Not yet, or No
- Whether the resume is likely to pass screening
- What is missing
- What the recruiter is looking for in this specific job ad
- What the recruiter would quickly see in the resume
- Whether the resume currently reads as Reject, Maybe, Shortlist, Strong Shortlist, or Must Screen
- Biggest risks to fix in the dedicated improvement modules

### Module 2: ATS + Bullets

The ATS + Bullets module helps the user strengthen job-ad keyword coverage and weaker resume bullets.

It should show:

- Job ad keyword
- Priority label: High priority, Medium priority, or Low priority
- Resume status: Found in resume, Weak in resume, or Missing from resume
- Known experience note: Extra note, No extra note, or No supporting note
- Original weak bullet
- Change to this improved bullet
- Why this helps
- Keywords added or strengthened
- Truthfulness note

This module should answer:

```text
What exact resume text should I change before I apply?
```

### Module 3: Profile + Key Capabilities

The Profile + Key Capabilities module helps the top of the resume mirror the recruiter's target in the first 5 seconds.

It should show:

- Recruiter target summary from the job ad
- Optional "What they're looking for" input to prioritise the most important job requirements
- Current top-section read
- Paste-ready profile/about me section that is optimised for a recruiter spending 3-8 seconds scanning the resume
- Paste-ready profile/about me should integrate: Why me, what problem I solve for the employer, and my motivation
- Paste-ready profile/about me should avoid dash punctuation because it sounds too AI-generated.
- Supporting explanation fields showing how the paragraph answers: Why me, problem I solve, and motivation
- Why the improved profile works
- Key capabilities to keep, add, reword, or remove
- Evidence used and scope check for each key capability, especially where the action is Reword
- Evidence source for each key capability, so the user can see whether it came from Current Key Capabilities, role details, profile/about me, career summary, known context, or a job description gap
- Top-section gaps that should show faster
- Truthfulness note
- Optional user motivation note, used only when supplied
- Precise experience-duration wording. For example, do not turn "16+ years in technology delivery across various roles" into "16+ years in platform ownership" unless the resume clearly supports that exact scope.

This module should answer:

```text
Does the top of my resume quickly say the same thing the recruiter is looking for?
```

### Module 4: Follow-up

The Follow-up module generates a hiring manager outreach message for LinkedIn when the user can see someone on the hiring team.

The hiring manager outreach message should:

- Say the user has applied
- Be 150-250 words
- Feel human and conversational
- Show that the candidate understands what the company is really looking for
- Connect the candidate's experience to the role's underlying needs
- Prioritise mindset fit, operating style fit, problem-solving approach, and leadership style before relevant experience
- Avoid sounding like a cover letter or rewritten resume
- End by putting a face to the application
- Avoid forcing action or asking for a referral, call, meeting, or response
- Avoid generic lines such as "I am passionate about" or "I have extensive experience"
- Avoid dash punctuation

Later the app can also generate:

- Cover letter
- Short email
- Recruiter message variants

### Review Module

Deferred, not built yet.

For the immediate version, the user can:

- Paste the revised resume into the resume input
- Re-run Fit Check
- Use the updated ATS match, recruiter scan, missing areas, and biggest risks as the practical re-review

Later, a dedicated Review module may compare:

- Original resume
- Revised resume
- Job description
- Before vs after score
- ATS and recruiter decision movement
- Missing keywords that are now covered
- Remaining gaps
- Remaining risks
- Final recommendation

### Interview Prep

Next planned module.

Inputs:

- Resume
- Job description
- Company name
- Optional interviewer name

Outputs:

- Company context: what the company does, who the customer likely is, and what problem this role is likely trying to solve
- Company context should use web research based on the company name when supplied, not only the job description.
- Optional interviewer context from public web research when an interviewer name is supplied
- "Tell me about yourself" answer up to 2 minutes
- Role-specific USP based on what the job ad is looking for
- Likely interview questions grouped by product fit, stakeholder leadership, delivery/governance, prioritisation, and behavioural themes

Later interview tools can add:

- Match questions to real examples
- Draft STAR answers
- Identify missing stories

## UI Look And Feel Options

### Option A: Guided Modules

Best for: applying today with low overwhelm.

Layout:

```text
Header
Modules: Fit Check -> ATS + Bullets -> Profile + Key Capabilities -> Follow-up -> Interview Prep

Resume input | Job description input

Results
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
[Review]

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

Use a modular application desk with light guidance.

Top modules:

1. Fit Check
2. ATS + Bullets
3. Profile + Key Capabilities
4. Follow-up
5. Interview Prep

Fit Check should be recommended but not mandatory. The user can:

- Start with any module
- Use Fit Check as a diagnostic
- Use ATS + Bullets when they already know the role fits and want keyword/bullet help
- Use Profile + Key Capabilities when they want the top of the resume to match the recruiter target
- Use Follow-up after applying when they can see someone on the hiring team
- Use Interview Prep when they are preparing for an interview for the same role
- Re-run any module after editing the resume, job description, motivation note, or known experience/keywords

The app should not show a global Recommended next action panel in this phase. Module tabs are enough, and each module should keep its own output focused.

## Mobile And Upload Requirements

The app must work comfortably on a mobile phone.

Mobile rules:

- Use a single-column layout on phones.
- Stack resume input above job description input.
- Make primary action buttons full-width and easy to tap.
- Keep result sections full-width.
- Do not rely on hover-only controls.
- Make copy buttons large enough for touch use.

Resume upload rules:

- Prioritise `.docx` upload first.
- Extract resume text from the uploaded document.
- Show the extracted text in the resume input box so the user can check it.
- Allow the user to edit the extracted text before analysis.
- Keep paste as a fallback for all users.
- Treat legacy `.doc` support as a later enhancement because it is harder to parse reliably in a browser/server workflow.
