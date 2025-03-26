/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_IK_PUBLIC_KEY: string
    readonly VITE_IK_URL_ENDPOINT: string
    readonly VITE_CLERK_PUBLISHABLE_KEY: string
    readonly VITE_SERVER_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}