import { Document, Model } from "mongoose";

// extending document
export type TUserDocument = Document & {
    clerkUserId: String;
    username: string;
    email: string;
    img?: string;
    savedPosts: string[]
}

//  for statics
export type TUserModel = Model<TUserDocument> & {
    findUserByClerkID(clerkId: string): Promise<{ id: string; savedPosts: Array<string> }>;
}

// for more info : 
// https://stackoverflow.com/questions/42448372/typescript-mongoose-static-model-method-property-does-not-exist-on-type
// https://github.com/Automattic/mongoose/issues/8119