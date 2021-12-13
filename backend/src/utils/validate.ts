export const validateUsername = (username: string) => {
	const formatUsername = username.trim();

	return formatUsername.length >= 3 && formatUsername.length <= 60;
};

export const validateEmail = (email: string) => {
	const formatEmail = email.trim().toLowerCase();

	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	return re.test(formatEmail);
};

export const validatePassword = (password: string) => {
	const formatPassword = password.length >= 8;

	if (!formatPassword) {
		return false;
	}

	const re = /(?=.*[a-z])(?=.*[A-Z])/;

	return re.test(password);
};
