import JwtToken from 'src/application/security/JwtToken';
import { SignedToken } from 'src/domain/SignedToken';

type ID = string;

interface TokenMemory {
  userId: string;
  token: string;
}

export default class JwtTokenMemory implements JwtToken {
  private TOKENS: Record<ID, TokenMemory> = {};

  signAccessToken(userId: string): Promise<SignedToken> {
    const token = `${userId}_TOKEN`;
    this.TOKENS[userId] = { token, userId };
    return Promise.resolve({ token });
  }

  verify(token: string): Promise<string> {
    const jwtToken = Object.values(this.TOKENS).find((j) => j.token === token);
    if (!jwtToken) throw new Error('Token verify failed!');
    return Promise.resolve(jwtToken.userId);
  }
}
