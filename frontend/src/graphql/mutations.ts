import { gql } from '@apollo/client';

export const SIGN_UP = gql`
	# Increments a back-end counter and gets its resulting value
	mutation SIGN_UP($username: String!, $email: String!, $password: String!) {
		signUp(username: $username, email: $email, password: $password) {
			id
			username
			email
			roles
			createdAt
		}
	}
`;

export const SIGN_IN = gql`
	# Increments a back-end counter and gets its resulting value
	mutation SIGN_IN($email: String!, $password: String!) {
		signIn(email: $email, password: $password) {
			id
			username
			email
			roles
			createdAt
		}
	}
`;

export const SIGN_OUT = gql`
	mutation SIGN_OUT {
		signOut {
			message
		}
	}
`;

export const REQUEST_RESET_PASSWORD = gql`
	mutation REQUEST_RESET_PASSWORD($email: String!) {
		requestResetPassword(email: $email) {
			message
		}
	}
`;

export const RESET_PASSWORD = gql`
	mutation RESET_PASSWORD($token: String!, $password: String!) {
		resetPassword(token: $token, password: $password) {
			message
		}
	}
`;
