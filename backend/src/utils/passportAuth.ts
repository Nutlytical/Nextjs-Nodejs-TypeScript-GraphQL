import { Response } from 'express';

import { UserModel, User } from '../schemas/User';
import { AppRequest } from '../types';
import { createToken, sendToken } from './tokenHandler';

const { FRONTEND_URI } = process.env;

export const FBAuthenticate = async (req: AppRequest, res: Response) => {
	if (!req.userProfile) return;

	const { id, emails, displayName, provider } = req.userProfile;

	try {
		let token: string;

		if (emails && emails[0].value) {
			const user = await UserModel.findOne({ email: emails[0].value });

			if (!user) {
				// New user => create new user on our database
				const newUser = await UserModel.create<
					Pick<User, 'username' | 'email' | 'facebookId' | 'password'>
				>({
					username: displayName,
					email: emails && emails[0].value,
					facebookId: id,
					password: provider,
				});

				await newUser.save();

				// Create token
				token = createToken(newUser.id, newUser.tokenVersion);

				// Send token to the frontend
				sendToken(res, token);

				// Redirect user to the frontend => dashboard
				res.redirect(`${FRONTEND_URI}`);
			} else {
				await UserModel.findOneAndUpdate(
					{ email: emails[0].value },
					{ facebookId: id }
				);
				// Create token
				token = createToken(user.id, user.tokenVersion);

				// Send token to the frontend
				sendToken(res, token);

				// Redirect user to the frontend => dashboard
				res.redirect(`${FRONTEND_URI}`);
			}
		} else {
			const newUser = await UserModel.create<
				Pick<User, 'username' | 'email' | 'facebookId' | 'password'>
			>({
				username: displayName,
				email: provider,
				facebookId: id,
				password: provider,
			});

			await newUser.save();

			// Create token
			token = createToken(newUser.id, newUser.tokenVersion);

			// Send token to the frontend
			sendToken(res, token);

			// Redirect user to the frontend => dashboard
			res.redirect(`${FRONTEND_URI}`);
		}
	} catch (error) {
		res.redirect(FRONTEND_URI!);
	}
};

export const GoogleAuthenticate = async (req: AppRequest, res: Response) => {
	if (!req.userProfile) return;

	const { id, emails, displayName, provider } = req.userProfile;

	try {
		let token: string;

		if (emails && emails[0].value) {
			const user = await UserModel.findOne({ email: emails[0].value });

			if (!user) {
				// New user => create new user on our database
				const newUser = await UserModel.create<
					Pick<User, 'username' | 'email' | 'googleId' | 'password'>
				>({
					username: displayName,
					email: emails && emails[0].value,
					googleId: id,
					password: provider,
				});

				await newUser.save();

				// Create token
				token = createToken(newUser.id, newUser.tokenVersion);

				// Send token to the frontend
				sendToken(res, token);

				// Redirect user to the frontend => dashboard
				res.redirect(`${FRONTEND_URI}`);
			} else {
				await UserModel.findOneAndUpdate(
					{ email: emails[0].value },
					{ googleId: id }
				);

				// Create token
				token = createToken(user.id, user.tokenVersion);

				// Send token to the frontend
				sendToken(res, token);

				// Redirect user to the frontend => dashboard
				res.redirect(`${FRONTEND_URI}`);
			}
		} else {
			const newUser = await UserModel.create<
				Pick<User, 'username' | 'email' | 'googleId' | 'password'>
			>({
				username: displayName,
				email: provider,
				googleId: id,
				password: provider,
			});

			await newUser.save();

			// Create token
			token = createToken(newUser.id, newUser.tokenVersion);

			// Send token to the frontend
			sendToken(res, token);

			// Redirect user to the frontend => dashboard
			res.redirect(`${FRONTEND_URI}`);
		}
	} catch (error) {
		res.redirect(FRONTEND_URI!);
	}
};
