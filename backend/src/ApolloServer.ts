import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';

import { AuthResolvers } from './resolvers/AuthResolvers';
import { AppContext } from './types/index';
import { UserModel } from './schemas/User';

import { createToken, sendToken, verifyToken } from './utils/tokenHandler';

export default async () => {
	const schema: GraphQLSchema = await buildSchema({
		resolvers: [AuthResolvers],
		emitSchemaFile: { path: './src/schemas/schema.graphql' },
		validate: false,
	});
	return new ApolloServer({
		schema,
		context: async ({ req, res }: AppContext) => {
			const token = req.cookies[process.env.COOKIE_NAME!];

			if (token) {
				try {
					// Verify token
					const decodedToken = verifyToken(token) as {
						userId: string;
						tokenVersion: number;
						iat: number;
						exp: number;
					} | null;

					if (decodedToken) {
						req.userId = decodedToken.userId;
						req.tokenVersion = decodedToken.tokenVersion;

						if (Date.now() / 1000 - decodedToken.iat > 6 * 60 * 60) {
							const user = await UserModel.findById(req.userId);

							if (user) {
								// Check if the token version is correct

								if (user.tokenVersion === req.tokenVersion) {
									// Update the token version in the user info in the database
									user.tokenVersion += 1;

									const updatedUser = await user.save();

									if (updatedUser) {
										// Create token
										const token = createToken(
											updatedUser.id,
											updatedUser.tokenVersion
										);

										req.tokenVersion = updatedUser.tokenVersion;

										// Send token to the frontend
										sendToken(res, token);
									}
								}
							}
						}
					}
				} catch (error) {
					req.userId = undefined;
					req.tokenVersion = undefined;
				}
			}

			return { req, res };
		},
	});
};
