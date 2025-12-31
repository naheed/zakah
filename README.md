# ZakatFlow

**"TurboTax for Zakat"**

ZakatFlow is a comprehensive web application designed to simplify the Zakat calculation process for Muslims. Just like TurboTax guides you through your taxes, ZakatFlow offers a guided, step-by-step approach to calculating Zakat with accuracy and ease.

## Features

- **Guided Calculation Wizard**: 
    - **Simple Mode**: For users who want a quick estimate based on standard assets.
    - **Detailed Mode**: A granular walkthrough covering all asset classes (Gold, Silver, Stocks, Business Assets, etc.) ensuring no deductible is missed.
- **Authentication**: Secure login via Google (powered by Supabase) to save and manage your calculations.
- **Methodology**: Extensive documentation explaining the ruling for each asset class, backed by scholarly sources.
- **Sharing**: Generate personalized referral links to invite friends and family to calculate their Zakat.
- **History**: View and manage your past Zakat calculations.
- **Privacy First**: Secure handling of financial data.

## Web CUJs (Critical User Journeys)

This project supports the following critical user journeys:

1.  **First time user on direct landing page**: Users land on the attractive home page, see the value proposition ("Simple, Accurate Zakat Calculation"), and can start immediately.
2.  **First time user coming via referral link**: A personalized welcome experience acknowledging the referrer, encouraging the user to start their own flow.
3.  **Returning user with login**: Seamless access to saved calculations and settings upon authentication.
4.  **Returning user without login**: Ability to start a new anonymous calculation or log in to retrieve past data.
5.  **User login and creating new calculation**: Authenticated workflow to start a fresh calculation session.
6.  **Doing simple calculation**: A streamlined path for users with straightforward finances (Cash + Gold/Silver).
7.  **Doing detailed calculation**: The full "TurboTax" style questionnaire covering debts, investments, 401k/Superannuation, business inventory, and more.
8.  **Viewing calculation report page**: A clean breakdown of Zakatable assets, showing exactly how the final figure was derived.
9.  **Downloading report pdf**: Export the calculation report as a formatted PDF for records or offline sharing.
10. **Sharing tool using personalized referral link**: Dashboard allowing users to copy their unique invite link to spread the benefit.
11. **Review terms of service**: Access to legal terms governing the usage of the platform.
12. **Review privacy policy**: Transparency about how user data is collected and used.
13. **Review about page**: Information about the project's mission, team, and adherence to Islamic financial principles.

## Tech Stack

This project is built with a modern, type-safe stack:

-   **Frontend**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI + Tailwind)
-   **State Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
-   **Backend / Auth**: [Supabase](https://supabase.com/)
-   **Icons**: [Phosphor Icons](https://phosphoricons.com/) & [Lucide React](https://lucide.dev/)

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

-   Node.js & npm installed (Recommended: Use `nvm`)

### Installation

1.  **Clone the repository**:
    ```sh
    git clone <YOUR_GIT_URL>
    cd zakah
    ```

2.  **Install dependencies**:
    ```sh
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file in the root directory and add your Supabase credentials. You need a project set up on [Supabase](https://supabase.com/).

    ```env
    VITE_SUPABASE_PROJECT_ID="your-project-id"
    VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
    VITE_SUPABASE_URL="https://your-project-id.supabase.co"
    ```

4.  **Configure Google Authentication**:
    -   **Google Cloud Console**:
        -   Create a new project (or use existing).
        -   Go to **APIs & Services > Credentials**.
        -   Create **OAuth Client ID** (Web Application).
        -   Add `http://localhost:8080` to **Authorized JavaScript origins**.
        -   Add `https://<your-project-id>.supabase.co/auth/v1/callback` to **Authorized redirect URIs**.
    -   **Supabase Dashboard**:
        -   Go to **Authentication > Providers > Google**.
        -   Enable Google provider and paste the **Client ID** and **Client Secret** from Google Cloud.
        -   Go to **Authentication > URL Configuration**.
        -   Set **Site URL** to `http://localhost:8080`.
        -   Add `http://localhost:8080/*` to **Redirect URLs**.

5.  **Run the development server**:
    ```sh
    npm run dev
    ```

    The app should now be running at `http://localhost:8080` (or similar).

## Project Structure

-   `src/pages`: Contains the main route components (Index, Documents, Auth, Methodology, etc.).
-   `src/components`: Reusable UI components button, inputs, dialogs (Shadcn UI) and custom domain specific components.
-   `src/integrations/supabase`: Supabase client configuration and types.
-   `src/hooks`: Custom React hooks (e.g., `useAuth`, `useToast`).
-   `src/lib`: Utility functions and helper classes.

## Deployment

This project is ready to be deployed on platforms like Vercel, Netlify, or directly via Lovable if applicable. Ensure your build settings are configured for a Vite project (`npm run build` as build command, `dist` as output directory).
