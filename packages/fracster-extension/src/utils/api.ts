// 获取用户数据
export async function getUserData(userId: string): Promise<any> {
  const response = await fetch(`https://api.farcaster.xyz/user/${userId}`);
  const data = await response.json();
  return data;
}

// 获取粉丝列表
export async function getUserFollowers(userId: string): Promise<any> {
  const response = await fetch(
    `https://api.farcaster.xyz/user/${userId}/followers`
  );
  const data = await response.json();
  return data;
}

// 获取用户文章
export async function getUserPosts(userId: string): Promise<any> {
  const response = await fetch(
    `https://api.farcaster.xyz/user/${userId}/posts`
  );
  const data = await response.json();
  return data;
}

// 获取推文互动数据
export async function getTweetInteractions(tweetId: string): Promise<any> {
  const response = await fetch(
    `https://api.farcaster.xyz/tweet/${tweetId}/interactions`
  );
  const data = await response.json();
  return data;
}
