export type MediaUploadSucess = {
  filePath: string;
  name: string;
  fileId: string;
  url: string;
};
export type TMedia = {
  coverImg: Omit<MediaUploadSucess, "fileId" | "url">;
  img?: string;
  video?: string;
  
};

export type TUser = {
  img: string;
  username: string;
};

export type TPosts = {
  _id: string;
  title: string;
  desc: string;
  img: string;
  slug: string;
  media?: string[];
  content?: string;
  category: string;
  createdAt: Date;
  isFeatured?: boolean;
  user: TUser;
};

export type TComment = {
  _id?: string;
  comment: string;
  createdAt: string;
  user: TUser;
};

// hook types
export type TMutationSuccessData = {
  message: string;
  slug: string;
};

export type TPostQueryData = {
  hasMore: boolean;
  posts: TPosts[];
  message?: string;
};

import { AxiosError } from "axios";

export type TAxiosError = AxiosError<{ message?: string }>;
