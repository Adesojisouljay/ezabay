import { Client } from "@hiveio/dhive";

export const SERVERS = [
    "https://api.deathwing.me",
    "https://api.hive.blog",
    "https://api.openhive.network",
  ];
  
  export const bridgeServer = new Client(SERVERS, {
    timeout: 3000,
    failoverThreshold: 3,
    consoleOnFailover: true
  });
  
  export const dataLimit = typeof window !== "undefined" && window.screen.width < 540 ? 5 : 20;
  
  export const bridgeApiCall = (endpoint, params) => 
    bridgeServer.call("bridge", endpoint, params);

  export const resolvePost = (post, observer, num) => {
    const { json_metadata: json } = post;
  
    if (
      json.original_author &&
      json.original_permlink &&
      json.tags &&
      json.tags[0] === "cross-post"
    ) {
      return getPost(json.original_author, json.original_permlink, observer, num)
        .then((resp) => {
          if (resp) {
            return {
              ...post,
              original_entry: resp,
              num
            };
          }
  
          return post;
        })
        .catch(() => {
          return post;
        });
    }
  
    return Promise.resolve({ ...post, num });
  };
  
  export const resolvePosts = (posts, observer) => {
    const promises = posts.map((p) => resolvePost(p, observer));
    return Promise.all(promises);
  };

  export const getPost = (author = "", permlink = "", observer = "", num) => {
    return bridgeApiCall("get_post", {
      author,
      permlink,
      observer
    }).then((resp) => {
      if (resp) {
        return resolvePost(resp, observer, num);
      }
  
      return resp;
    });
  };
  