export type PostType = {
  title: string
  date: string
  contentHtml: string
};

export type PostPreviewType = {
  id: string;
  date: string;
  title: string;
  snippet?: string;
};
export type PostDataType = {
  postData: PostType;
};

export type AllPostsDataType = {
  allPostsData: PostPreviewType[]
};
