const InfoMessages = {
  AUTH: {
    REGISTER_SUCCESSFULLY: (email) =>
      `Registered Successfully.We have sent the verification OTP code.Please check your Email:${email} and verify the otp code`,
    FOGET_PASSWORD_OTP_SEND_SUCCESSFULLY: (value) =>
      `We've sent you a otpCode in your ${value}.`,
    LOGIN_SUCCESS_MESSAGE: "Login Successfully",
    EMAIL_UPDATE_SUCCESSFULLY: (email) =>
      `Email updated Successfully.We have sent the verification OTP code.Please check your Email:${email} and verify the otp code`,
    USER_GET: "User fetch successfully"
  },
  GENERIC: {
    ITEM_UPDATED_SUCCESSFULLY: (value) => `${value} updated successfully.`,
    ITEM_CREATED_SUCCESSFULLY: (key) => `${key} is created successfully.`,
    ITEM_GET_SUCCESSFULLY: (key) => `${key} get successfully.`,
    ITEM_DELETED_SUCCESSFULLY: (key) => `${key} deleted successfully.`,
    ITEM_SAVE_SUCCESSFULLY: (key) => `${key} saved successfully.`,
  },
  TODO: {
    TODO_CREATED_SUCCESSFULLY: "Todo Created Successfully",
    TODO_UPDATED_SUCCESSFULLY: "Todo Updated Successfully",
    TODO_DELETED_SUCCESSFULLY: "Todo Deleted Successfully",
    TODO: "All Todo",
    TODO_BY_USER: "All Todo By User"
  },
  
};

module.exports = InfoMessages;
