# Label Generator

A professional web application for order management and label printing with Firebase authentication, admin dashboard, and Progressive Web App (PWA) capabilities.

## 🚀 Live Demo

**Website:** [https://waterstreetantiques.github.io/label-generator/](https://waterstreetantiques.github.io/label-generator/)

## ✨ Features

### 🔐 Authentication & Security
- Google Authentication via Firebase
- Email-based access control with Firestore security rules
- Protected routes and secure data access

### 📋 Order Management
- Complete customer information forms
- Invoice tracking and date management
- Pickup vs Delivery fulfillment options
- Dynamic items purchased with quantities
- Customer and order history

### 🏷️ Label Generation
- Professional printable order labels
- Compact 4"x6" label format
- Customer details, fulfillment info, and item lists
- Print-optimized styling

### 👨‍💼 Admin Dashboard
- View all orders in sortable table
- Edit order details with modal forms
- Delete orders with confirmation
- Order count and status tracking
- Real-time data updates

### 🎨 User Experience
- **Dark Mode Support** - System preference detection with manual toggle
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Progressive Web App** - Install as native app on devices
- **Professional UI** - Clean, modern design with Chakra UI

### 📱 iPad Fullscreen Support

This app is optimized as a **Progressive Web App (PWA)** that can run fullscreen on iPad without browser controls:

#### How to Use on iPad:
1. **Open Safari** on your iPad and navigate to the app URL
2. **Tap the Share button** (square with arrow icon) in Safari
3. **Select "Add to Home Screen"** from the share menu
4. **Tap "Add"** to confirm and add the app icon to your home screen
5. **Launch the app** from your home screen icon

#### Results:
- ✅ **No address bar** or browser controls visible
- ✅ **Full screen experience** like a native iPad app
- ✅ **App icon** appears on home screen with your branding
- ✅ **Splash screen** shows when launching
- ✅ **Native-like navigation** and app behavior
- ✅ **Works offline** once cached
- ✅ **Professional appearance** for business use

## 🛠️ Setup & Development

### Prerequisites
- Node.js 18+
- Firebase project with Authentication and Firestore configured
- Google account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/waterstreetantiques/label-generator.git
   cd label-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Console Configuration**

   The app uses Firebase with console-based access restrictions:

   **Authentication Setup:**
   - Enable Google Authentication in Firebase Console
   - Configure authorized domains for your deployment URL

   **Firestore Security Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null &&
           request.auth.token.email in [
             'your-email@example.com',
             'admin@yourcompany.com'
           ];
       }
     }
   }
   ```

   **API Key Restrictions:**
   - Firebase API keys are restricted through console settings
   - HTTP referrers limited to authorized domains
   - No environment variables needed for client-side security

4. **Start development server**
   ```bash
   npm run dev
   ```

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📖 Usage

### For End Users:
1. **Sign in** with your authorized Google account
2. **Navigate** between Admin Dashboard and Order Form
3. **Create orders** with customer details and items
4. **Print labels** for order fulfillment
5. **Manage orders** through the admin interface

### For Administrators:
- **View all orders** in the admin dashboard
- **Edit order details** by clicking edit buttons
- **Delete orders** with confirmation prompts
- **Track fulfillment** status (pickup vs delivery)
- **Monitor order volume** and customer data

## 🔧 Technology Stack

- **Frontend:** React 18 with TypeScript
- **UI Framework:** Chakra UI with dark mode support
- **Build Tool:** Vite
- **Authentication:** Firebase Auth (Google OAuth)
- **Database:** Firestore with security rules
- **Routing:** React Router with protected routes
- **Printing:** React-to-Print for label generation
- **PWA:** Web App Manifest for native app experience
- **Deployment:** GitHub Pages with SPA routing support

## 🏗️ Architecture

- **Authentication Context** - Manages user state and auth persistence
- **Protected Routes** - Restricts access to authenticated users
- **Admin Dashboard** - Full CRUD operations for order management
- **Order Form** - Comprehensive form with validation
- **Label Component** - Print-optimized order labels
- **Dark Mode** - System-aware theme switching
- **PWA Support** - Offline capability and app-like experience

## 🚀 Deployment

The app is automatically deployed to GitHub Pages at:
**https://waterstreetantiques.github.io/label-generator/**

### Manual Deployment:
```bash
npm run build && npm run deploy
```

## 📄 License

This project is proprietary software for internal business use.

## 🤝 Contributing

This is a private business application. Contact the repository owner for access or modification requests.


test