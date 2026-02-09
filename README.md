<div align="center">

# 🧠 HireLens Agent
### The Future of Automated Recruitment

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20Pro-8E44AD?style=for-the-badge&logo=google-bard)](https://deepmind.google/technologies/gemini/)

_An intelligent, end-to-end recruitment platform that automates sourcing, screening, and interviewing using advanced AI Agents._

[View Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📖 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Workflow Diagram](#-workflow-diagram)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Tech Stack](#-tech-stack)

---

## 🚀 Overview
**HireLens Agent** revolutionizes the traditional hiring process by replacing manual screening with a sophisticated pipeline of AI-driven "Gates". Applications are automatically processed through aptitute tests, coding challenges, and conversational AI interviews.

### The 5-Gate System:
1.  **Gate 1 (Aptitude):** AI-proctored logic & reasoning quiz.
2.  **Gate 2 (Technical):** Live coding environment with Monaco Editor.
3.  **Gate 3 (Tech Interview):** Voice-based technical deep-dive.
4.  **Gate 4 (HR Interview):** Behavioral assessment with "Sarah" (AI Persona).
5.  **Gate 5 (Verdict):** Comprehensive report & hiring recommendation.

---

## ✨ Key Features
- **🤖 Autonomous Hiring Agents:** AI parsers can create Jobs from a single description.
- **👁️ AI Proctoring:** Real-time face detection and tab-switch monitoring to ensure integrity.
- **🗣️ Natural Voice Conversastions:** Fluid speech-to-text and text-to-speech interviews.
- **📊 HR Dashboard:** Detailed analytics, candidate status tracking, and "My Agents" management.
- **🎨 Premium UI:** Glassmorphism design, 3D tilt effects, and smooth Framer Motion animations.

---

## 🏗 System Architecture

The platform is built on a decoupled architecture with a React Frontend and FastAPI Backend, communicating via RESTful APIs.

```mermaid
graph TD

classDef frontend fill:#ffffff,stroke:#000000,stroke-width:1.2px,color:#000;
classDef backend fill:#ffffff,stroke:#000000,stroke-width:1.2px,color:#000;
classDef database fill:#ffffff,stroke:#000000,stroke-width:1.2px,color:#000;
classDef external fill:#ffffff,stroke:#000000,stroke-width:1.2px,color:#000;
classDef actor fill:#ffffff,stroke:#000000,stroke-width:1.5px,stroke-dasharray: 4 4,color:#000;



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

---

## 🔄 Workflow Diagram

### Candidate & HR Journey
A streamlined process from Job Creation to Final Offer.

```mermaid
graph TD
    %% Styles
    classDef process fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef gate fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    classDef decision fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;

    Start((Start))
    Login[Login / Register]:::process
    
    subgraph HR_Flow [HR Manager]
        Create[Create Job Agent]:::process
        Monitor[Monitor Candidates]:::process
    end

    subgraph Candidate_Flow [Candidate Gates]
        Apply[Apply for Job]:::process
        G1[Gate 1: Quiz]:::gate
        G2[Gate 2: Code]:::gate
        G3[Gate 3: Tech Interview]:::gate
        G4[Gate 4: HR Interview]:::gate
        G5[Gate 5: Verdict]:::decision
    end

    Start --> Login
    Login --> HR_Flow
    Login --> Candidate_Flow
    
    Create --> Apply
    Apply --> G1 --> G2 --> G3 --> G4 --> G5
```

---

## 📂 Project Structure

<details>
<summary>Click to view detailed file structure</summary>

```bash
HireLens-Agent/
├── backend/                  # FastAPI Backend
│   ├── app/
│   │   ├── core/             # Config & Database
│   │   ├── models/           # SQLAlchemy Models
│   │   ├── routers/          # API Routes (Auth, HR, Candidate)
│   │   ├── schemas/          # Pydantic Models
│   │   └── services/         # Business Logic (AI, Email, Proctoring)
│   ├── hirelens_v2.db        # SQLite Database
│   └── requirements.txt      # Python Dependencies
│
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI Components
│   │   ├── context/          # Auth Context
│   │   ├── pages/            # Page Views
│   │   │   ├── Auth/         # Login/Register
│   │   │   ├── Candidate/    # Gates 1-5 & Job Board
│   │   │   └── HR/           # Dashboard & Job Creation
│   │   └── services/         # API Integration
│   ├── tailwind.config.js    # Styling Config
│   └── vite.config.js        # Build Config
│
├── SYSTEM_ARCHITECTURE.md    # Detailed Architecture Doc
├── WORKFLOW_DIAGRAM.md       # Detailed Workflow Doc
└── README.md                 # Project Documentation
```
</details>

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Access
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000/docs`

---

## 🛠 Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend:** FastAPI, SQLAlchemy, Pydantic, Python-Multipart
- **AI/ML:** Google Gemini Pro, Face-API.js, Web Speech API
- **Database:** SQLite (Dev) / PostgreSQL (Prod ready)

---

<div align="center">
  <sub>Built with ❤️ by the HireLens Team</sub>
</div>
