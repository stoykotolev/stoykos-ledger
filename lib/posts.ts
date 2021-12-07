import posts from '../posts/entries';
import { PostPreviewType } from '../utils/types';

export const getSortedPostsData = async () => {
  const allPosts: PostPreviewType[] = posts.map((post) => {
    const paragSnippet = post.firstParagraph.split('', 68);
    return {
      id: post.id,
      title: post.title,
      date: post.date,
      snippet: paragSnippet.join('').concat('...')
    };
  });

  // Sort posts by date
  return allPosts.sort((a, b) => {
    if (a > b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
    return 0;
  });
};

export const getPostById = async (id: string) => {
  const post = posts.find((pst) =>
    pst.id === id);
  return post;
};

export const getAllPostIds = () =>
  posts.map((pst) =>
    ({
      params: {
        id: pst.id
      }
    }));
