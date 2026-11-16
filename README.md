# BrainFuel 📝

Easily create, manage, and share blog posts with a clean interface and smooth writing experience. Whether it’s a quick thought or a detailed article, this app helps you stay organized and connect with your readers.

![Image](https://github.com/user-attachments/assets/4d00ab39-7977-4920-ae07-25ddfac1b04e)

---

## 🚀 Key Features

* **Authentication & Role-Based Access** — Seamless user sign-in and protected administrative routes powered by [Clerk](https://clerk.com/).
* **Media Handling & CDN** — Fast image and video uploads, real-time transformations, and optimizations with [ImageKit](https://imagekit.io/).
* **Rich Text Editor** — Polished article authoring with `react-quill-new`.
* **Native Infinite Scrolling** — Lightweight, lazy-loaded content streams built with the modern Web `IntersectionObserver` API.
* **Zero-Dependency Timestamps** — Lightweight, human-readable relative time formatting powered by native `Intl.RelativeTimeFormat`.
* **Robust Security** — Hardened HTTP security headers with [Helmet](https://helmetjs.github.io/), strict CORS policies, and tiered request rate limiting via `express-rate-limit`.
* **Input Validation & Sanitization** — Schema-based payload validation via [Zod](https://zod.dev/) and HTML sanitization with [DOMPurify](https://github.com/cure53/DOMPurify).
* **Reliable Logging** — Structured request tracing and error logging using [Winston](https://github.com/winstonjs/winston) and [Morgan](https://github.com/expressjs/morgan).
* **Modern Performance** — Route lazy loading, breadcrumb navigation, and responsive layouts built with Tailwind CSS v4.

---

## ⚙️ Tech Stack

### Client (React 19 + Vite)
* **Framework:** React 19, Vite, TypeScript
* **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
* **State & Data Fetching:** TanStack React Query v5, Axios
* **Media & Content:** ImageKit React, React Quill New, DOMPurify
* **Auth & Feedback:** Clerk React, React Toastify

### Server (Node.js + Express 5)
* **Runtime & Framework:** Node.js (`v24.22.1+` recommended), Express 5, TypeScript (`tsx` in dev)
* **Database & ODM:** MongoDB, Mongoose
* **Validation & Security:** Zod, Helmet, Express Rate Limit, CORS
* **Authentication & Webhooks:** `@clerk/express`, Svix
* **Logging:** Winston, Morgan

---

## 🏁 Getting Started

### Prerequisites
* **Node.js**: `v24.22.1` or higher recommended (minimum `v20.6.0` for native `--env-file` support). `v24.22.1` includes critical security fixes for runtime vulnerabilities (such as the Brotli decoder buffer overflow CVE-2026-111497 and TLS verification bypasses).
* **npm** or your preferred package manager
* **MongoDB** instance (local or MongoDB Atlas)
* Accounts on [Clerk](https://clerk.com/) and [ImageKit](https://imagekit.io/)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nikhilpnath/brainfuel-blog.git
   cd brainfuel-blog
   ```

2. **Start the Backend Server:**
   ```bash
   cd server
   npm install
   # Create and fill in .env file (see Environment Variables below)
   npm run dev
   ```
   The server will run on `http://localhost:8000`.

3. **Start the Frontend Client:**
   ```bash
   cd ../client
   npm install
   # Create and fill in .env file (see Environment Variables below)
   npm run dev
   ```
   The client will run on `http://localhost:5173`.

---

## 🔐 Environment Variables

Create `.env` files in both `client` and `server` root folders.

### Client (`client/.env`)
```env
VITE_IK_PUBLIC_KEY=your_imagekit_public_key
VITE_IK_URL_ENDPOINT=https://ik.imagekit.io/yourProject
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_SERVER_URL=http://localhost:8000
```

### Server (`server/.env`)
```env
PORT=8000
NODE_ENV=development
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/brainfuel
CLIENT_URL=http://localhost:5173

CLERK_WEBHOOK_SECRET=whsec_your_clerk_webhook_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

IK_URL_ENDPOINT=https://ik.imagekit.io/yourProject
IK_PUBLIC_KEY=your_imagekit_public_key
IK_PRIVATE_KEY=your_imagekit_private_key
```

---

## 🔑 Key Configuration Guides

### 👑 Adding an Admin User
1. Open Clerk Dashboard → **Configure** → **Sessions** → **Customize Session Tokens** (Edit).
2. Add the metadata claim:
   ```json
   {
     "metadata": "{{user.public_metadata}}"
   }
   ```
3. Save changes.
4. Create a user (or choose an existing one) in Clerk Dashboard → **Users**.
5. Click on the user → scroll down to **Metadata** → click **Edit** under **Public Metadata**.
6. Add the admin role:
   ```json
   {
     "role": "admin"
   }
   ```
7. Save changes. 🎉

---

### 🔗 Saving User Data via Webhook (Clerk)
User lifecycle changes (create, update, delete) are synced to MongoDB via Clerk webhooks.

1. Expose your local server via [ngrok](https://ngrok.com/):
   ```bash
   ngrok http 8000
   ```
2. Open Clerk Dashboard → **Configure** → **Webhooks** → **Add Endpoint**.
3. Set your endpoint URL:
   ```
   https://<your-ngrok-domain>.ngrok-free.app/webhooks/clerk
   ```
4. Under **Subscribe to events**, select:
   * `user.created`
   * `user.updated`
   * `user.deleted`
5. Copy the **Signing Secret** into your `server/.env` as `CLERK_WEBHOOK_SECRET`.
6. Save and test the endpoint. ✅

* [Clerk Webhook Setup Docs](https://clerk.com/docs/webhooks/sync-data)
* [ngrok Guide](https://ngrok.com/docs/getting-started/)

---

### ⭐ Star the project if it helped you!
