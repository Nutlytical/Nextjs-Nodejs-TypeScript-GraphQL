import React, { useContext } from 'react';

import Swal from 'sweetalert2';
import { Link, Typography, Toolbar } from '@mui/material';

import { AuthContext } from '../../context/AuthContextProvider';
import { useSign_OutMutation } from '../../graphql/codegen';
import router from 'next/router';

const sections = [
	{ title: 'Technology', url: '#' },
	{ title: 'Design', url: '#' },
	{ title: 'Culture', url: '#' },
	{ title: 'Business', url: '#' },
	{ title: 'Politics', url: '#' },
	{ title: 'Opinion', url: '#' },
	{ title: 'Science', url: '#' },
	{ title: 'Health', url: '#' },
	{ title: 'Style', url: '#' },
	{ title: 'Travel', url: '#' },
];

export default function Navbar() {
	const { setLoggedInUser, loggedInUser } = useContext(AuthContext);

	const [signOut, { error }] = useSign_OutMutation();

	const handleSignOut = async () => {
		const response = await signOut();
		if (response?.data?.signOut?.message) {
			// Set auth user to null
			setLoggedInUser(null);

			// Sync signOut
			window.localStorage.setItem('signOut', Date.now().toString());

			// Push user to the homepage
			router.push('/');
		}
	};

	if (error)
		Swal.fire('Oops...', `${error.graphQLErrors[0]?.message}`, 'error');

	return (
		<React.Fragment>
			<Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Typography
					component="h2"
					variant="h5"
					color="inherit"
					align="center"
					noWrap
					sx={{ flex: 1 }}
				>
					Next.js-beta with TypeScript
				</Typography>
				{!loggedInUser ? (
					<>
						<Link
							href="/signIn"
							color="primary"
							style={{ marginRight: '20px' }}
						>
							Sign In
						</Link>
						<Link href="/signUp" color="primary">
							Sign up
						</Link>
					</>
				) : (
					<Link href="#" onClick={handleSignOut}>
						Sign out
					</Link>
				)}
			</Toolbar>
			<Toolbar
				component="nav"
				variant="dense"
				sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
			>
				{sections.map((section) => (
					<Link
						color="inherit"
						noWrap
						key={section.title}
						variant="body2"
						href={section.url}
						sx={{ p: 1, flexShrink: 0 }}
					>
						{section.title}
					</Link>
				))}
			</Toolbar>
		</React.Fragment>
	);
}
