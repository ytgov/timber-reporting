import * as React from 'react';
import { useEffect } from 'react';
import { checkToken } from 'services/AuthenticationService';

interface IAuthState {
  type: AuthState;
  expiringSoon?: boolean;
}

export interface AuthStateWithDispatch {
  state: IAuthState;
  dispatch: React.Dispatch<AuthAction>;
}

export const AUTH_STATE_LOADING = 'AUTH_STATE_LOADING';
export const AUTH_STATE_SIGNED_OUT = 'AUTH_STATE_SIGNED_OUT';
export const AUTH_STATE_SIGNED_IN = 'AUTH_STATE_SIGNED_IN';
export const AUTH_STATE_EMAIL_UNVERIFIED = 'AUTH_STATE_EMAIL_UNVERIFIED';
export const AUTH_STATE_NO_ACCT_FOUND = 'AUTH_STATE_NO_ACCT_FOUND';

export type AuthState =
  | 'AUTH_STATE_LOADING'
  | 'AUTH_STATE_SIGNED_OUT'
  | 'AUTH_STATE_SIGNED_IN'
  | 'AUTH_STATE_EMAIL_UNVERIFIED'
  | 'AUTH_STATE_NO_ACCT_FOUND';

export const AUTH_ACTION_LOADING = 'AUTH_ACTION_LOADING';
export const AUTH_ACTION_SIGN_OUT = 'AUTH_ACTION_SIGN_OUT';
export const AUTH_ACTION_SIGN_IN = 'AUTH_ACTION_SIGN_IN';
export const AUTH_ACTION_EMAIL_UNVERIFIED = 'AUTH_ACTION_EMAIL_UNVERIFIED';
export const AUTH_ACTION_NO_ACCT_FOUND = 'AUTH_ACTION_NO_ACCT_FOUND';

export type AuthAction =
  | 'AUTH_ACTION_LOADING'
  | 'AUTH_ACTION_SIGN_IN'
  | 'AUTH_ACTION_SIGN_OUT'
  | 'AUTH_ACTION_EMAIL_UNVERIFIED'
  | 'AUTH_ACTION_NO_ACCT_FOUND';

export const AuthContext = React.createContext<AuthStateWithDispatch>({
  state: { type: AUTH_STATE_LOADING },
  dispatch: () => ({}),
});

const authReducer: React.Reducer<IAuthState, AuthAction> = (state: IAuthState, action: AuthAction) => {
  switch (action) {
    case AUTH_ACTION_LOADING:
      return { type: AUTH_STATE_LOADING };
    case AUTH_ACTION_SIGN_IN:
      return { type: AUTH_STATE_SIGNED_IN, expiringSoon: false };
    case AUTH_ACTION_SIGN_OUT:
      return { type: AUTH_STATE_SIGNED_OUT };
    case AUTH_ACTION_EMAIL_UNVERIFIED:
      return { type: AUTH_STATE_EMAIL_UNVERIFIED };
    case AUTH_ACTION_NO_ACCT_FOUND:
      return { type: AUTH_STATE_NO_ACCT_FOUND };
    default:
      return state;
  }
};

export const AuthProvider: React.FC = (props) => {
  const [state, dispatch] = React.useReducer(authReducer, {
    type: AUTH_STATE_LOADING,
  });

  useEffect(() => {
    const check = async () => {
      const result = await checkToken();
      if (result === 'OK') {
        dispatch(AUTH_ACTION_SIGN_IN);
      } else if (result === 'Email_Unverified') {
        dispatch(AUTH_ACTION_EMAIL_UNVERIFIED);
      } else if (result === 'No_Acct_Found') {
        dispatch(AUTH_ACTION_NO_ACCT_FOUND);
      } else {
        dispatch(AUTH_ACTION_SIGN_OUT);
      }
    };
    check();
  }, []);

  const value: AuthStateWithDispatch = { state, dispatch };
  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};
