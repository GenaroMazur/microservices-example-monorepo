export interface CreateUserPrimitive {
  username: string;
  password: string;
}

export default class CreateUserDto {
  private primitive: CreateUserPrimitive;

  constructor(primitive: CreateUserPrimitive) {
    this.primitive = primitive;
  }

  static create(primitive: CreateUserPrimitive): CreateUserDto {
    return new CreateUserDto(primitive);
  }

  get username(): string {
    return this.primitive.username;
  }

  get password(): string {
    return this.primitive.password;
  }

  toPrimitive(): CreateUserPrimitive {
    return this.primitive;
  }
}
