# HireLens Agent - Advanced Workflows

## 1. Candidate Assessment Lifecycle (Sequence Diagram)
This detailed sequence shows the technical interaction during a typical Interview Gate.

```mermaid
sequenceDiagram
    autonumber
    actor C as Candidate
    participant FE as Frontend (React)
    participant API as Backend API
    participant DB as SQLite DB
    participant AI as Gemini AI Agent
    participant EM as Email Service

    Note over C, FE: Gate 1: AI Proctoring & Quiz

    C->>FE: Starts Assessment (Gate 1)
    FE->>FE: Request Fullscreen & Camera
    FE->>API: POST /proctor/start_session
    API->>DB: Create ProctorSession
    
    loop Every 30s
        FE->>FE: Capture Webcam Frame
        FE->>FE: Detect Face (face-api.js)
        alt Violation Detected
            FE->>API: POST /proctor/alert
            API->>DB: Log Violation
            API-->>EM: Send Alert to HR (if Critical)
        end
    end

    FE->>API: GET /quiz/generate
    API->>AI: "Generate 5 MCQs for Python Dev"
    AI-->>API: JSON Questions
    API-->>FE: Return Questions

    C->>FE: Submits Answers
    FE->>API: POST /quiz/submit
    API->>DB: Save Score & Status
    
    alt Score >= 70%
        API-->>FE: Status: PASSED (Unlock Gate 2)
    else Score < 70%
        API-->>FE: Status: REJECTED
        API->>EM: Send Rejection Email
    end
```

## 2. AI Technical Interview Flow (Gate 3)
Details the Voice-to-Voice AI interaction.

```mermaid
sequenceDiagram
    autonumber
    actor C as Candidate
    participant FE as Frontend
    participant STT as Speech-to-Text
    participant API as Backend
    participant AI as Interviewer Agent (Gemini)
    participant TTS as Text-to-Speech

    C->>FE: "Start Interview"
    FE->>API: GET /interview/context
    API->>DB: Fetch Resume & Job Desc
    API-->>FE: Interview Context

    loop Until Interview Complete
        AI->>AI: Generate Question (Based on Context)
        AI-->>FE: Question Text
        FE->>TTS: Speak(Question)
        TTS-->>C: Audio Output

        C->>FE: Speaks Answer
        FE->>STT: Transcribe Audio
        STT-->>FE: Answer Text
        
        FE->>API: POST /interview/answer
        API->>AI: Evaluate Answer & Update Context
        AI-->>API: Feedback & Next Question
    end
    
    API->>DB: Save Interview Transcript & Score
```

## 3. Job Creation Agent (HR Workflow)
How the HR Agent parses raw text into a structured Job Posting.

```mermaid
stateDiagram-v2
    [*] --> Dashboard
    
    state "Job Creation Agent" as JCA {
        Dashboard --> Input: Click "Create Job Agent"
        Input --> Upload: Upload PDF/Doc
        Input --> Text: Paste Job Description
        
        Upload --> Processing: Extract Text
        Text --> Processing
        
        Processing --> AI_Analysis: Send to Gemini
        
        state AI_Analysis {
            [*] --> Parse_Skills
            Parse_Skills --> Extract_Roles
            Extract_Roles --> Generate_Questions
        }
        
        AI_Analysis --> Review: Return JSON Structure
    }
    
    Review --> Edit: HR Edits Details
    Edit --> Review
    Review --> Publish: HR Approves
    Publish --> Database: Save to DB
    Database --> [*]: Job Live
```
