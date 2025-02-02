export default class RefreshToken {
  userId: number;

  constructor({ userId }: { userId: number }) {
    this.userId = userId;
  }
}
