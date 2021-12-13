import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import {
	createTheme,
	ThemeProvider,
	Typography,
	Grid,
	Box,
	Paper,
	Link,
	TextField,
	CssBaseline,
	Button,
	Avatar,
	Alert,
	CircularProgress,
	Stack,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';

import { Copyright } from '../layout/Footer';
import FormDialog from './RequestResetPasswordComponent';

import { useSign_InMutation } from '../../graphql/codegen';
import router from 'next/router';
import { AuthContext } from '../../context/AuthContextProvider';
import { isAdmin } from '../../utils/checkAuth';

const theme = createTheme();

export default function SignIn() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{
		email: string;
		password: string;
	}>();

	const { setLoggedInUser } = useContext(AuthContext);

	const [signIn, { loading, error }] = useSign_InMutation();

	const onSubmit = handleSubmit(async ({ email, password }) => {
		try {
			const response = await signIn({
				variables: { email, password },
			});

			if (response?.data?.signIn) {
				const user = response.data.signIn;
				setLoggedInUser(user);

				// Push user to admin page or dashboard page
				if (isAdmin(user)) {
					// Push user to their admin page
					router.push('/');
				} else {
					// Push user to their dashboard page
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
			<Grid container component="main" sx={{ height: '100vh' }}>
				<CssBaseline />
				<Grid
					item
					xs={false}
					sm={4}
					md={7}
					sx={{
						backgroundImage: 'url(https://source.unsplash.com/random)',
						backgroundRepeat: 'no-repeat',
						backgroundColor: (t) =>
							t.palette.mode === 'light'
								? t.palette.grey[50]
								: t.palette.grey[900],
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				/>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					<Box
						sx={{
							my: 8,
							mx: 4,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component="h1" variant="h5">
							Sign in
						</Typography>
						<Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
							<TextField
								margin="normal"
								required
								fullWidth
								InputLabelProps={
									errors.email?.message
										? {
												style: { color: 'red' },
										  }
										: {
												style: { color: 'grey' },
										  }
								}
								id="email"
								label={
									errors.email?.message
										? errors.email?.message
										: 'Email Address'
								}
								autoFocus
								{...register('email', {
									required: 'Email is required',
								})}
							/>
							<TextField
								margin="normal"
								required
								fullWidth
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
								id="password"
								{...register('password', {
									required: 'Password is required',
								})}
							/>
							{error && (
								<Alert severity="error">
									{error.graphQLErrors[0]?.message}
								</Alert>
							)}
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
								disabled={loading}
							>
								{loading ? <CircularProgress /> : 'Sign In'}
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
							<Grid container sx={{ mt: 1 }}>
								<Grid item xs>
									<FormDialog />
								</Grid>
								<Grid item>
									<Link href="/signUp" variant="body2">
										{"Don't have an account?"}
									</Link>
								</Grid>
							</Grid>
							<Copyright sx={{ mt: 5 }} />
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
}
