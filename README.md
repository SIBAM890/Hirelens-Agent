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
    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef backend fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef database fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    classDef external fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;

    %% Actors
    User((Candidate))
    Admin((HR Manager))

    %% External Services
    subgraph External_Services [External Services]
        direction TB
        Gemini[Gemini AI API]:::external
        SMTP[Email Service]:::external
    end

    %% Frontend
    subgraph Frontend [React Setup (Vite)]
        direction TB
        App[App.jsx / Router]:::frontend
        API[API Service (Axios)]:::frontend
        Pages[Pages (Landing, Gates, Dashboards)]:::frontend
    end

    %% Backend
    subgraph Backend [FastAPI Backend]
        direction TB
        Main[Main App Entry]:::backend
        Routers[Auth, HR, Candidate Routers]:::backend
        Services[AI Agents, Auth, Email]:::backend
        ORM[SQLAlchemy ORM]:::backend
    end

    %% Database
    subgraph Database [SQLite]
        DB[(HireLens DB)]:::database
    end

    %% Flow
    User --> Frontend
    Admin --> Frontend
    Frontend -- JSON/HTTP --> Main
    Main --> Routers
    Routers --> Services
    Services --> external
    Services --> ORM
    ORM --> DB
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
