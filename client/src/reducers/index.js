import { combineReducers } from "redux";

import signupReducer from "./signup";
import loginReducer from "./login";
import verifyOtpReducer from "./verifyOtp";
import sendOtpReducer from "./sendOtp";
import resendOtpReducer from "./resendOtp";

import updatePasswordReducer from "./updatePassword";
import todoReducer from "./todos";
import allToDosReducer from "./allToDos";

const rootReducer = combineReducers({
  signupReducer,
  loginReducer,
  verifyOtpReducer,
  sendOtpReducer,
  resendOtpReducer,
  updatePasswordReducer,
  todoReducer,
  allToDosReducer,
});

export default rootReducer;
