
# BrainFuel 📝

Easily create, manage, and share blog posts with a clean interface and smooth writing experience. Whether it’s a quick thought or a detailed article, this app helps you stay organized and connect with your readers.

![Image](https://github.com/user-attachments/assets/36665f33-ac77-4a79-9b80-e668954b0e10)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env files

Client:
```
VITE_IK_PUBLIC_KEY= Imagekit Public Key
VITE_IK_URL_ENDPOINT=  https://ik.imagekit.io/yourProject
VITE_CLERK_PUBLISHABLE_KEY= Clerk 
VITE_SERVER_URL=http://localhost:8000

```
Server:
```
PORT= 8000
NODE_ENV= development
MONGO_URL= mongodb

CLERK_WEBHOOK_SECRET= Clerk
CLERK_PUBLISHABLE_KEY= clerk
CLERK_SECRET_KEY= clerk

IK_URL_ENDPOINT=https://ik.imagekit.io/yourProject
IK_PUBLIC_KEY= Imagekit
IK_PRIVATE_KEY= Imagekit

CLIENT_URL=http://localhost:5173
```
## 🔑 Key Information (Use Node v20)

#### 👑 Adding Admin
    1. Clerk Configure → Sessions → Customize Session Tokens (Edit)

    2. Add The following line and save
    {
	"metadata": "{{user.public_metadata}}"
    }

    3. Create an User(admin) with username as admin and other neccessary info

    4. Click on the created admin user → scroll to the bottom → find Metadata:

      - Click Edit Public
      - Add { "role": "admin"} and save changes

    5. Done! 🎉


#### 🔗 Saving User Data via Webhook (Clerk)

    We save the user (changes - Create,Update and Delete) in the Db comming from clerk via webhook

    1. Clerk Configure → Webhooks → Add
      - ⚠️ Note: Clerk webhooks need a live HTTPS endpoint. Use ngrok to expose your local server..

    2. Use the ngrok docs to generate an HTTPS URL and set it as your webhook endpoint

    3. while creating the endpoint below we have "Subscribe to events" select the user event(created,deleted,updated)

    4. That’s it — all set up! ✅

* [Clerk Webhook Setup Docs](https://clerk.com/docs/webhooks/sync-data)
* [ngrok Guide](https://ngrok.com/docs/getting-started/)

#  💻 Boilerplate

#### ✅ Key Features:
* Authentication — Seamless user authentication powered by [Clerk](https://clerk.com/).

* Media Handling — Effortless image & Video uploads and optimization with [ImageKit](https://imagekit.io/).

* Rich Text Editor — Beautiful content creation with React Quill New.

* Infinite Scrolling — Smooth, lazy-loaded content with placeholder support using react-infinite-scroll-component.

* Route Lazy Loading — Optimized loading of routes for better performance.

* Custom Hooks — Reusable logic to keep code clean and maintainable.

* Breadcrumbs Navigation — Clear navigation paths for better UX.

* Time Ago Timestamps — Human-readable post timestamps using timeago.js.
```
...And More! ✨
There’s plenty under the hood — explore the code, play around, and discover all the little details yourself!
```
#### ⚙️ Tech Stack:
 Server (Node + Express 5):

* Express 5 - No More Try Catch.

* MongoDB + Mongoose for powerful database interaction.

* Morgan + Winston for detailed request & error logging.

* Body-parser, CORS, and secure API setup.

* Built with TypeScript for a type-safe backend.

 Client (React 19 + Vite):

* React Query for fetching and caching data effortlessly.

* Axios for smooth API communication.

* React Toastify for user-friendly notifications.

* DOMPurify for rendering safe, sanitized HTML.

* ImageKit React for easy image rendering.

* Fully styled with Tailwind CSS for fast and beautiful UI.

* Built with TypeScript for robust frontend development.


### ⭐ The project if it helped you!

