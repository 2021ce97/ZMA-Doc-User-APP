export const deploymentContent = `
# Deployment, Security & Scaling Plan

A robust, secure, and highly available infrastructure is critical for healthcare.

## 1. Deployment Architecture

### A. Infrastructure Provider
Given the geographic realities (sanctions, routing), hosting in regional data centers (e.g., AWS Middle East - UAE, or DigitalOcean in Frankfurt/Singapore) provides the best latency balance.

### B. CI/CD Pipeline
*   **VCS:** GitHub.
*   **Pipeline:** GitHub Actions -> Docker Build -> Push to Container Registry -> Deploy to Kubernetes/Serverless infrastructure.
*   **Zero-Downtime:** Blue-Green or Canary deployments to ensure patients never face downtime during booking hours.

## 2. Security Plan (HIPAA & Privacy Best Practices)

Healthcare requires Zero-Trust architecture. Even administrators should not be able to read raw medical records.

### A. Data Encryption
*   **At Rest:** PostgreSQL databases must use AES-256 encryption. Patient Names, Phone Numbers, and Prescriptions should have field-level encryption if highly sensitive.
*   **In Transit:** Strict TLS 1.3 enforcement.

### B. Access Control & Privacy
*   **RBAC (Role Based Access Control):** A receptionist can see the patient's name and token, but *cannot* access the PDF prescription or diagnosis history.
*   **Audit Logs:** Every read/write operation on a medical record generates an unalterable log. (e.g., "Dr. Safi viewed patient X record at 14:00").
*   **Cultural Security:** Implementing strict rules around female provider data. Option for female doctors to hide public profile pictures while keeping their credentials verified.

### C. WebRTC Telehealth Security
*   Video streams strictly P2P (Peer-to-Peer) via WebRTC.
*   The signaling server never accesses the video payload.
*   No recordings are stored unless strictly legally required and explicitly consented to by both parties.

## 3. Scaling Strategy

### A. Phase 1: The Monolith (0 - 50,000 Users)
Start with a well-structured Modular Monolith (e.g., a single NestJS backend). This reduces horizontal network latency and keeps DevOps overhead low while establishing product-market fit.

### B. Phase 2: Edge Caching (50,000 - 200,000 Users)
As search queries explode:
1.  Move the Doctor Directory JSON generation to a CRON job.
2.  Push this JSON to Cloudflare Edge.
3.  The mobile apps hit the CDN, entirely bypassing the backend database for 90% of read requests.

### C. Phase 3: Microservices (200,000+ Users)
*   **Telehealth Server:** Extract WebRTC signaling into its own high-concurrency Go or Node.js microservice.
*   **Search Engine:** Implement Elasticsearch for fuzzy searching Pashto/Dari text (e.g., handling spelling variants of medical terms).
*   **Database Sharding:** Shard PostgreSQL horizontally by Province (e.g., Kabul shard, Herat shard).

## 4. Risk Analysis

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Internet Blackouts** | High | Aggressive local device caching. App functions largely as a static directory when offline. |
| **Fake Doctors onboarding** | Severe | Strict physical verification of PMDC/Afghani medical council certificates before activating profile. |
| **Female patient reluctance** | High | "Verified Female Only" search toggle. Heavily promote female doctors on the onboarding screens. |
| **Payment Gateway failure** | Med | Core business relies on "Cash-at-Clinic" initially. Digital payments are for premium addons only. |
`;
