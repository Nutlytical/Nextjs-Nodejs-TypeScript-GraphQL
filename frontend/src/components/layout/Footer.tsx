import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';

export function Copyright(props: any) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{'Copyright © '}
			<MuiLink color="inherit" href="https://mui.com/">
				Your Website
			</MuiLink>
			{new Date().getFullYear()}.
		</Typography>
	);
}

export default function StickyFooter() {
	return (
		<Box>
			<CssBaseline />
			<Box
				component="footer"
				sx={{
					py: 3,
					px: 2,
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? theme.palette.grey[200]
							: theme.palette.grey[800],
				}}
			>
				<Container maxWidth="sm">
					<Typography variant="body1" align="center">
						My sticky footer can be found here.
					</Typography>
					<Copyright sx={{ mt: 5 }} />
				</Container>
			</Box>
		</Box>
	);
}
