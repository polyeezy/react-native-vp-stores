import {sessionTypes} from '../types/';

const {
  SESSION_INIT,
  SESSION_STATUT_UPDATE,
  SESSION_ERROR,
  SESSION_AUTH_CHANGE,
  SESSION_LOGIN_LOADING,
  SESSION_LOGIN_CANCELED,
  SESSION_REGISTER_LOADING,
  SESSION_LOGIN_ANONYMOUS_SUCCESS,
  SESSION_LOGIN_ANONYMOUS_FAILURE,
  SESSION_LOGIN_FAILURE,
  SESSION_GET_USER_POSTS,
  SESSION_GET_USER_POSTS_SUCCESS,
  SESSION_GET_USER_POSTS_FAILURE,
  SESSION_ADMIN_UPDATE,
  SESSION_GET_USER_DATA_SUCCESS,
  SESSION_LOGIN_APPLE_LOADING,
  SESSION_LOGIN_APPLE_SUCCESS,
  SESSION_LOGIN_APPLE_FAILURE,
  SESSION_SIGNOUT_LOADING,
  SESSION_SIGNOUT_SUCCESS,
  SESSION_SIGNOUT_FAILURE,
  SESSION_LOGIN_ANONYMOUS_LOADING,
  SESSION_INIT_SUCCESS,
} = sessionTypes;

import {reducerModel} from './_model.reducer';

const initialState = {
  ...reducerModel,
  isAnonymous: false,
  isAdmin: false,
  user: null,
  status: 'Null',
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SESSION_INIT: {
      return {...state, loading: true, status: action.status};
    }
    case SESSION_REGISTER_LOADING: {
      return {...state, loading: true, error: false, status: action.status};
    }
    case SESSION_LOGIN_LOADING: {
      return {...state, loading: true, error: false, status: action.status};
    }
    case SESSION_LOGIN_FAILURE: {
      return {...state, loading: false, error: true, status: action.status};
    }
    case SESSION_INIT_SUCCESS: {
      return {...state, loading: false, error: false, status: action.status};
    }
    case SESSION_STATUT_UPDATE: {
      return {...state, status: action.status};
    }
    case SESSION_ERROR: {
      return {...state, error: true, status: action.status};
    }

    case SESSION_LOGIN_ANONYMOUS_SUCCESS: {
      return {
        ...state,
        error: false,
        user: action.session,
        loading: false,
        anonymous: true,
        status: action.status,
      };
    }
    case SESSION_LOGIN_ANONYMOUS_FAILURE: {
      return {
        ...state,
        error: true,
        user: null,
        loading: false,
        anonymous: true,
        status: action.status,
      };
    }

    case SESSION_ADMIN_UPDATE: {
      return {
        ...state,
        isAdmin: action.isAdmin,
      };
    }
    case SESSION_SIGNOUT_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case SESSION_SIGNOUT_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: false,
        user: null,
      };
    }
    case SESSION_SIGNOUT_FAILURE: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }
    case SESSION_GET_USER_DATA_SUCCESS: {
      return {
        ...state,
        data: action.userData,
        loading: false,
      };
    }
    case SESSION_LOGIN_ANONYMOUS_LOADING: {
      return {
        ...state,
        status: action.status,
      };
    }
    case SESSION_LOGIN_APPLE_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case SESSION_LOGIN_CANCELED: {
      return {
        ...state,
        loading: false,
      };
    }
    case SESSION_LOGIN_APPLE_SUCCESS: {
      return {
        ...state,
        loading: false,
        user: action.user.user,
      };
    }
    case SESSION_LOGIN_APPLE_FAILURE: {
      return {
        ...state,
        loading: false,
        error: true,
        status: action.status,
      };
    }
    case SESSION_AUTH_CHANGE: {
      return {
        ...state,
        error: false,
        loading: false,
        user: action.session,
        status: action.status,
      };
    }
    case SESSION_GET_USER_POSTS: {
      return {
        ...state,
        posts: {
          ...state.posts,
          status: action.status,
          error: false,
          loading: true,
        },
      };
    }
    case SESSION_GET_USER_POSTS_SUCCESS: {
      return {
        ...state,
        posts: {
          ...state.posts,
          loading: false,
          status: action.status,
          error: false,
          data: action.posts,
        },
      };
    }
    case SESSION_GET_USER_POSTS_FAILURE: {
      return {
        ...state,
        posts: {
          ...state.posts,
          status: action.status,
          loading: false,
          error: true,
          data: action.posts,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export default sessionReducer;
