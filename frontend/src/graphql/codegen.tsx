import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteUser?: Maybe<ResponseMessage>;
  requestResetPassword?: Maybe<ResponseMessage>;
  resetPassword?: Maybe<ResponseMessage>;
  signIn?: Maybe<User>;
  signOut?: Maybe<ResponseMessage>;
  signUp?: Maybe<User>;
  updateRoles?: Maybe<User>;
};


export type MutationDeleteUserArgs = {
  userId: Scalars['String'];
};


export type MutationRequestResetPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUpdateRolesArgs = {
  newRoles: Array<Scalars['String']>;
  userId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  users: Array<Maybe<User>>;
};

export type ResponseMessage = {
  __typename?: 'ResponseMessage';
  message: Scalars['String'];
};

/** User Model */
export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  roles: Array<Scalars['String']>;
  username: Scalars['String'];
};

export type Sign_UpMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type Sign_UpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'User', id: string, username: string, email: string, roles: Array<string>, createdAt: any } | null | undefined };

export type Sign_InMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type Sign_InMutation = { __typename?: 'Mutation', signIn?: { __typename?: 'User', id: string, username: string, email: string, roles: Array<string>, createdAt: any } | null | undefined };

export type Sign_OutMutationVariables = Exact<{ [key: string]: never; }>;


export type Sign_OutMutation = { __typename?: 'Mutation', signOut?: { __typename?: 'ResponseMessage', message: string } | null | undefined };

export type Request_Reset_PasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type Request_Reset_PasswordMutation = { __typename?: 'Mutation', requestResetPassword?: { __typename?: 'ResponseMessage', message: string } | null | undefined };

export type Reset_PasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type Reset_PasswordMutation = { __typename?: 'Mutation', resetPassword?: { __typename?: 'ResponseMessage', message: string } | null | undefined };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, username: string, email: string, roles: Array<string>, createdAt: any } | null | undefined };


export const Sign_UpDocument = gql`
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
export type Sign_UpMutationFn = Apollo.MutationFunction<Sign_UpMutation, Sign_UpMutationVariables>;

/**
 * __useSign_UpMutation__
 *
 * To run a mutation, you first call `useSign_UpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSign_UpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSign_UpMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSign_UpMutation(baseOptions?: Apollo.MutationHookOptions<Sign_UpMutation, Sign_UpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Sign_UpMutation, Sign_UpMutationVariables>(Sign_UpDocument, options);
      }
export type Sign_UpMutationHookResult = ReturnType<typeof useSign_UpMutation>;
export type Sign_UpMutationResult = Apollo.MutationResult<Sign_UpMutation>;
export type Sign_UpMutationOptions = Apollo.BaseMutationOptions<Sign_UpMutation, Sign_UpMutationVariables>;
export const Sign_InDocument = gql`
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
export type Sign_InMutationFn = Apollo.MutationFunction<Sign_InMutation, Sign_InMutationVariables>;

/**
 * __useSign_InMutation__
 *
 * To run a mutation, you first call `useSign_InMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSign_InMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSign_InMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSign_InMutation(baseOptions?: Apollo.MutationHookOptions<Sign_InMutation, Sign_InMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Sign_InMutation, Sign_InMutationVariables>(Sign_InDocument, options);
      }
export type Sign_InMutationHookResult = ReturnType<typeof useSign_InMutation>;
export type Sign_InMutationResult = Apollo.MutationResult<Sign_InMutation>;
export type Sign_InMutationOptions = Apollo.BaseMutationOptions<Sign_InMutation, Sign_InMutationVariables>;
export const Sign_OutDocument = gql`
    mutation SIGN_OUT {
  signOut {
    message
  }
}
    `;
export type Sign_OutMutationFn = Apollo.MutationFunction<Sign_OutMutation, Sign_OutMutationVariables>;

/**
 * __useSign_OutMutation__
 *
 * To run a mutation, you first call `useSign_OutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSign_OutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signOutMutation, { data, loading, error }] = useSign_OutMutation({
 *   variables: {
 *   },
 * });
 */
export function useSign_OutMutation(baseOptions?: Apollo.MutationHookOptions<Sign_OutMutation, Sign_OutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Sign_OutMutation, Sign_OutMutationVariables>(Sign_OutDocument, options);
      }
export type Sign_OutMutationHookResult = ReturnType<typeof useSign_OutMutation>;
export type Sign_OutMutationResult = Apollo.MutationResult<Sign_OutMutation>;
export type Sign_OutMutationOptions = Apollo.BaseMutationOptions<Sign_OutMutation, Sign_OutMutationVariables>;
export const Request_Reset_PasswordDocument = gql`
    mutation REQUEST_RESET_PASSWORD($email: String!) {
  requestResetPassword(email: $email) {
    message
  }
}
    `;
export type Request_Reset_PasswordMutationFn = Apollo.MutationFunction<Request_Reset_PasswordMutation, Request_Reset_PasswordMutationVariables>;

/**
 * __useRequest_Reset_PasswordMutation__
 *
 * To run a mutation, you first call `useRequest_Reset_PasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequest_Reset_PasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestResetPasswordMutation, { data, loading, error }] = useRequest_Reset_PasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useRequest_Reset_PasswordMutation(baseOptions?: Apollo.MutationHookOptions<Request_Reset_PasswordMutation, Request_Reset_PasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Request_Reset_PasswordMutation, Request_Reset_PasswordMutationVariables>(Request_Reset_PasswordDocument, options);
      }
export type Request_Reset_PasswordMutationHookResult = ReturnType<typeof useRequest_Reset_PasswordMutation>;
export type Request_Reset_PasswordMutationResult = Apollo.MutationResult<Request_Reset_PasswordMutation>;
export type Request_Reset_PasswordMutationOptions = Apollo.BaseMutationOptions<Request_Reset_PasswordMutation, Request_Reset_PasswordMutationVariables>;
export const Reset_PasswordDocument = gql`
    mutation RESET_PASSWORD($token: String!, $password: String!) {
  resetPassword(token: $token, password: $password) {
    message
  }
}
    `;
export type Reset_PasswordMutationFn = Apollo.MutationFunction<Reset_PasswordMutation, Reset_PasswordMutationVariables>;

/**
 * __useReset_PasswordMutation__
 *
 * To run a mutation, you first call `useReset_PasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReset_PasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useReset_PasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useReset_PasswordMutation(baseOptions?: Apollo.MutationHookOptions<Reset_PasswordMutation, Reset_PasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<Reset_PasswordMutation, Reset_PasswordMutationVariables>(Reset_PasswordDocument, options);
      }
export type Reset_PasswordMutationHookResult = ReturnType<typeof useReset_PasswordMutation>;
export type Reset_PasswordMutationResult = Apollo.MutationResult<Reset_PasswordMutation>;
export type Reset_PasswordMutationOptions = Apollo.BaseMutationOptions<Reset_PasswordMutation, Reset_PasswordMutationVariables>;
export const MeDocument = gql`
    query ME {
  me {
    id
    username
    email
    roles
    createdAt
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;