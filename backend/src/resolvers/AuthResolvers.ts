import {
	Query,
	Resolver,
	Mutation,
	Arg,
	Ctx,
	ObjectType,
	Field,
} from 'type-graphql';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import sgMail, { MailDataRequired } from '@sendgrid/mail';

import { User, UserModel } from '../schemas/User';
import {
	validateEmail,
	validatePassword,
	validateUsername,
} from '../utils/validate';
import { createToken, sendToken } from '../utils/tokenHandler';
import { AppContext, RoleOptions } from '../types';
import { isAuthenticated } from '../utils/authHandeler';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

@ObjectType()
export class ResponseMessage {
	@Field()
	message: string;
}

@Resolver()
export class AuthResolvers {
	@Query(() => [User], { nullable: 'items' })
	async users(@Ctx() { req }: AppContext): Promise<User[] | null> {
		try {
			// Check if user is authenticated
			const user = await isAuthenticated(req);

			// Check if user is authorized (Admin. SuperAdmin)
			const isAuthorized =
				user.roles.includes(RoleOptions.superAdmin) ||
				user.roles.includes(RoleOptions.admin);

			if (!isAuthorized) throw new Error('No Authorization');

			return UserModel.find().sort({ createdAt: 'desc' });
		} catch (error) {
			throw error;
		}
	}

	@Query(() => User, { nullable: true })
	async me(@Ctx() { req }: AppContext): Promise<User | null> {
		try {
			console.log(req.tokenVersion);

			// Check if user is authenticated
			const user = await isAuthenticated(req);

			return user;
		} catch (error) {
			throw error;
		}
	}

	@Mutation(() => User, { nullable: true })
	async signUp(
		@Arg('username') username: string,
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() { res }: AppContext
	): Promise<User | null> {
		try {
			if (!username) throw new Error('Username is required.');
			if (!email) throw new Error('Email is required.');
			if (!password) throw new Error('Password is required.');

			// Check if email exist in the database
			const user = await UserModel.findOne({ email });

			if (user)
				throw new Error('Email already in use, please sign in instead.');

			// Validate username
			const isUsernameValid = validateUsername(username);
			if (!isUsernameValid)
				throw new Error('Username must be between 8-60 characters.');

			// Validate email
			const isEmailValid = validateEmail(email);
			if (!isEmailValid) throw new Error('Email is in wrong format.');

			// Validate password
			const isPasswordValid = validatePassword(password);
			if (!isPasswordValid)
				throw new Error(
					'Password must be at least 8 characters and  one uppercase and lowercase letter.'
				);

			const hashedPassword = await bcrypt.hash(password, 10);

			const newUser = await UserModel.create({
				username,
				email,
				password: hashedPassword,
			});

			await newUser.save();

			// Create token
			const token = createToken(newUser.id, newUser.tokenVersion);

			// Send token to the frontend
			sendToken(res, token);

			return newUser;
		} catch (error) {
			throw error;
		}
	}

	@Mutation(() => User, { nullable: true })
	async signIn(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() { res }: AppContext
	): Promise<User | null> {
		try {
			if (!email) throw new Error('Email is required.');
			if (!password) throw new Error('Password is required.');

			// Check if email exist in the database
			const user = await UserModel.findOne({ email });

			if (!user) throw new Error('Email or password is invalid.');

			// Check if the password is valid
			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (!isPasswordValid) throw new Error('Email or password is invalid.');

			// Create token
			const token = createToken(user.id, user.tokenVersion);

			// Send token to the frontend
			sendToken(res, token);

			return user;
		} catch (error) {
			throw error;
		}
	}

	@Mutation(() => ResponseMessage, { nullable: true })
	async signOut(
		@Ctx() { req, res }: AppContext
	): Promise<ResponseMessage | null> {
		try {
			// Check if email exist in the database
			const user = await UserModel.findById(req.userId);

			if (!user) return null;

			// Bump up token version
			user.tokenVersion += 1;

			await user.save();

			// Clear cookie in the browser
			res.clearCookie(process.env.COOKIE_NAME!);

			return { message: 'Goodbye' };
		} catch (error) {
			throw error;
		}
	}

	@Mutation(() => ResponseMessage, { nullable: true })
	async requestResetPassword(
		@Arg('email') email: string
	): Promise<ResponseMessage | null> {
		try {
			if (!email) throw new Error('Email is required.');
			// Check if email exist in the database
			const user = await UserModel.findOne({ email });

			if (!user) throw new Error('Email not found.');

			const resetPasswordToken = randomBytes(16).toString('hex');
			const resetPasswordTokenExpiry = Date.now() + 1000 * 60 * 30;

			// Update user in database
			const updatedUser = await UserModel.findOneAndUpdate(
				{ email },
				{ resetPasswordToken, resetPasswordTokenExpiry },
				{ useFindAndModify: false }
			);

			if (!updatedUser) throw new Error('Sorry, cannot proceed.');

			// Send email to user email
			const message: MailDataRequired = {
				from: 'nattanun2542@gmail.com',
				to: email,
				subject: 'Reset password',
				html: `
					<div>
						<p>Please click below link to reset your password.</p>\
						<a href="${process.env.FRONTEND_URI}/?resetToken=${resetPasswordToken}" target="_blank">
							Click to reset password
						</a>
					</div>
				`,
			};

			const response = await sgMail.send(message);

			if (!response || response[0]?.statusCode !== 202)
				throw new Error('Sorry, cannot proceed.');

			return { message: 'Please check your email to reset password.' };
		} catch (error) {
			throw error;
		}
	}

	@Mutation(() => ResponseMessage, { nullable: true })
	async resetPassword(
		@Arg('password') password: string,
		@Arg('token') token: string
	): Promise<ResponseMessage | null> {
		try {
			if (!password) throw new Error('Password is required.');
			if (!token) throw new Error('Sorry, cannot proceed.');

			// Check if email exist in the database
			const user = await UserModel.findOne({ resetPasswordToken: token });

			if (!user) throw new Error('Sorry, cannot proceed.');

			if (!user.resetPasswordTokenExpiry)
				throw new Error('Sorry, cannot proceed.');

			// Check if token is valid
			const isTokenValid = Date.now() <= user.resetPasswordTokenExpiry;

			if (!isTokenValid) throw new Error('Sorry, cannot proceed.');

			// Validate password
			const isPasswordValid = validatePassword(password);
			if (!isPasswordValid)
				throw new Error(
					'Password must be at least 8 characters and  one uppercase and lowercase letter.'
				);

			// Hash password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Update user in database
			const updatedUser = await UserModel.findOneAndUpdate(
				{ email: user.email },
				{
					password: hashedPassword,
					resetPasswordToken: '',
					resetPasswordTokenExpiry: 0,
				},
				{ useFindAndModify: false }
			);

			if (!updatedUser) throw new Error('Sorry, cannot proceed.');

			return { message: 'Successfully reset password.' };
		} catch (error) {
			throw error;
		}
	}

	@Mutation(() => User, { nullable: true })
	async updateRoles(
		@Arg('newRoles', () => [String]) newRoles: RoleOptions[],
		@Arg('userId') userId: string,
		@Ctx() { req }: AppContext
	): Promise<User | null> {
		try {
			// Check if user(admin) is authenticated
			const admin = await isAuthenticated(req);

			// Check if admin is super admin
			const isSuperAdmin = admin.roles.includes(RoleOptions.superAdmin);

			if (!isSuperAdmin) throw new Error('Not authorized.');

			// Query user (to be updated) from the database
			const user = await UserModel.findById(userId);

			if (!user) throw new Error('User not found.');

			// Update roles
			user.roles = newRoles;

			await user.save();

			return user;
		} catch (error) {
			throw error;
		}
	}

	@Mutation(() => ResponseMessage, { nullable: true })
	async deleteUser(
		@Arg('userId') userId: string,
		@Ctx() { req }: AppContext
	): Promise<ResponseMessage | null> {
		try {
			// Check if user(admin) is authenticated
			const admin = await isAuthenticated(req);

			// Check if admin is super admin
			const isSuperAdmin = admin.roles.includes(RoleOptions.superAdmin);

			if (!isSuperAdmin) throw new Error('Not authorized.');

			// Query user (to be updated) from the database
			const user = await UserModel.findByIdAndDelete(userId);

			if (!user) throw new Error('User not found.');

			return { message: `${user.username} has been deleted.` };
		} catch (error) {
			throw error;
		}
	}
}
