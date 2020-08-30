import { login, signup, requestSmsCode, testSmsCode } from "../util/api";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR";

// # sms request

export const SEND_SMS_REQUEST = "SEND_SMS_REQUEST";
export const SEND_SMS_SUCCESS = "SEND_SMS_SUCCESS";
export const SEND_SMS_ERROR = "SEND_SMS_ERROR";

export const sendSms = phoneNumber => async dispatch => {
  dispatch({ type: SEND_SMS_REQUEST });

  try {
    const hasSentCode = await requestSmsCode(phoneNumber);
    if (hasSentCode) {
      dispatch({ type: SEND_SMS_SUCCESS });
    } else {
      dispatch({ type: SEND_SMS_ERROR });
    }
  } catch (error) {
    dispatch({ type: SEND_SMS_ERROR, error });
  }
};

// # sms code test

export const TEST_SMS_REQUEST = "TEST_SMS_REQUEST";
export const TEST_SMS_SUCCESS = "TEST_SMS_SUCCESS";
export const TEST_SMS_ERROR = "TEST_SMS_ERROR";
export const TEST_SMS_FINALIZED = "TEST_SMS_FINALIZED";

export const testSms = (phoneNumber, smsCode) => async dispatch => {
  dispatch({ type: TEST_SMS_REQUEST });

  try {
    const isCodeValid = await testSmsCode(phoneNumber, smsCode);

    dispatch({ type: TEST_SMS_SUCCESS, isCodeValid });

    if (isCodeValid) {
      setTimeout(() => {
        dispatch({ type: TEST_SMS_FINALIZED });
      }, 1000);
    }
  } catch (error) {
    dispatch({ type: TEST_SMS_ERROR, error });
  }
};

// #signup

export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_ERROR = "SIGNUP_ERROR";

const signupSuccess = token => ({ type: SIGNUP_SUCCESS, token });
const signupError = error => ({ type: SIGNUP_ERROR, error });

export const attemptSignup = (username, password) => async dispatch => {
  dispatch({ type: SIGNUP_REQUEST });
  try {
    const token = await signup(username, password);
    dispatch(signupSuccess(token));
  } catch (error) {
    dispatch(signupError(error));
  }
};

// #login

const loginSuccess = token => ({ type: LOGIN_SUCCESS, token });
const loginError = error => ({ type: LOGIN_ERROR, error });

export const attemptLogin = (username, password) => async dispatch => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const token = await login(username, password);
    dispatch(loginSuccess(token));
  } catch (error) {
    dispatch(loginError(error));
  }
};

export const LOGOUT = "LOGOUT";
export const logout = () => ({ type: LOGOUT });
