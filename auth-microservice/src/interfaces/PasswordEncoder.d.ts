export interface PasswordEncoderInterface {
  encode(password: string): Promise<string>;
  compare(password: string, encodedPassword: string): Promise<boolean>;
}
