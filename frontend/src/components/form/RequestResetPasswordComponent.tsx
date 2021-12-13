import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm } from 'react-hook-form';
import { Link } from '@mui/material';
import Swal from 'sweetalert2';

import { useRequest_Reset_PasswordMutation } from '../../graphql/codegen';

export default function FormDialog() {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const {
		register,
		handleSubmit,
		// formState: { errors },
	} = useForm<{
		email: string;
	}>();

	const [requestResetPassword, { data, error }] =
		useRequest_Reset_PasswordMutation();

	const onSubmit = handleSubmit(async ({ email }) => {
		if (data) {
			handleClose();
		} else {
			await requestResetPassword({ variables: { email } });
			handleClickOpen();
		}
	});

	if (error)
		Swal.fire('Oops...', `${error.graphQLErrors[0]?.message}`, 'error');

	return (
		<>
			<Link variant="body2" href="#" onClick={handleClickOpen}>
				Forgot password ?
			</Link>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Forgot password ?</DialogTitle>
				<DialogContent>
					{data ? (
						<DialogContentText>
							{data.requestResetPassword?.message}
						</DialogContentText>
					) : (
						<>
							<DialogContentText>
								Enter your email below to reset password.
							</DialogContentText>
							<TextField
								autoFocus
								margin="dense"
								label="Email Address"
								type="email"
								fullWidth
								variant="standard"
								{...register('email', {
									required: 'Email is required',
								})}
							/>
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={onSubmit}>Submit</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
