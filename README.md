# Product Label Generator

A web application for generating and printing product labels with Firebase authentication and Firestore database integration.

## Features

- Firebase Authentication
- Product information form
- Printable product labels
- Firestore database integration
- Responsive design
- Fullscreen support

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Log in using your Firebase credentials
2. Fill out the product information form
3. Click "Save & Print" to save the product and print the label
4. Use "Print Label" to reprint the label without saving

## Technologies Used

- React
- TypeScript
- Vite
- Firebase (Authentication & Firestore)
- Chakra UI
- React Router
- React-to-Print 
