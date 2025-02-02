export default class GenerateAccessTokenDto {
  constructor({ userId }: { userId: number }) {
    this.userId = userId;
  }
  userId: number;

  public toObject() {
    return {
      userId: this.userId,
    };
  }
}
