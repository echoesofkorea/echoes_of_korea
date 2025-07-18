
# Echoes of Korea: Iteration 1 Plan

## 1. Project Overview

This document outlines the plan for the first iteration of the "Echoes of Korea" project. The primary goal of this iteration is to build a secure, internal-facing web application for a super-admin. This application will serve as the central hub for managing the entire lifecycle of an oral history recording, from initial upload to transcription and preparation for future analysis.

## 2. Core Features

The focus is on creating a robust and efficient workflow for the administrator.

*   **Secure Admin Access:**
    *   A dedicated login page for the administrator.
    *   Access to the admin panel will be restricted to authenticated users.
*   **Interview Management:**
    *   A dashboard to view all uploaded interview recordings.
    *   The ability to upload new audio files.
    *   A form to add and edit metadata for each interview (e.g., interviewee name, birth year, title).
*   **One-Click STT (Speech-to-Text):**
    *   A button to trigger the transcription process for an uploaded audio file.
    *   The system will handle the process asynchronously in the background.
    *   The status of the transcription (`processing`, `completed`, `failed`) will be displayed in the UI.
*   **Transcript Management:**
    *   Once transcription is complete, the full text will be displayed.
    *   The administrator will be able to view and edit the generated transcript for accuracy.
*   **LLM-Ready Architecture:**
    *   The system will be designed to easily integrate with Large Language Models (LLMs) in the future for tasks like summarization, keyword extraction, and sentiment analysis.

## 3. Technology Stack

*   **Frontend:** Next.js (React)
*   **Backend:** Next.js API Routes
*   **Database:** Supabase (PostgreSQL)
*   **File Storage:** Supabase Storage
*   **Authentication:** Supabase Auth
*   **Deployment:** Vercel
*   **External Services:**
    *   **STT:** Naver CLOVA Speech (or a similar high-quality Korean STT service)
    *   **LLM:** OpenAI GPT series (for future integration)

## 4. Database Schema (Supabase)

A single table will be used to manage the interviews.

### `interviews` Table

| Column Name              | Data Type     | Description                                                              |
| ------------------------ | ------------- | ------------------------------------------------------------------------ |
| `id`                     | `UUID`        | Primary Key. Unique identifier for the interview.                        |
| `created_at`             | `TIMESTAMPTZ` | Timestamp of when the record was created.                                |
| `interviewee_name`       | `TEXT`        | The name of the person being interviewed.                                |
| `interviewee_birth_year` | `INT4`        | The birth year of the interviewee.                                       |
| `interview_date`         | `DATE`        | The date the interview was conducted.                                    |
| `title`                  | `TEXT`        | A descriptive title for the interview.                                   |
| `audio_file_path`        | `TEXT`        | The path to the audio file in Supabase Storage.                          |
| `is_published`           | `BOOLEAN`     | Whether the interview is visible to the public. Defaults to `false`.     |
| `stt_status`             | `TEXT`        | Transcription status: `not_started`, `processing`, `completed`, `failed`. |
| `full_transcript`        | `TEXT`        | The full, editable transcript from the STT service.                      |
| `llm_summary`            | `TEXT`        | (For future use) An LLM-generated summary of the transcript.             |

## 5. API Endpoints (Next.js API Routes)

These endpoints will be created under the `/pages/api/` directory.

### `POST /api/auth/login`

*   **Description:** Handles administrator login.
*   **Request Body:** `{ "email": "<email>", "password": "<password>" }`
*   **Action:** Uses Supabase Auth to sign in the user and sets a secure cookie.

### `POST /api/transcribe`

*   **Description:** Initiates the STT process for an interview.
*   **Request Body:** `{ "interview_id": "<uuid>" }`
*   **Workflow:**
    1.  Authenticates the admin user.
    2.  Updates the interview's `stt_status` to `processing`.
    3.  Generates a temporary, secure URL (signed URL) for the audio file in Supabase Storage.
    4.  Calls the external STT service API with the signed URL.
    5.  Returns a success response to the client.

### `POST /api/stt-webhook`

*   **Description:** An endpoint for the STT service to call when transcription is complete.
*   **Request Body:** The format will depend on the STT service provider, but it will contain the transcript text.
*   **Workflow:**
    1.  Verifies the request is from the legitimate STT service (e.g., using a secret key).
    2.  Parses the transcript from the request body.
    3.  Updates the corresponding interview record in the database with the `full_transcript` and sets `stt_status` to `completed`.

## 6. Directory Structure (Next.js)

```
/echoes-of-korea
|-- /app
|   |-- /admin
|   |   |-- /dashboard               # Main admin dashboard page
|   |   |-- /interviews
|   |   |   |-- /new                 # Page to add a new interview
|   |   |   `-- /[id]                # Page to edit an existing interview
|   |   `-- /login                   # Admin login page
|   |-- layout.js
|   `-- page.js                      # Public landing page (can be simple for now)
|-- /pages
|   `-- /api
|       |-- /auth
|       |   `-- login.js
|       |-- /transcribe
|       |   `-- index.js
|       `-- /stt-webhook
|           `-- index.js
|-- /lib
|   |-- supabaseClient.js            # Supabase client initialization
|   `-- utils.js                     # Utility functions
|-- /components
|   |-- /ui                          # Reusable UI components (buttons, forms, etc.)
|   `-- /admin                       # Components specific to the admin panel
|-- .gitignore
|-- next.config.js
|-- package.json
`-- README.md
```
