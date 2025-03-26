import { Types } from "mongoose";

// Post Types
export type TPostType = {
  title: string;
  slug: string;
  img: string;
  desc: string;
  media: string[];
  category?: string;
  content: string;
  isFeatured: boolean;
  visit: number;
};

export type TPostSchemaModelType = TPostType & {
  user: Types.ObjectId;
};

//
