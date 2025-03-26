import { model, Schema } from "mongoose";

import { TCommentSchemaModelType } from "../types/comment.types";


const commentSchema = new Schema<TCommentSchemaModelType>({
    comment:
    {
        type: String,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }


}, { timestamps: true })


export default model<TCommentSchemaModelType>("Comment", commentSchema);

