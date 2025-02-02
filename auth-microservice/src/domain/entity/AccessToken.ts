export default class AccessToken {
  id: string;
  username: string;

  constructor({ id, username }: { id: string; username: string }) {
    this.id = id;
    this.username = username;
  }
}
