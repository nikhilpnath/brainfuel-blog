import { Types } from "mongoose";

type TComment = {
    comment: string;
}

export type TCommentSchemaModelType = TComment & {
    user: Types.ObjectId;
    post: Types.ObjectId;
}