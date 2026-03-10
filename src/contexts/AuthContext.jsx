import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const AuthActionTypes = {
  USER_LOADED: 'USER_LOADED',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_ERROR: 'AUTH_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  SET_LOADING: 'SET_LOADING'
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case AuthActionTypes.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        error: null
      };
    case AuthActionTypes.AUTH_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case AuthActionTypes.AUTH_ERROR:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case AuthActionTypes.LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    case AuthActionTypes.CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await authAPI.getProfile();
          dispatch({
            type: AuthActionTypes.USER_LOADED,
            payload: response.data.user
          });
        } catch (error) {
          dispatch({
            type: AuthActionTypes.AUTH_ERROR,
            payload: error.message
          });
        }
      } else {
        dispatch({
          type: AuthActionTypes.SET_LOADING,
          payload: false
        });
      }
    };

    loadUser();
  }, []);

  // Auth actions
  const login = async (credentials) => {
    try {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
      const response = await authAPI.login(credentials);
      dispatch({
        type: AuthActionTypes.AUTH_SUCCESS,
        payload: response
      });
      return response;
    } catch (error) {
      dispatch({
        type: AuthActionTypes.AUTH_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
      const response = await authAPI.register(userData);
      dispatch({
        type: AuthActionTypes.AUTH_SUCCESS,
        payload: response
      });
      return response;
    } catch (error) {
      dispatch({
        type: AuthActionTypes.AUTH_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    dispatch({ type: AuthActionTypes.LOGOUT });
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      dispatch({
        type: AuthActionTypes.USER_LOADED,
        payload: response.data
      });
      return response;
    } catch (error) {
      dispatch({
        type: AuthActionTypes.AUTH_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  const clearErrors = () => {
    dispatch({ type: AuthActionTypes.CLEAR_ERRORS });
  };

  // Role utility functions
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const isLawyer = () => hasRole('lawyer');
  const isAdmin = () => hasRole('admin');
  const isUser = () => hasRole('user');

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearErrors,
    hasRole,
    isLawyer,
    isAdmin,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;