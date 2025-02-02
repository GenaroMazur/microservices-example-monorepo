export default class GenerateAccessTokenDto {
  constructor({ username }: { username: string }) {
    this.username = username;
  }
  username: string;

  public toObject() {
    return {
      username: this.username,
    };
  }
}
