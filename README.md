# 📝 Google Docs Clone

A **full-stack collaborative document editor** inspired by Google Docs, built with modern web technologies. Features real-time document management, rich text editing, Google OAuth authentication, and a stunning glassmorphism UI with immersive CSS animations.

🔗 **Live Demo:** [google-docs-clone-psi-one.vercel.app](https://google-docs-clone-psi-one.vercel.app)

---

## ✨ Features

- **🔐 Authentication** — Google OAuth & Email/Password login via NextAuth.js
- **📄 Document CRUD** — Create, read, update, and delete documents in real-time
- **✍️ Rich Text Editor** — Full-featured WYSIWYG editor with Draft.js (bold, italic, lists, links, images, colors, emojis, and more)
- **💾 Auto-Save** — Documents automatically save to Firebase Firestore with debounced updates
- **🛡️ Route Protection** — Middleware-based authorization ensures only document owners can access their files
- **🌙 Dark Mode** — Theme-adaptive glassmorphism design with smooth transitions
- **🌕 Animated Background** — Immersive rotating moon animation with parallax star field
- **📱 Responsive Design** — Works seamlessly across desktop and mobile devices
- **☁️ Cloud Deployment** — Deployed on Vercel with serverless API functions

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 14, React 18, Framer Motion |
| **Editor** | React-Draft-Wysiwyg, Draft.js |
| **Styling** | Tailwind CSS, CSS Variables, Glassmorphism |
| **Authentication** | NextAuth.js (Google OAuth + Credentials) |
| **Database** | Firebase Firestore (real-time NoSQL) |
| **Backend** | Next.js API Routes (Serverless Functions) |
| **Deployment** | Vercel |
| **UI Libraries** | Material Tailwind, NextUI, Lucide Icons, MUI Icons |

---

## 🏗️ Architecture

```
google-docs-clone/
├── app/
│   ├── api/auth/          # NextAuth API routes (Google OAuth + Credentials)
│   ├── doc/[id]/          # Dynamic document editor page
│   ├── page.js            # Home page with document list
│   ├── layout.js          # Root layout with providers
│   └── globals.css        # Design system & theme variables
├── components/
│   ├── Header.js          # App header with navigation
│   ├── TextEditor.js      # Rich text editor with auto-save
│   ├── DocumentRow.js     # Document list item with actions
│   ├── Login.js           # Authentication page
│   ├── ThemeToggle.js     # Dark/Light mode toggle
│   └── LoadingSkeleton.js # Loading states
├── firebase.js            # Firebase client configuration
├── firebaseAdmin.js       # Firebase Admin SDK (server-side)
├── middleware.js           # Route protection for /doc/* pages
└── firestore.rules        # Firestore security rules
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Firestore enabled
- Google Cloud OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajingle532/Google-Docs-clone.git
   cd Google-Docs-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Admin (Server-side)
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY="your-private-key"

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # NextAuth
   NEXTAUTH_URL=http://localhost:3005
   NEXTAUTH_SECRET=your-secret-key

   # Firebase Client (Public)
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3005](http://localhost:3005) in your browser

---

## 🔑 Key Implementation Details

### Authentication Flow
- Users sign in via **Google OAuth** or **Email/Password** credentials
- Sessions managed with **JWT strategy** for middleware compatibility
- Protected routes use NextAuth `withAuth` middleware on `/doc/*` paths

### Document Management
- Documents stored in **Firebase Firestore** with real-time listeners
- Each document tracks: `fileName`, `ownerEmail`, `sharedWith[]`, `timestamp`, `editorState`
- Client-side sorting by timestamp (no composite index required)

### Rich Text Editor
- Built on **Draft.js** with the React-Draft-Wysiwyg wrapper
- Supports: Bold, Italic, Underline, Strikethrough, Font sizes, Colors, Alignment, Lists, Links, Images, Emojis
- **Auto-save** with 1500ms debounce to Firestore

### Security
- Middleware-based route protection for all document pages
- Owner-based access control (only document owner or shared users can view)
- Firestore security rules for server-side enforcement

---

## ☁️ Deployment

Deployed on **Vercel** as a single Next.js application:
- Frontend pages → SSR/SSG on Vercel Edge
- API routes → Vercel Serverless Functions
- Environment variables configured via Vercel dashboard

---

## 👤 Author

**Omkar Ingle** — [@rajingle532](https://github.com/rajingle532)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
