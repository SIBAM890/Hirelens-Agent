# System Architecture

## Overview
HireLens Agent is a comprehensive AI-powered recruitment platform designed to automate the hiring process through a series of intelligent "Gates".

### High-Level Block Diagram

```mermaid
graph TD
    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef backend fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef database fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    classDef external fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef actor fill:#fff,stroke:#333,stroke-width:2px,stroke-dasharray: 5 5;

    %% Actors
    User((Candidate)):::actor
    Admin((HR Manager)):::actor

    %% External Services
    subgraph External_Services["External Services"]
        direction TB
        Gemini[Gemini AI API]:::external
        SMTP[Email Service]:::external
    end

    %% Frontend
    subgraph Frontend["React Setup - Vite"]
        direction TB
        
        %% Core
        App[App.jsx / Router]:::frontend
        AuthContext[Auth Context]:::frontend
        API_Service[API Service - Axios]:::frontend

        %% Pages
        Landing[Landing Page]:::frontend
        Login[Login / Register]:::frontend
        
        %% HR Flow
        HR_Dash[HR Dashboard]:::frontend
        Create_Job[Create Job Agent]:::frontend
        Job_Chatbot[AI Job Chatbot]:::frontend
        
        %% Candidate Flow
        Job_Board[Job Board]:::frontend
        Gate1[Gate 1 - AI Quiz]:::frontend
        Gate2[Gate 2 - Coding Challenge]:::frontend
        Gate3[Gate 3 - Tech Interview]:::frontend
        Gate4[Gate 4 - HR Interview]:::frontend
        Gate5[Gate 5 - Results]:::frontend

        %% Proctoring
        WebCam[WebCam / FaceAI]:::frontend
    end

    %% Backend
    subgraph Backend["FastAPI Backend"]
        direction TB
        
        %% Main App
        Main[Main App Entry]:::backend
        Middleware[CORS / Auth Middleware]:::backend

        %% Routers
        subgraph Routers["Routers"]
            Auth_Router[Auth Router]:::backend
            HR_Router[HR Router]:::backend
            Cand_Router[Candidate Router]:::backend
            Proctor_Router[Proctoring Router]:::backend
        end

        %% Services
        subgraph Services["Services"]
            Auth_Svc[Auth Service - JWT Bcrypt]:::backend
            Email_Svc[Email Service]:::backend
            HR_Agent[HR Agent - Resume Job Parsing]:::backend
            Review_Svc[Code Review Service]:::backend
            Proctor_Svc[Proctoring Service]:::backend
        end

        %% Data Access
        ORM[SQLAlchemy ORM]:::backend
    end

    %% Database
    subgraph Database["SQLite Database"]
        Users_Table[(Users Table)]:::database
        Jobs_Table[(Jobs Table)]:::database
        Assessment_Table[(Assessments Table)]:::database
    end

    %% Connections
    
    %% User Interactions
    User --> Landing
    User --> Login
    User --> Job_Board
    User --> Gate1
    User --> Gate2
    User --> Gate3
    User --> Gate4
    User --> Gate5

    Admin --> Login
    Admin --> HR_Dash
    Admin --> Create_Job

    %% Frontend Internal
    Landing --> App
    Login --> AuthContext
    HR_Dash --> API_Service
    Gate1 --> WebCam
    Gate2 --> WebCam
    Gate3 --> WebCam
    Gate4 --> WebCam

    %% Frontend to Backend
    API_Service -- HTTP/JSON --> Main

    %% Backend Flow
    Main --> Middleware
    Middleware --> Routers

    %% Router to Service
    Auth_Router --> Auth_Svc
    HR_Router --> HR_Agent
    Cand_Router --> Review_Svc
    Proctor_Router --> Proctor_Svc
    
    %% Service to External
    HR_Agent -- Generate Content --> Gemini
    Review_Svc -- Analyze Code --> Gemini
    Email_Svc -- Send Alerts --> SMTP
    Proctor_Svc -- Analyze Behavior --> Gemini

    %% Database Interactions
    Routers --> ORM
    Services --> ORM
    ORM --> Users_Table
    ORM --> Jobs_Table
    ORM --> Assessment_Table


```

## Component Details

### Frontend (React)
- **Gate 1 (Quiz)**: Timed multiple-choice questions with AI proctoring.
- **Gate 2 (Coding)**: Integrated Monaco Editor, code execution, and tab-switch detection.
- **Gate 3 (Tech Interview)**: Voice-enabled AI interview focusing on technical depth.
- **Gate 4 (HR Interview)**: Behavioral interview with "Sarah" (AI Persona) and sentiment analysis.
- **Proctoring**: continuous face detection via `face-api.js` and focus tracking.

### Backend (FastAPI)
- **Auth**: JWT-based authentication with role-based access control (Candidate vs. HR).
- **HR Router**: Handles job creation, resume parsing, and candidate management.
- **Candidate Router**: Manages the application workflow (Gates 1-5) and submissions.
- **Proctoring Router**: Receives violation alerts and logs suspicious activity.

### External Integration
- **Gemini AI**: Powers the intelligent aspects, including:
    - Parsing job descriptions.
    - Generating quiz questions.
    - Reviewing code submissions.
    - Conducting conversational interviews (Persona).
- **SMTP**: Sends invites and proctoring violation alerts.
