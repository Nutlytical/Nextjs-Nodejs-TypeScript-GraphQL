import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import {
	Button,
	CssBaseline,
	TextField,
	Link,
	Grid,
	Typography,
	Box,
	Container,
	createTheme,
	ThemeProvider,
	CircularProgress,
	Stack,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { useRouter } from 'next/router';

import { Copyright } from '../layout/Footer';
import { useSign_UpMutation } from '../../graphql/codegen';
import { AuthContext } from '../../context/AuthContextProvider';

const theme = createTheme();

export default function SignUp() {
	const { setLoggedInUser } = useContext(AuthContext);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<{
		username: string;
		email: string;
		password: string;
		confirmPassword: string;
	}>();

	const router = useRouter();

	const [signUp, { loading, error }] = useSign_UpMutation();

	const onSubmit = handleSubmit(async ({ username, email, password }) => {
		try {
			const response = await signUp({
				variables: { username, email, password },
			});

			if (response?.data?.signUp) {
				const { signUp } = response.data;

				if (signUp) {
					// Set loggedInUser in context api
					setLoggedInUser(signUp);

					// Push user to their dashboard
					router.push('/');
				}
			}
		} catch (err) {
			setLoggedInUser(null);
		}
	});

	if (error)
		Swal.fire('Oops...', `${error.graphQLErrors[0]?.message}`, 'error');

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 4,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					<Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="username"
									InputLabelProps={
										errors.username?.message
											? {
													style: { color: 'red' },
											  }
											: {
													style: { color: 'grey' },
											  }
									}
									label={
										errors.username?.message
											? errors.username?.message
											: 'Username'
									}
									{...register('username', {
										required: 'Username is required',
										minLength: {
											value: 3,
											message: 'Username must be at least 3 characters.',
										},
										maxLength: {
											value: 60,
											message: 'Username must not more than 60 characters.',
										},
									})}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									InputLabelProps={
										errors.email?.message
											? {
													style: { color: 'red' },
											  }
											: {
													style: { color: 'grey' },
											  }
									}
									label={
										errors.email?.message
											? errors.email?.message
											: error
											? error.graphQLErrors[0]?.message
											: 'Email Address'
									}
									{...register('email', {
										required: 'Email is required',
										pattern: {
											value:
												/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
											message: 'Email is in wrong format.',
										},
									})}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="password"
									InputLabelProps={
										errors.password?.message
											? {
													style: { color: 'red' },
											  }
											: {
													style: { color: 'grey' },
											  }
									}
									label={
										errors.password?.message
											? errors.password?.message
											: 'Password'
									}
									type="password"
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
							</Grid>

							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="confirmPassword"
									InputLabelProps={
										errors.confirmPassword?.message
											? {
													style: { color: 'red' },
											  }
											: {
													style: { color: 'grey' },
											  }
									}
									label={
										errors.confirmPassword?.message
											? errors.confirmPassword?.message
											: 'Confirm Password'
									}
									type="password"
									{...register('confirmPassword', {
										required: 'Confirm Password is required',
										validate: (value) => {
											const isValid = value === watch('password');

											if (!isValid) return 'The passwords do not match';
											else true;
										},
									})}
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}
						>
							{loading ? <CircularProgress /> : 'Sign Up'}
						</Button>
						<Stack direction="row" spacing={2}>
							<Button
								variant="outlined"
								endIcon={<FacebookIcon />}
								sx={{ width: '50%' }}
								href="/backend/auth/facebook"
							>
								facebook
							</Button>
							<Button
								variant="outlined"
								endIcon={<GoogleIcon />}
								sx={{ width: '50%' }}
								href="/backend/auth/google"
								color="secondary"
							>
								Google
							</Button>
						</Stack>

						<Grid container justifyContent="flex-end" sx={{ mt: 1 }}>
							<Grid item>
								<Link href="/signIn" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Copyright sx={{ mt: 5 }} />
			</Container>
		</ThemeProvider>
	);
}
