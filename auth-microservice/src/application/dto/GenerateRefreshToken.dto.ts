export default class GenerateRefreshTokenDto {
  userId: number;

  constructor({ userId }: { userId: number }) {
    this.userId = userId;
  }

  toObject(): object {
    return {
      userId: this.userId,
    };
  }
}
