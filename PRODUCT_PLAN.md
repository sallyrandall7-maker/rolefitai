# RoleFit AI Product Plan

RoleFit AI is a job application assistant. It helps a candidate compare their resume against a job ad, improve their resume for ATS/recruiter search, and generate job-application materials.

## Product Goal

Help a job seeker move from:

```text
"I found a job I like"
```

to:

```text
"I know how well I match, what to improve, and what to submit"
```

## Core Inputs

Most tools should use the same two core inputs:

- Resume
- Job description

Some later tools may add extra options, such as tone of voice or interview example notes.

## Planned Tools

### 1. Role Match

Status: Built

Purpose: Show whether the resume is aligned with the job description.

Outputs:

- Overall role match score
- ATS keyword match score
- Recruiter search simulation
- Missing or weak keywords
- Resume improvement suggestions
- Interview risk areas
- Likely interview questions

User question answered:

```text
How well does my resume fit this role?
```

### 2. ATS Bullet Optimiser

Status: In progress

Purpose: Help the user improve existing resume bullets so ATS systems and recruiters can pick up relevant job-ad keywords more easily.

Outputs:

- Important job-ad keywords
- Found / Weak / Missing keyword status
- Weakest resume bullets
- Suggested rewritten bullet points
- Top practical fixes

Rules:

- Do not invent experience.
- Do not force unsupported keywords into bullets.
- Keep rewritten bullets truthful and concise.

User question answered:

```text
Which resume bullets should I change so I get picked up faster?
```

### 3. Resume Profile Generator

Status: Planned

Purpose: Create a strong top-of-resume profile or "About Me" section tailored to the job.

Options:

- 1 paragraph version
- 2 paragraph version
- Tone options later if needed

Outputs:

- Strong resume profile paragraph
- Optional alternate version
- Short note explaining what the profile is emphasising

User question answered:

```text
How should I position myself at the top of my resume for this role?
```

### 4. Cover Letter Generator

Status: Planned

Purpose: Generate a tailored cover letter using the resume and job description.

Extra input:

- Tone of voice

Possible tone options:

- Professional and concise
- Warm and human
- Confident
- Career-change friendly
- Executive

Outputs:

- Cover letter
- Optional short email version later

User question answered:

```text
How do I write a tailored cover letter for this job?
```

### 5. Interview STAR Bank

Status: Later

Purpose: Help the user prepare for interviews after they start getting responses.

Possible inputs:

- Resume
- Job description
- User-provided examples
- CSV or table of work stories later

Outputs:

- STAR stories
- Interview question mapping
- Evidence bank
- Gaps to prepare

User question answered:

```text
Which examples should I prepare for this interview?
```

## Build Phases

### Phase 1: Diagnostic

Build and refine Role Match.

Status: Built

### Phase 2: Resume Submission Tools

Build the tools needed before submitting an application:

- ATS Bullet Optimiser
- Resume Profile Generator
- Cover Letter Generator

Priority:

1. ATS Bullet Optimiser
2. Resume Profile Generator
3. Cover Letter Generator

### Phase 3: Interview Preparation

Build the Interview STAR Bank once the resume-submission workflow feels strong.

## UI Direction

The app should stay simple and beginner-friendly.

Recommended layout:

```text
RoleFit AI

Resume input
Job description input

Choose tool
[ Role Match ]
[ ATS Bullet Optimiser ]
[ Profile Generator ]
[ Cover Letter ]

Analyse / Generate

Results
```

Important UI principles:

- Keep the resume and job description inputs shared across tools.
- Make each tool's purpose obvious.
- Do not crowd the Analyse button with module selection.
- Avoid a heavy sidebar until the tool count or navigation complexity requires it.
- Use clear result sections for each tool.

## Current Product Decision

Move away from the left-sidebar experiment for now.

Use a clearer "Choose tool" section instead. This should feel lighter for a small app and more natural for a user who is working through job-application tasks.
