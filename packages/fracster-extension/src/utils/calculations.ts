// 计算各个系数
export function calculateFollowerScore(followers: any[]): number {
  return followers.length;
}

// 计算认证系数
export function calculateVerificationScore(verified: boolean): number {
  return verified ? 2 : 1;
}

// 计算注册时长系数
export function calculateRegistrationScore(registrationDate: string): number {
  const now = new Date();
  const registration = new Date(registrationDate);
  const years =
    (now.getTime() - registration.getTime()) / (1000 * 60 * 60 * 24 * 365);
  return Math.min(5, Math.max(1, years));
}

// 计算关注系数
export function calculateFollowingScore(following: any[]): number {
  return following.length;
}

// 计算互动系数
export function calculateActionScore(likes: number, reposts: number): number {
  return likes * 1 + reposts * 4;
}

// 总分计算
export function calculateTotalScore(user: any): number {
  const followerScore = calculateFollowerScore(user.followers);
  const verificationScore = calculateVerificationScore(user.verified);
  const registrationScore = calculateRegistrationScore(user.registrationDate);
  const followingScore = calculateFollowingScore(user.following);
  const actionScore = calculateActionScore(user.likes, user.reposts);

  return (
    followerScore *
    verificationScore *
    registrationScore *
    followingScore *
    actionScore
  );
}

// 抽奖逻辑
export function runLottery(interactions: any[]): any {
  const participants = interactions.map((interaction) => interaction.user);
  const winner = participants[Math.floor(Math.random() * participants.length)];
  return winner;
}
