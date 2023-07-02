import { SignedToken } from 'src/domain/SignedToken';

export default interface JwtToken {
  signAccessToken(userId: string): Promise<SignedToken>;
  verify(token: string): Promise<string>;
}
