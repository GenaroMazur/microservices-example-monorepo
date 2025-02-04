export default class AccessToken {
  readonly userId: number;
  readonly type = "ACCESS";

  constructor({ userId }: { userId: number }) {
    this.userId = userId;
  }
}
