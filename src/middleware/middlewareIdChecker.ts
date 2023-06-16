import { Request, Response, NextFunction } from 'express';
import { FILES } from '../filesStore';

export const middlewareIdCheck = async function (req: Request, res: Response, next: NextFunction) {
  if (!FILES[req.params.id]) {
    res.status(500);
    return;
  }
  next();
};
