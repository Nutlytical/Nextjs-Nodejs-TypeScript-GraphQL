import { config } from 'dotenv';
config();
import 'reflect-metadata';
import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import ApolloServer from './ApolloServer';
import { PassportFB, PassportGoogle } from './utils/passport';
import { FBAuthenticate, GoogleAuthenticate } from './utils/passportAuth';

const { PORT, FRONTEND_URI, DATABASE } = process.env;

PassportFB();
PassportGoogle();

const startServer = async () => {
	try {
		// Connect to the database
		await mongoose.connect(
			`mongodb+srv://${DATABASE}?retryWrites=true&w=majority`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			} as ConnectOptions
		);

		const app = express();
		app.use(cookieParser());

		app.use(passport.initialize());

		// Facebook login route
		app.get('/auth/facebook', passport.authenticate('facebook'));

		app.get(
			'/auth/facebook/callback',
			passport.authenticate('facebook', {
				session: false,
				failureRedirect: FRONTEND_URI,
			}),
			FBAuthenticate
		);

		// Google login route
		app.get(
			'/auth/google',
			passport.authenticate('google', { scope: ['email', 'profile'] })
		);

		app.get(
			'/auth/google/callback',
			passport.authenticate('google', {
				session: false,
				failureRedirect: FRONTEND_URI,
			}),
			GoogleAuthenticate
		);

		const server = await ApolloServer();

		await server.start();
		server.applyMiddleware({
			app,
			// cors: { origin: 'https://studio.apollographql.com', credentials: true },
			cors: {
				// origin: FRONTEND_URI,
				credentials: true,
			},
		});

		app.listen({ port: PORT }, () =>
			console.log(
				`🚀 Server is ready at http://localhost:${PORT}${server.graphqlPath}`
			)
		);
	} catch (error) {
		console.log(error);
	}
};

startServer();
