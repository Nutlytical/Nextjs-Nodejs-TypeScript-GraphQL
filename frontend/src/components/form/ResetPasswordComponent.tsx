import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Swal from 'sweetalert2';

import { useReset_PasswordMutation } from '../../graphql/codegen';

interface Props {
	token: string;
	popup?: string;
}

export default function FormDialog({ token, popup }: Props) {
	const [open, setOpen] = React.useState(false);

	useEffect(() => {
		if (popup === 'popup') setOpen(true);
	}, [popup]);

	const handleClose = () => {
		setOpen(false);
	};

	const {
		register,
		handleSubmit,
		// formState: { errors },
		watch,
	} = useForm<{
		password: string;
		confirmPassword: string;
	}>();

	const [resetPassword, { error }] = useReset_PasswordMutation();

	const onSubmit = handleSubmit(async ({ password }) => {
		await resetPassword({
			variables: { token, password },
		});
		handleClose();
		Swal.fire({
			title: 'Sweet!',
			html:
				"Let's try to " +
				'<a href="/signIn" style="text-decoration:none; font-size:20px">Sign in</a> ',
			imageUrl: 'https://unsplash.it/300/200',
			imageWidth: 300,
			imageHeight: 200,
			imageAlt: 'Custom image',
		});
	});

	if (error)
		Swal.fire('Oops...', `${error.graphQLErrors[0]?.message}`, 'error');

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Subscribe</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Enter your new password below to reset password.
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					label="Password"
					type="password"
					fullWidth
					variant="standard"
					{...register('password', {
						required: 'Password is required',
						minLength: {
							value: 8,
							message: 'Password must be at least 8 characters.',
						},
						validate: (value: string) => {
							const isValid = /(?=.*[a-z])(?=.*[A-Z])/.test(value);

							if (!isValid)
								return 'At least one uppercase and lowercase letter';
							else true;
						},
					})}
				/>
				<TextField
					autoFocus
					margin="dense"
					label="Confirm Password"
					type="password"
					fullWidth
					variant="standard"
					{...register('confirmPassword', {
						required: 'Confirm Password is required',
						validate: (value) => {
							const isValid = value === watch('password');

							if (!isValid) return 'The passwords do not match';
							else true;
						},
					})}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={onSubmit}>Submit</Button>
			</DialogActions>
		</Dialog>
	);
}
