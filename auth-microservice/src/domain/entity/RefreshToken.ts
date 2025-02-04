export default class RefreshToken {
  userId: number;
  type = "REFRESH";

  constructor({ userId }: { userId: number }) {
    this.userId = userId;
  }
}
