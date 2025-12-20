# Upscale System Diagrams (Mermaid)

Here are the Mermaid.js text-based diagrams corresponding to the visual assets. You can include these in your markdown files or render them using any Mermaid-compatible editor.

## 1. High-Level System Architecture

```mermaid
graph LR
    subgraph UserNodes [User Devices]
        Laptop["💻 Laptop/Desktop"]
        Mobile["📱 Mobile App"]
    end

    subgraph UpscalePlatform [Upscale Cloud Platform]
        FE["Frontend (Next.js)"]
        API["Backend/API Layer"]
    end

    subgraph ExternalServices [External AI & Services]
        Gemini["🧠 Google Gemini 2.0<br/>(Reasoning Engine)"]
        Vapi["🎙️ Vapi Voice AI<br/>(Speech Processing)"]
        Atlas["🍃 MongoDB Atlas<br/>(Data Storage)"]
        Findwork["🌐 Findwork API<br/>(Job Listings)"]
    end

    %% Connections
    UserNodes -->|HTTPS| FE
    FE <-->|REST/Server Actions| API
    API <-->|Generative Request| Gemini
    API <-->|Voice Stream| Vapi
    API <-->|DB Query| Atlas
    API <-->|Fetch Jobs| Findwork

    %% Styling
    classDef platform fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef external fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    class UPS,FE,API platform;
    class Gemini,Vapi,Atlas,Findwork external;
```

## 2. Component Block Diagram

```mermaid
graph TB
    subgraph Client [Frontend Client]
        AuthUI["🔐 Auth Modules"]
        Dash["📊 Dashboard UI"]
        Editor["📝 CV Editor"]
    end

    subgraph Backend [Backend Services]
        RoadmapEngine["🗺️ Roadmap Engine"]
        InterviewMgr["🗣️ Interview Manager"]
        JobMatcher["🤝 Job Matcher"]
    end

    subgraph Agents [AI Agent Layer]
        Architect["👷 Architect Agent<br/>(Gemini Flash)"]
        Interviewer["🎤 Interviewer Agent<br/>(Vapi + Gemini)"]
        Analyst["🧐 Analyst Agent<br/>(CV Parser)"]
    end

    subgraph Data [Data Layer]
        Users[("Users")]
        Roadmaps[("Roadmaps")]
        Interviews[("Interview Logs")]
    end

    %% Dependencies
    Client --> Backend
    Backend <--> Agents
    Backend <--> Data

    %% Specific Interactions
    RoadmapEngine -.-> Architect
    InterviewMgr -.-> Interviewer
    JobMatcher -.-> Analyst
```

## 3. Data Flow: Skill Gap Analysis

```mermaid
sequenceDiagram
    participant User
    participant System as Upscale Engine
    participant LLM as Gemini AI
    participant Market as Market Data

    User->>System: Uploads CV / Profile
    System->>System: Extract Text & Skills
    System->>Market: Fetch Trends for Target Role
    Market-->>System: Return Top Skills (e.g. Next.js, AWS)
    
    System->>LLM: Analyze Gap (User vs Market)
    LLM-->>System: JSON { gaps: ["Docker", "GraphQL"], ... }
    
    System->>LLM: Generate Learning Path for Gaps
    LLM-->>System: 3-Stage Roadmap Object
    
    System-->>User: Present Interactive Roadmap
```

## 4. AI Pipeline: Mock Interview Loop

```mermaid
graph LR
    Start([Start Session]) --> Input
    
    subgraph RealTimeLoop [Real-Time Interaction Loop]
        Input["🗣️ User Voice Input"]
        STT["📝 Speech-to-Text<br/>(Vapi Transcriber)"]
        Context["🧠 Context Injection<br/>(Gemini: 'You are an HR Manager')"]
        Gen["💭 Response Generation"]
        TTS["🔊 Text-to-Speech<br/>(Vapi Voice Synthesizer)"]
        Output["🎧 Audio Output"]
    end

    Input --> STT
    STT --> Context
    Context --> Gen
    Gen --> TTS
    TTS --> Output
    Output --> Input

    %% Exit Condition
    Output --> Stop([End Session])
    
    %% Feedback Branch
    Stop --> Feedback["📊 Generate Feedback Report"]

    style RealTimeLoop fill:#f9fbe7,stroke:#827717,stroke-dasharray: 5 5
```
