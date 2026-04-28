export const schemaContent = `
# Database Schema & Entity Relationship

The core database design enforces strict roles and relational integrity.

## 1. ER Diagram

\`\`\`mermaid
erDiagram
    Users {
        uuid id PK
        string phone_number "Unique, Verified"
        string password_hash
        enum role "PATIENT, DOCTOR, ADMIN, PHARMACY, LAB"
        boolean is_verified
        timestamp created_at
    }

    Patients {
        uuid id PK
        uuid user_id FK
        string full_name
        string gender
        date date_of_birth
        string province
        string city
    }

    Doctors {
        uuid id PK
        uuid user_id FK
        string full_name
        string pmc_registration_number "Medical Council ID"
        string gender
        string specialty
        int years_of_experience
        decimal consultation_fee
        text education_json
        float average_rating
        boolean is_active
    }

    Hospitals {
        uuid id PK
        string name
        string province
        string city
        string address
        float latitude
        float longitude
        boolean has_emergency
        jsonb services_offered
    }

    DoctorHospitals {
        uuid id PK
        uuid doctor_id FK
        uuid hospital_id FK
        jsonb available_timings "{ days, time_slots }"
    }

    Appointments {
        uuid id PK
        uuid patient_id FK
        uuid doctor_id FK
        uuid hospital_id FK
        timestamp scheduled_time
        enum status "PENDING, CONFIRMED, COMPLETED, CANCELLED"
        enum payment_type "CASH_AT_CLINIC, DIGITAL"
        enum type "IN_PERSON, VIDEO, CHAT"
    }

    MedicalRecords {
        uuid id PK
        uuid patient_id FK
        uuid doctor_id FK
        uuid appointment_id FK
        text diagnosis
        text symptoms
        jsonb prescription_data "Medicines, Dosage"
        string pdf_report_url
        timestamp created_at
    }

    Users ||--o| Patients : "is"
    Users ||--o| Doctors : "is"
    Doctors ||--o{ DoctorHospitals : "works at"
    Hospitals ||--o{ DoctorHospitals : "employs"
    Patients ||--o{ Appointments : "books"
    Doctors ||--o{ Appointments : "receives"
    Appointments ||--o| MedicalRecords : "generates"
    Patients ||--o{ MedicalRecords : "owns"
\`\`\`

## 2. Core API Endpoints Structure

### Discovery & Search (Public/Cached)
*   \`GET /api/v1/search/doctors?province=Kabul&specialty=Cardiology&gender=FEMALE\`
*   \`GET /api/v1/hospitals/nearby?lat={lat}&lng={lng}&radius=10\`
*   \`GET /api/v1/doctors/{id}/availability\`

### Appointments (Auth Required)
*   \`POST /api/v1/appointments/book\`
*   \`GET /api/v1/appointments/patient/upcoming\`
*   \`PUT /api/v1/appointments/{id}/status\` (Doctor changing status)

### Medical Records (HIPAA-inspired Auth)
*   \`POST /api/v1/records/prescribe\` (Doctor generates prescription)
*   \`GET /api/v1/records/patient/{id}\` (Patient viewing own records)

### AI Triage / Chatbot
*   \`POST /api/v1/ai/symptom-checker\`
    *   *Payload:* \`{ "symptoms": ["headache", "fever", "nausea"], "age": 30, "gender": "male" }\`
    *   *Response:* \`{ "triage_level": "moderate", "recommended_specialty": "General Physician" }\`
`;
