import { post, get } from "@/utils/post.method";

export class SubscribeServiceApi {
  static subscribeEmail = "/api/subscribeForm/subscribe";
  static subscribeRss = "/api/subscribeForm/rss";
}

export class SubscribeEmailApi {
  static async subscribeEmail<U, T>(params?: T): Promise<U> {
    return await post<U>("/api/subscribeForm/subscribe", params);
  }

  static async subscribeRss<U>(): Promise<U> {
    return await get<U>("/api/subscribeForm/rss");
  }
}
