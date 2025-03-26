interface IRole {
    metadata?: { role?: "admin" | "user" }
}

interface IUserId {
    userId: string
    sessionClaims?: IRole;

}


declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            NODE_ENV: 'development' | 'production';
            MONGO_URL: string;
            CLERK_WEBHOOK_SECRET: string;
            CLERK_PUBLISHABLE_KEY: string;
            CLERK_SECRET_KEY: string;
            IK_URL_ENDPOINT: string;
            IK_PUBLIC_KEY: string;
            IK_PRIVATE_KEY: string;
            CLIENT_URL: string;
        }
    }
    // Extending Express Request object to include auth object from clerk
    namespace Express {
        interface Request {
            auth?: IUserId;
        }
    }
}

// more info:
// express req :  https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
// env  : https://stackoverflow.com/questions/45194598/using-process-env-in-typescript



export { };