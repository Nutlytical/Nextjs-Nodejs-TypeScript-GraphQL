import Router from 'next/router';
import React, { createContext, useEffect, useState } from 'react';

import { useMeQuery, User } from '../graphql/codegen';

interface AuthContextValues {
	loggedInUser: User | null;
	setLoggedInUser: (user: User | null) => void;
}

const initialState: AuthContextValues = {
	loggedInUser: null,
	setLoggedInUser: () => {},
};

export const AuthContext = createContext<AuthContextValues>(initialState);

const AuthContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

	const { data } = useMeQuery();

	useEffect(() => {
		if (data?.me) setLoggedInUser(data.me);
	}, [data?.me]);

	useEffect(() => {
		const syncSignOut = (e: StorageEvent) => {
			if (e.key === 'signOut') {
				// Log user out
				setLoggedInUser(null);

				// Push user to the homepage
				Router.push('/');
			}
		};

		window.addEventListener('storage', syncSignOut);

		return () => window.removeEventListener('storage', syncSignOut);
	}, []);

	return (
		<AuthContext.Provider
			value={{
				loggedInUser,
				setLoggedInUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
