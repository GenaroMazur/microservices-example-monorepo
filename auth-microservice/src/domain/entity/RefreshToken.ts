export default class RefreshToken {
  readonly userId: number;
  readonly type = "REFRESH";

  constructor({ userId }: { userId: number }) {
    this.userId = userId;
  }
}
