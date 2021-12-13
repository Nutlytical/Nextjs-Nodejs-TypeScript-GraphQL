import React, { PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/router';

import NavBar from './Navbar';
import Footer from './Footer';
import ResetPasswordComponent from '../form/ResetPasswordComponent';

export default function Layout({ children }: PropsWithChildren<{}>) {
	const { query, asPath, replace } = useRouter();

	useEffect(() => {
		if (asPath === '/#_=_' || asPath === '/#') {
			replace('/');
		}
	}, [asPath, replace]);

	return (
		<div>
			<NavBar />
			<div>{children}</div>
			<ResetPasswordComponent
				token={query?.resetToken as string}
				popup={query.resetToken && 'popup'}
			/>
			<Footer />
		</div>
	);
}
