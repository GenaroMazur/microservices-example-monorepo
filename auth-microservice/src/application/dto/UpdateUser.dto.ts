export interface UpdateUserPrimitive {
  username?: string;
  password?: string;
}

export default class UpdateUserDto {
  private primitive: UpdateUserPrimitive;

  private constructor(primitive: UpdateUserPrimitive) {
    this.primitive = primitive;
  }

  static create(primitive: UpdateUserPrimitive): UpdateUserDto {
    return new UpdateUserDto(primitive);
  }

  get username(): string | undefined {
    return this.primitive.username;
  }

  get password(): string | undefined {
    return this.primitive.password;
  }

  toPrimitive(): UpdateUserPrimitive {
    return this.primitive;
  }
}
