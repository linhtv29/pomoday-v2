import * as React from 'react';
import { StateContext } from './App';
import { KEY_ESC } from '../helpers/utils';
import { useEventListener } from '../helpers/hooks';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../helpers/firebaseConfig';

enum UIAuthState {
  WAIT,
  LOADING,
}

export const AuthDialog = props => {
  const [state, setState] = React.useContext(StateContext);
  const [uiState, setUIState] = React.useState({
    status: UIAuthState.WAIT,
    errorMessage: '',
  });
  const usernameRef = React.useRef(null);
  const passwordRef = React.useRef(null);

  React.useEffect(() => {
    if (usernameRef && usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const doLogin = () => {
    const username =
      usernameRef && usernameRef.current && usernameRef.current.value;
    const password =
      passwordRef && passwordRef.current && passwordRef.current.value;
    if (username && password) {
      setUIState({
        status: UIAuthState.LOADING,
        errorMessage: '',
      });
      signInWithEmailAndPassword(auth, username, password)
        .then(auth => {
          const user = auth.user;
          console.log(user);
          setState({
            ...state,
            authToken: user.accessToken,
            userName: username,
            userWantToLogin: false,
          });
        })
        .catch(err => {
          setUIState({
            status: UIAuthState.WAIT,
            errorMessage:
              'Failed to login. Please check your username, password and server, then try again.',
          });
        });
    } else {
      setUIState({
        status: UIAuthState.WAIT,
        errorMessage: 'Please fill out all the information above.',
      });
    }
  };

  const closeDialog = () => {
    setState({
      ...state,
      userWantToLogin: false,
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
              <span className={'w-4/12'}>Email:</span>
              <input
                tabIndex={1}
                ref={usernameRef}
                className={'border border-stall-dim flex-1 ml-2'}
                type={'text'}
              />
            </div>
            <div className={'my-2 flex flex-row'}>
              <span className={'w-4/12'}>Password:</span>
              <input
                tabIndex={2}
                ref={passwordRef}
                className={'border border-stall-dim flex-1 ml-2'}
                type={'password'}
              />
            </div>
            <div className={'my-2 float-right'}>
              <button
                tabIndex={4}
                onClick={doLogin}
                className={
                  'px-5 py-1 bg-green text-white focus:opacity-75 hover:opacity-75'
                }>
                Login
              </button>
            </div>
          </div>
          <div className={'p-3 text-tomato'}>{uiState.errorMessage}</div>
          <div className={'p-3'}>
            After login, your data will be automatically synced to the server.
            <br />
            Press <code>ESC</code> key to cancel login and close this dialog.
          </div>
        </>
      ) : null}
      {uiState.status === UIAuthState.LOADING ? (
        <div className={'p-3'}>Connecting to server...</div>
      ) : null}
    </div>
  );
};
