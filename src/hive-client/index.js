import { client } from "./client";
import { resolvePosts, bridgeApiCall } from "./server";

export const getAccounts = async (usernames) =>
    await client.database.getAccounts(usernames);
  
export const getAccount = async (username) =>
    await getAccounts([username]).then((resp) => resp[0]);

export const getCommunityPosts = async (
    sort = "trending",
    limit = 20,
    observer = ""
  ) => {
    try {
      const response = await bridgeApiCall("get_ranked_posts", {
        sort,
        start_author: "",
        start_permlink: "",
        limit,
        tag: "hive-106130",
        observer
      });
  
      if (response) {
        return resolvePosts(response, observer);
      }
  
      return response;
    } catch (error) {
      console.error("Failed to fetch community posts:", error);
      throw error;
    }
  };
  
  export const getSinglePost = async (author, permlink) => {
    try {
        const response = await bridgeApiCall("get_content", {
            author,
            permlink
        });

        if (response) {
            return resolvePosts([response]);
        }

        return null;
    } catch (error) {
        console.error("Failed to fetch single post:", error);
        throw error;
    }
};
