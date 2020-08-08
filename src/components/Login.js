import React, { useState, useCallback } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'urql';
import { setToken } from '../token';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const Login = (props) => {
  const [isLogin, SetIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [state, executeMutation] = useMutation(
    isLogin ? LOGIN_MUTATION : SIGNUP_MUTATION,
  );

  const mutate = useCallback(() => {
    executeMutation({ email, password, name })
      .then(({ data }) => {
        const token = data && data[isLogin ? 'login' : 'signup'].token;
        if (token) {
          setToken(token);
          props.history.push('/');
        }
      })
      .catch((e) => console.log(e.message));
  }, [executeMutation, props.history, isLogin, email, password, name]);

  return (
    <div>
      <h4 className="mv3">{isLogin ? 'Login' : 'SignUp'}</h4>
      <div className="flex flex-column">
        {!isLogin && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Your email address"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <button
          type="button"
          className="pointer mr2 button"
          disabled={state.fetching}
          onClick={mutate}
        >
          {isLogin ? 'Login' : 'Create Account'}
        </button>
        <button
          type="button"
          className="pointer button"
          onClick={() => SetIsLogin(!isLogin)}
          disabled={state.fetching}
        >
          {isLogin ? 'Need to create an account?' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
};

export default Login;
