import { compare, hash } from "bcrypt";
import { PasswordEncoderInterface } from "../interfaces/PasswordEncoder";

export default class PasswordEncoderApplication
  implements PasswordEncoderInterface
{
  constructor(private readonly SALT: number) {}

  async encode(password: string): Promise<string> {
    return await hash(password, this.SALT);
  }
  async compare(password: string, encodedPassword: string): Promise<boolean> {
    return await compare(password, encodedPassword);
  }
}
