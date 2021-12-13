import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const createToken = (userId: string, tokenVersion: number) =>
	jwt.sign({ userId, tokenVersion }, process.env.COOKIE_SECRET!, {
		expiresIn: '1d',
	});

export const sendToken = (res: Response, token: string) =>
	res.cookie(process.env.COOKIE_NAME!, token, {
		sameSite: true,
		// secure: true,
		httpOnly: true,
	});

export const verifyToken = (token: string) =>
	jwt.verify(token, process.env.COOKIE_SECRET!);
