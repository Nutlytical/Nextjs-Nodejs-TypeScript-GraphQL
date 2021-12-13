import passport from 'passport';
import {
	Strategy as FacebookStrategy,
	StrategyOptionWithRequest as FBStrategyOptionWithRequest,
} from 'passport-facebook';
import {
	Strategy as GoogleStrategy,
	StrategyOptionsWithRequest as GoogleStrategyOptionsWithRequest,
} from 'passport-google-oauth20';

import { AppRequest } from '../types';

const {
	PORT,
	FACEBOOK_CLIENT_ID,
	FACEBOOK_CLIENT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
} = process.env;

const FBConfig: FBStrategyOptionWithRequest = {
	clientID: FACEBOOK_CLIENT_ID!,
	clientSecret: FACEBOOK_CLIENT_SECRET!,
	callbackURL: `http://localhost:${PORT}/auth/facebook/callback`,
	profileFields: ['id', 'displayName', 'name', 'email'],
	passReqToCallback: true,
};

export const PassportFB = () => {
	return passport.use(
		new FacebookStrategy(FBConfig, (req, _, __, profile, done) => {
			try {
				if (profile) {
					(req as AppRequest).userProfile = profile;
					done(undefined, profile);
				}
			} catch (error) {
				done(error);
			}
		})
	);
};

const GoogleConfig: GoogleStrategyOptionsWithRequest = {
	clientID: GOOGLE_CLIENT_ID!,
	clientSecret: GOOGLE_CLIENT_SECRET!,
	callbackURL: `http://localhost:${PORT}/auth/google/callback`,
	passReqToCallback: true,
};

export const PassportGoogle = () => {
	return passport.use(
		new GoogleStrategy(GoogleConfig, (req, _, __, profile, done) => {
			try {
				if (profile) {
					(req as AppRequest).userProfile = profile;
					done(undefined, profile);
				}
			} catch (error) {
				done(error);
			}
		})
	);
};
