import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
	uri: '/backend/graphql',
	cache: new InMemoryCache(),
	credentials: 'include',
});

export default client;
