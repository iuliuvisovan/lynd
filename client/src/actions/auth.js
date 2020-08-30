import { login, signup, sendSms } from "../util/api";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR";

const loginRequest = { type: LOGIN_REQUEST };
const loginSuccess = token => ({ type: LOGIN_SUCCESS, token });
const loginError = error => ({ type: LOGIN_ERROR, error });

export const attemptLogin = (username, password) => async dispatch => {
  dispatch(loginRequest);
  try {
    const token = await login(username, password);
    dispatch(loginSuccess(token));
  } catch (error) {
    dispatch(loginError(error));
  }
};

export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_ERROR = "SIGNUP_ERROR";

const signupRequest = { type: SIGNUP_REQUEST };
const signupSuccess = token => ({ type: SIGNUP_SUCCESS, token });
const signupError = error => ({ type: SIGNUP_ERROR, error });

export const attemptSignup = (username, password) => async dispatch => {
  dispatch(signupRequest);
  try {
    const token = await signup(username, password);
    dispatch(signupSuccess(token));
  } catch (error) {
    dispatch(signupError(error));
  }
};


export const SEND_SMS_REQUEST = "SEND_SMS_REQUEST";
export const SEND_SMS_SUCCESS = "SEND_SMS_SUCCESS";
export const SEND_SMS_ERROR = "SEND_SMS_ERROR";

const sendSmsRequest = () => ({ type: SEND_SMS_REQUEST });
const sendSmsSuccess = () => ({ type: SEND_SMS_SUCCESS });
const sendSmsError = error => ({ type: SEND_SMS_ERROR, error });


export const requestSendSms = phoneNumber => async dispatch => {
  dispatch(sendSmsRequest);
  try {
    const hasSentCode = await sendSms(phoneNumber);
    if (hasSentCode) {
      dispatch(sendSmsSuccess());
    } else {
      dispatch(sendSmsError({}));
    }
  } catch (error) {
    dispatch(sendSmsError(error));
  }
};

export const LOGOUT = "LOGOUT";
export const logout = () => ({ type: LOGOUT });
