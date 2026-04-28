export const architectureContent = `
# System Architecture & Technical Stack

To survive the Afghan internet landscape, the architecture must prioritize **Offline-First**, **Aggressive Edge Caching**, and **Low Data Payloads**.

## 1. High-Level Architecture Diagram

\`\`\`mermaid
graph TD
    %% Devices
    Client_Patient[Patient App - React Native / Expo]
    Client_Doctor[Doctor App - React Native / Expo]
    Client_Admin[Admin Dashboard - React / Vite]

    %% Edge
    CDN[Cloudflare CDN - Image Optimization / Edge Caching]
    API_Gateway[API Gateway / NGINX Load Balancer]

    %% Microservices
    Auth_Service[Auth & User Service]
    Discovery_Service[Search & Discovery Service]
    Booking_Service[Appointment & Booking Service]
    Telehealth_Service[WebRTC Signaling & Chat]
    EMR_Service[Medical Records Service]

    %% Data Layer
    Cache[Redis - Search Cache / Sessions]
    DB_Primary[(PostgreSQL - Primary DB)]
    S3[S3 Compatible Storage - Prescriptions / Scans]

    %% External
    HesabPay[HesabPay API]
    SMS[Local SMS Gateway]
    Maps[Google Maps API]

    %% Connections
    Client_Patient --> CDN
    Client_Doctor --> CDN
    Client_Admin --> CDN
    CDN --> API_Gateway

    API_Gateway --> Auth_Service
    API_Gateway --> Discovery_Service
    API_Gateway --> Booking_Service
    API_Gateway --> Telehealth_Service
    API_Gateway --> EMR_Service

    Auth_Service --> DB_Primary
    Discovery_Service --> Cache
    Discovery_Service --> DB_Primary
    Booking_Service --> DB_Primary
    EMR_Service --> DB_Primary
    EMR_Service --> S3

    Auth_Service --> SMS
    Booking_Service --> SMS
    Telehealth_Service --> HesabPay
    Discovery_Service --> Maps
\`\`\`

## 2. Technology Stack Selection
*   **Mobile Frontend:** React Native (Expo). Allows sharing ~80% of codebase across iOS and Android. Essential for rapid iteration. Uses **WatermelonDB** or **SQLite** for robust offline caching.
*   **Web Frontend (Admin/Web App):** React with Vite, Tailwind CSS.
*   **Backend:** Node.js (NestJS). NestJS enforces strict typing and modular architecture, essential for medical software.
*   **Database:** PostgreSQL. Healthcare data requires strict relational integrity (ACID compliance) for financial transactions and EHRs.
*   **Caching:** Redis. Doctor lists, hospital locations must be cached at the edge.
*   **Real-time:** Socket.io (for chat/notifications), WebRTC (for low-bandwidth P2P video).
*   **Infrastructure:** AWS (if budgets allow) or DigitalOcean (for cost-efficiency). Docker containerization is mandatory for CI/CD.

## 3. Low-Bandwidth Optimizations
1.  **GraphQL or Sparse REST:** The client must strictly request *only* the fields it needs (e.g., just name and ID to render a list) to prevent downloading massive JSON payloads.
2.  **WebP Image Format:** All doctor headshots and lab reports must be compressed to \`WebP\` at the edge (saving ~70% bandwidth).
3.  **Local First:** The app downloads the "Top 100 Doctors in Kabul" JSON blob overnight when phone is connected to WiFi, and serves the directory offline during the day.
`;
