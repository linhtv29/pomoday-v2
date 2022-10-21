import * as React from 'react';
import { StateContext } from './App';
import { KEY_ESC } from '../helpers/utils';
import { authenticateUser, registerUser } from '../helpers/api';
import { useEventListener } from '../helpers/hooks';

enum UIAuthState {
  WAIT,
  LOADING,
}

export const AuthDialog = props => {
  const [state, setState] = React.useContext(StateContext);
  const [uiState, setUIState] = React.useState({
    status: UIAuthState.WAIT,
    errorMessage: '',
    successMessage: '',
  });
  const usernameRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const rePasswordRef = React.useRef(null);

  React.useEffect(() => {
    if (usernameRef && usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const doRegister = () => {
    const username =
      usernameRef && usernameRef.current && usernameRef.current.value;
    const password =
      passwordRef && passwordRef.current && passwordRef.current.value;
    const rePassword =
      rePasswordRef && rePasswordRef.current && rePasswordRef.current.value;
    if (username && password && rePassword) {
      if (password !== rePassword) {
        setUIState({
          status: UIAuthState.WAIT,
          errorMessage: "Password don't match!",
          successMessage: '',
        });
        return;
      }
      setUIState({
        status: UIAuthState.LOADING,
        errorMessage: '',
        successMessage: '',
      });
      registerUser(username, password)
        .then(() => {
          setState({
            ...state,
            userWantToRegister: false,
          });
          setUIState({
            status: UIAuthState.WAIT,
            errorMessage: '',
            successMessage: 'Register completed, please login!',
          });
        })
        .catch(() => {
          setUIState({
            status: UIAuthState.WAIT,
            errorMessage:
              'Failed to register. Please check your username, password, then try again.',
            successMessage: '',
          });
        });
    } else {
      setUIState({
        status: UIAuthState.WAIT,
        errorMessage: 'Please fill out all the information above.',
        successMessage: '',
      });
    }
  };

  const doLogin = () => {
    const username =
      usernameRef && usernameRef.current && usernameRef.current.value;
    const password =
      passwordRef && passwordRef.current && passwordRef.current.value;
    if (username && password) {
      setUIState({
        status: UIAuthState.LOADING,
        errorMessage: '',
        successMessage: '',
      });
      authenticateUser(username, password)
        .then(res => {
          const { authToken } = res;
          setState({
            ...state,
            authToken,
            userName: username,
            userWantToLogin: false,
          });
        })
        .catch(() => {
          setUIState({
            status: UIAuthState.WAIT,
            errorMessage:
              'Failed to login. Please check your username, password and server, then try again.',
            successMessage: '',
          });
        });
    } else {
      setUIState({
        status: UIAuthState.WAIT,
        errorMessage: 'Please fill out all the information above.',
        successMessage: '',
      });
    }
  };

  const closeDialog = () => {
    setState({
      ...state,
      userWantToLogin: false,
      userWantToRegister: false,
    });
  };

  const processKey = e => {
    if (e.keyCode === KEY_ESC) {
      closeDialog();
    }
  };

  useEventListener('keyup', processKey);

  return (
    <div className="bg-white p-5 text-left absolute top-0 left-0 right-0 bottom-0">
      <div className={'block sm:hidden fixed bottom-0 right-0 m-5 z-50'}>
        <button
          onClick={closeDialog}
          className={
            'sm:hidden text-3xl bg-tomato text-white rounded-full shadow-lg w-16 h-16'
          }>
          ✕
        </button>
      </div>
      {uiState.status === UIAuthState.WAIT ? (
        <>
          <div className={'p-3'}>
            Please enter your username as password here:
          </div>
          <div className={'p-3 inline-block'}>
            <div className={'my-2 flex flex-row'}>
              <span className={'w-5/12'}>Username:</span>
              <input
                tabIndex={1}
                ref={usernameRef}
                className={'border border-stall-dim flex-1 ml-2'}
                type={'text'}
              />
            </div>
            <div className={'my-2 flex flex-row'}>
              <span className={'w-5/12'}>Password:</span>
              <input
                tabIndex={2}
                ref={passwordRef}
                className={'border border-stall-dim flex-1 ml-2'}
                type={'password'}
              />
            </div>
            {state.userWantToRegister ? (
              <div className={'my-2 flex flex-row'}>
                <span className={'w-5/12'}>Re-password:</span>
                <input
                  tabIndex={3}
                  ref={rePasswordRef}
                  className={'border border-stall-dim flex-1 ml-2'}
                  type={'password'}
                />
              </div>
            ) : null}
            <div className={'my-2 float-right'}>
              {state.userWantToRegister ? (
                <button
                  tabIndex={4}
                  onClick={doRegister}
                  className={
                    'px-5 py-1 bg-green text-white focus:opacity-75 hover:opacity-75'
                  }>
                  Register
                </button>
              ) : (
                <button
                  tabIndex={4}
                  onClick={doLogin}
                  className={
                    'px-5 py-1 bg-green text-white focus:opacity-75 hover:opacity-75'
                  }>
                  Login
                </button>
              )}
            </div>
          </div>
          {uiState.errorMessage ? (
            <div className={'p-3 text-tomato'}>{uiState.errorMessage}</div>
          ) : uiState.successMessage ? (
            <div className={'p-3 text-green'}>{uiState.successMessage}</div>
          ) : null}
          <div className={'p-3'}>
            {state.userWantToRegister
              ? ''
              : 'After login, your data will be automatically synced to the server.'}
            <br />
            Press <code>ESC</code> key to cancel and close this dialog.
          </div>
        </>
      ) : null}
      {uiState.status === UIAuthState.LOADING ? (
        <div className={'p-3'}>Connecting to server...</div>
      ) : null}
    </div>
  );
};
