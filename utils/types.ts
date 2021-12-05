export type PostType = {
  id: string;
  title: string;
  date: string;
  firstParagraph: string;
  secondParagraph: string;
  thirdParagraph: string;
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
