export default class AccessToken {
  userId: number;

  constructor({ userId }: { userId: number }) {
    this.userId = userId;
  }
}
