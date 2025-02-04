export default class AccessToken {
  userId: number;
  type = "ACCESS";

  constructor({ userId }: { userId: number }) {
    this.userId = userId;
  }
}
