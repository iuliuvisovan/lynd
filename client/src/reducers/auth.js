import jwtDecode from "jwt-decode";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  SEND_SMS_REQUEST,
  SEND_SMS_SUCCESS,
  SEND_SMS_ERROR,
  LOGOUT,
  TEST_SMS_REQUEST,
  TEST_SMS_SUCCESS,
  TEST_SMS_FINALIZED,
  TEST_SMS_ERROR
} from "../actions/auth";

const token = localStorage.getItem("token");
const user = token && jwtDecode(token).user;

const initialState = {
  ...(token && { token }),
  ...(user && { user })
};

export default (state = initialState, action) => {
  switch (action.type) {
    //requests
    case SEND_SMS_REQUEST:
      return { ...state, sendingSms: true };
    case TEST_SMS_REQUEST:
      return { ...state, testingSms: true };
    case SIGNUP_REQUEST:
    case LOGIN_REQUEST:
      return { ...state, loading: true };

    //succeses
    case SEND_SMS_SUCCESS:
      return {
        ...state,
        hasSentSms: true,
        sendingSms: false
      };
    case TEST_SMS_SUCCESS:
      return {
        ...state,
        hasTestedSms: true,
        isCodeValid: action.isCodeValid
      };
    case TEST_SMS_FINALIZED:
      return {
        ...state,
        isSmsCheckFinalized: true
      };
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
      const user = jwtDecode(action.token).user;
      return {
        ...state,
        loading: false,
        token: action.token,
        user
      };

    //errors
    case SEND_SMS_ERROR:
      return { ...state, sendingSms: false };
    case TEST_SMS_ERROR:
    case SIGNUP_ERROR:
    case LOGIN_ERROR:
      return { ...state, loading: false };

    case LOGOUT:
      return { ...state, token: null, user: null };

    default:
      return state;
  }
};
