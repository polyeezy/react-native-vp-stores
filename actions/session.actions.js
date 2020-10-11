import auth from '@react-native-firebase/auth';
// import Config from '../../_config';
import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
} from '@invertase/react-native-apple-authentication';
import {firebase} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';

import sessionTypes from '../types/';

const config = {
  allowAnonymous: true,
  providers: ['google', 'apple', 'mail'],
  google: {
    webClientId:
      '748017831786-bvosvd2engjhuhgg7ka9fdg6ievt9aee.apps.googleusercontent.com',
  },
};

const {
  SESSION_INIT,
  SESSION_INIT_SUCCESS,
  SESSION_STATUT_UPDATE,
  SESSION_AUTH_CHANGE,
  SESSION_LOGIN_CANCELED,
  SESSION_REGISTER_LOADING,
  SESSION_SIGNOUT_LOADING,
  SESSION_SIGNOUT_SUCCESS,
  SESSION_SIGNOUT_FAILURE,
  SESSION_LOGIN_FAILURE,
  SESSION_LOGIN_SUCCESS,
  SESSION_LOGIN_LOADING,
  AUTH_WRONG_PASSWORD,
  AUTH_OPERATION_NOTALLOWED,
  AUTH_USER_NOTFOUND,
  AUTH_EMAIL_INVALID,
  AUTH_PASSWORD_INVALID,
  AUTH_PASSWORD_WEAK,
  AUTH_EMAIL_ALREADYUSED,
  PROVIDER_GOOGLE,
  PROVIDER_EMAIL,
  PROVIDER_ANONYMOUS,
  PROVIDER_ICLOUD,
  STATUS_AUTH_CANCELED,
  STATUS_USER_FOUND,
  STATUS_USER_NOTFOUND,
} = sessionTypes;

const onAuthError = (error, provider) => async (dispatch) => {
  try {
    switch (error.code) {
      case 'auth/wrong-password': {
        throw AUTH_WRONG_PASSWORD;
      }
      case 'auth/operation-not-allowed': {
        throw AUTH_OPERATION_NOTALLOWED;
      }
      case 'auth/user-not-found': {
        throw AUTH_USER_NOTFOUND;
      }
      case 'auth/invalid-email': {
        throw AUTH_EMAIL_INVALID;
      }
      case 'auth/invalid-password': {
        throw AUTH_PASSWORD_INVALID;
      }
      case 'auth/weak-password': {
        throw AUTH_PASSWORD_WEAK;
      }
      case '1001':
      case '-5': {
        dispatch(sessionLoginCanceled(provider));
        break;
      }
      case 'auth/email-already-in-use': {
        throw AUTH_EMAIL_ALREADYUSED;
      }
      default: {
        throw error.message;
      }
    }
  } catch (err) {
    dispatch(sessionLoginFailure(err, provider));
  }
};

const sessionRegisterLoading = (provider) => ({
  type: SESSION_REGISTER_LOADING,
  provider,
});

const sessionLoginFailure = (error, provider) => ({
  status: error,
  type: SESSION_LOGIN_FAILURE,
  provider,
});

const sessionLoginSuccess = (provider) => ({
  type: SESSION_LOGIN_SUCCESS,
  provider,
});

const sessionLoginLoading = (provider) => ({
  type: SESSION_LOGIN_LOADING,
  provider,
});

const sessionSignOutLoading = () => ({
  type: SESSION_SIGNOUT_LOADING,
});

const sessionInit = (msg) => ({
  type: SESSION_INIT,
  loading: true,
  status: 'Initialing session',
});

const sessionLoginCanceled = (provider) => ({
  type: SESSION_LOGIN_CANCELED,
  loading: true,
  provider,
  status: STATUS_AUTH_CANCELED,
});

const sessionInitSuccess = (msg) => ({
  type: SESSION_INIT_SUCCESS,
  loading: true,
  status: 'Initialing session OK',
});

const sessionStatusUpdate = (msg, data = {}) => ({
  type: SESSION_STATUT_UPDATE,
  status: msg,
  data,
});

const sessionAuthChange = (session) => ({
  type: SESSION_AUTH_CHANGE,
  status: session ? STATUS_USER_FOUND : STATUS_USER_NOTFOUND,
  session: session,
});

const sessionSignOutSuccess = () => ({
  type: SESSION_SIGNOUT_SUCCESS,
});

const sessionSignOutFailure = () => ({
  type: SESSION_SIGNOUT_FAILURE,
});

export const SessionIsUserLogged = (store) => async (dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(store.user !== null);
    } catch (err) {
      reject(err);
    }
  });
};

export const SessionRegisterEmail = (email, password) => async (dispatch) => {
  const provider = PROVIDER_EMAIL;
  return new Promise((resolve, reject) => {
    dispatch(sessionRegisterLoading(provider));

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        dispatch(onAuthError(error, provider));
        reject(new Error(`${error} - provider : ${provider}`));
      });
  });
};

export const SessionLoginEmail = (email, password) => async (dispatch) => {
  const provider = PROVIDER_EMAIL;
  dispatch(sessionLoginLoading(provider));
  return new Promise((resolve, reject) => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        dispatch(onAuthError(error, provider));
        reject(new Error(`${error} - provider : ${provider}`));
      });
  });
};

export const SessionAuthGoogle = () => async (dispatch) => {
  const provider = PROVIDER_GOOGLE;

  return new Promise((resolve, reject) => {
    try {
      dispatch(sessionLoginLoading(provider));
      GoogleSignin.signIn()
        .catch((error) => {
          dispatch(onAuthError(error, provider));
          reject(new Error(`${error} - provider : ${provider}`));
        })
        .then((credentials) => {
          if (credentials) {
            const googleCredential = auth.GoogleAuthProvider.credential(
              credentials.idToken,
            );
            auth()
              .signInWithCredential(googleCredential)
              .catch((error) => {
                dispatch(onAuthError(error, provider));
                reject(new Error(`${error} - provider : ${provider}`));
              })
              .then(() => {
                dispatch(sessionLoginSuccess(provider));
                resolve();
              })
              .catch((error) => {
                dispatch(onAuthError(error, provider));
                reject(new Error(`${error} - provider : ${provider}`));
              });
          }
        })
        .catch((error) => {
          dispatch(onAuthError(error, provider));
          reject(new Error(`${error} - provider : ${provider}`));
        });
    } catch (error) {
      dispatch(onAuthError(error, provider));
      reject(new Error(`${error} - provider : ${provider}`));
    }
  });
};

export const SessionAuthApple = (uid) => async (dispatch) => {
  const provider = PROVIDER_ICLOUD;
  return new Promise((resolve, reject) => {
    dispatch(sessionLoginLoading(provider));
    try {
      // 1). start a apple sign-in request
      appleAuth
        .performRequest({
          requestedOperation: AppleAuthRequestOperation.LOGIN,
          requestedScopes: [
            AppleAuthRequestScope.EMAIL,
            AppleAuthRequestScope.FULL_NAME,
          ],
        })
        .then((appleAuthRequestResponse) => {
          const {identityToken, nonce} = appleAuthRequestResponse;
          if (identityToken) {
            const appleCredential = firebase.auth.AppleAuthProvider.credential(
              identityToken,
              nonce,
            );

            firebase
              .auth()
              .signInWithCredential(appleCredential)
              .then((userCredential) => {
                dispatch(sessionLoginSuccess(provider));
                resolve();
              })
              .catch((err) => {
                dispatch(onAuthError(err, provider));
                reject(new Error(`${err} - provider : ${provider}`));
              });
          }
        })
        .catch((err) => {
          dispatch(onAuthError(err, provider));
          reject();
        });
    } catch (err) {
      dispatch(onAuthError(err, provider));
      reject();
    }
  });
};

const addAuthSubscriber = (params) => {
  return new Promise((resolve, reject) => {
    try {
      auth().onAuthStateChanged((session) => {
        if (session) {
          const {_user} = session;
          params.dispatch(sessionAuthChange(_user));
        }
      });
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

const FireBaseAnonymousLogin = (params) => {
  return new Promise((resolve, reject) => {
    try {
      auth().signInAnonymously().catch(reject).then(resolve);
    } catch (err) {
      reject(err);
    }
  });
};

export const SessionLoginAnonymously = () => async (dispatch) => {
  const provider = PROVIDER_ANONYMOUS;
  dispatch(sessionLoginLoading(provider));

  return new Promise((resolve, reject) => {
    try {
      FireBaseAnonymousLogin()
        .then((session) => {
          sessionLoginSuccess(provider);
          resolve(session);
        })
        .catch((err) => {
          dispatch(sessionLoginFailure(err.message, provider));
          reject(err);
        });
    } catch (error) {
      dispatch(sessionLoginFailure(error.message, provider));
      reject(error);
    }
  });
};

export const SessionSignOut = () => async (dispatch) => {
  dispatch(sessionSignOutLoading());

  return new Promise((resolve, reject) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(sessionSignOutSuccess());
        resolve();
      })
      .catch((err) => {
        dispatch(sessionSignOutFailure());
        reject(err);
      });
  });
};

export const SessionConfigure = (configuration = config) => async (
  dispatch,
) => {
  if (config.providers.includes(PROVIDER_GOOGLE)) {
    GoogleSignin.configure({
      webClientId: config.authentification.google.webClientId,
    });
  }

  dispatch(sessionInit());
  return new Promise((resolve, reject) => {
    const params = {dispatch, FireBaseAnonymousLogin};

    addAuthSubscriber(params)
      .then(() => {
        dispatch(sessionInitSuccess());
        resolve();
      })
      .catch((err) => {
        dispatch(sessionStatusUpdate(err.message));
        reject();
      });
  });
};
