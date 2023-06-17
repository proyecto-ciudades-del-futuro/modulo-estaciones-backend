import bcrypt from "bcrypt";
import {InternalError} from "../../types/errors";
import {NextFunction, Request, Response} from "express";
import {isTokenBlacklisted} from "../../utils/blacklists";
import jwt, {Secret} from "jsonwebtoken";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSaltSync(12);
    return await bcrypt.hashSync(password, salt);
  } catch (e: any) {
    throw new InternalError('Unspecified error while hashing password')
  }
}
export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401);

  if (isTokenBlacklisted(token)) {
    return res.sendStatus(403);
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET environment variable not set');
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;

  jwt.verify(token, secret as Secret, (err, user) => {
    if (err) return res.sendStatus(403);
    //@ts-ignore
    req.user = user;
    next();
  });
}