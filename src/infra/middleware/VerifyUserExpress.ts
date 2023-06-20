import { NextFunction, Request, Response } from 'express';
import JwtToken from 'src/application/security/JwtToken';

export default class VerifyUserExpress {
  constructor(readonly jwtToken: JwtToken) {}

  verify = async (req: Request, res: Response, next: NextFunction) => {
    const jwt = req.headers['authorization'];

    if (!jwt) {
      throw new Error('JWT is missing in headers.');
    }

    try {
      await this.jwtToken.verify(jwt);
      next();
    } catch (err) {
      res.status(403).send('JWT is wrong!').end();
    }
  };
}
