import * as React from 'react';
import { CircularProgress, Box } from '@mui/material';

export default function Loading() {
	return (
		<div
			style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Box>
				<CircularProgress disableShrink />
			</Box>
		</div>
	);
}
