const express = require("express");
const userModel = require("../models/user");
const ErrorMessages = require("../constants/error");
const SuccessMessages = require("../constants/messages");
const dotenv = require("dotenv");
const {
  successResponse,
  errorResponse,
  responseWithData,
} = require("../responses/response");
const { hashPassword, getUtcDate, comparePassword } = require("../utils/util");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/emailUtility");
const config = require("../config/config");
const moment = require("moment");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
dotenv.config();

const passport = require("passport");
require("../utils/passport")(passport);

const jwtKey = process.env.JWT_KEY;

router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, password, email, role } = req.body;
    if (!firstname) {
      res
        .status(403)
        .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("First name"));
    } else if (!lastname) {
      res
        .status(403)
        .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Last name"));
    } else if (!password) {
      res
        .status(403)
        .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Password"));
    } else if (!email) {
      res
        .status(403)
        .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Email"));
    } else if (!role) {
      res
        .status(403)
        .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Role"));
    } else {
      const checkEmailExist = await userModel.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
      });

      if (checkEmailExist) {
        return errorResponse(
          res,
          ErrorMessages.AUTH.VALUE_ALREADY_EXIST("Email", email),
          400
        );
      }

      let hash = await hashPassword(password);

      let otpNumber = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      let utcDate = getUtcDate();

      let user = {
        firstName: firstname,
        lastName: lastname,
        password: hash,
        email: email,
        role: role,
        otpCode: otpNumber,
        otpCreateTime: utcDate,
      };

      let { delivered } = await sendEmail(
        email,
        config.email.signupSubject,
        config.email.template.emailSignupOtp(otpNumber)
      );

      if (!delivered) {
        return errorResponse(
          res,
          ErrorMessages.AUTH.NETOWRK_PROBLEM_ERROR,
          400
        );
      } else {
        const newUser = new userModel(user);
        await newUser.save();
        return successResponse(
          res,
          SuccessMessages.AUTH.REGISTER_SUCCESSFULLY(email),
          200
        );
      }
    }
  } catch (error) {
    return errorResponse(
      res,
      ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
        "User registration",
        error?.message
      ),
      500
    );
  }
});

router.post("/verifyOtp", async (req, res) => {
  const { otpCode, authValue } = req.body;
  try {
    if (!otpCode) {
      res
        .status(403)
        .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Otp-Code"));
    } else if (!authValue) {
      res
        .status(403)
        .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Email"));
    } else {
      const userRecord = await userModel.findOne({
        otpCode: otpCode,
        email: { $regex: new RegExp(`^${authValue}$`, "i") },
      });
      if (!userRecord) {
        return errorResponse(res, ErrorMessages.AUTH.INVALID_OTP, 400);
      }
      if (userRecord.Is_OTP_Verified === true) {
        return errorResponse(res, ErrorMessages.AUTH.ALREADY_VERIFY, 400);
      }

      var utcMoment = moment.utc();
      var utcDate = new Date(utcMoment.format());
      var diff =
        (utcDate.getTime() - userRecord.otpCreateTime.getTime()) / 1000;
      const diffInMinute = diff / 60;

      if (diffInMinute > config.otpExpireTime)
        return errorResponse(res, ErrorMessages.AUTH.OTP_CODE_EXPIRED, 400);

      userRecord.isOTPVerified = true;
      userRecord.otpCode = 0;
      await userRecord.save();

      return successResponse(
        res,
        SuccessMessages.GENERIC.ITEM_UPDATED_SUCCESSFULLY(
          "User account status"
        ),
        200
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
        "Otp Verification",
        error?.message
      ),
      500
    );
  }
});

router.post("/resendOtp", async (req, res) => {
  const { authValue } = req.body;
  try {
    if (!authValue) {
      res
        .status(403)
        .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Email"));
    }
    const userRecord = await userModel.findOne({
      email: { $regex: new RegExp(`^${authValue}$`, "i") },
    });

    if (!userRecord) {
      return errorResponse(
        res,
        ErrorMessages.COMMON_VALIDATION_ERROR.USER_NOT_FOUND("Email"),
        400
      );
    }

    if (userRecord.isOTPVerified === true) {
      return errorResponse(res, ErrorMessages.AUTH.ALREADY_VERIFY, 400);
    }

    let otpNumber = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    let utcDate = getUtcDate();
    let { delivered } = await sendEmail(
      authValue,
      config.email.resendOtpSubject,
      config.email.template.resendOtp(otpNumber)
    );

    if (!delivered) {
      return errorResponse(res, ErrorMessages.AUTH.NETOWRK_PROBLEM_ERROR, 400);
    } else {
      userRecord.otpCode = otpNumber;
      userRecord.otpCreateTime = utcDate;
      await userRecord.save();

      return successResponse(
        res,
        SuccessMessages.GENERIC.ITEM_UPDATED_SUCCESSFULLY("User Otp Updated"),
        200
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Resend Otp", error?.message),
      500
    );
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res
        .status(403)
        .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Email"));
    } else if (!password) {
      res
        .status(403)
        .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Password"));
    } else {
      const userExist = await userModel.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
      });

      if (!userExist) {
        return errorResponse(res, "Your email is not valid", 400);
      }

      let id = userExist._id;
      let firstName = userExist.firstName;
      const passwordIsValid = bcrypt.compareSync(password, userExist.password);

      if (!passwordIsValid) {
        return errorResponse(res, "Your password is not valid", 400);
      }

      if (userExist.isOTPVerified === false) {
        return responseWithData(
          res,
          true,
          ErrorMessages.AUTH.LOGIN_FAIL_MESSAGE,
          { accountVerified: false, email: userExist.email },
          200
        );
      }

      const jwtToken = jwt.sign(
        {
          email,
          id,
          userExist,
        },
        jwtKey,
        {
          expiresIn: "1d",
        }
      );

      return responseWithData(
        res,
        true,
        SuccessMessages.AUTH.LOGIN_SUCCESS_MESSAGE,
        { accessToken: jwtToken, accountVerified: true },
        200
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      ErrorMessages.GENERIC_ERROR.OPERATION_FAIL("Login", error?.message),
      500
    );
  }
});

router.post("/forgotCredential", async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      res
        .status(403)
        .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Email"));
    }
    const userRecord = await userModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (!userRecord) {
      return res
        .status(400)
        .json({ error: ErrorMessages.AUTH.ACCOUNT_NOT_FOUND("Email", email) });
    }
    let otpNumber = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    let utcDate = getUtcDate();
    let { delivered } = await sendEmail(
      email,
      config.email.forgotSubject,
      config.email.template.emailForgotPassword(otpNumber)
    );
    if (!delivered) {
      return errorResponse(res, ErrorMessages.AUTH.NETOWRK_PROBLEM_ERROR, 400);
    }
    userRecord.otpCode = otpNumber;
    userRecord.otpCreateTime = utcDate;
    await userRecord.save();
    return successResponse(
      res,
      SuccessMessages.AUTH.FOGET_PASSWORD_OTP_SEND_SUCCESSFULLY(email),
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
        "Forgot Email Send",
        error?.message
      ),
      500
    );
  }
});

router.post("/updatePassword", async (req, res) => {
  const { otpCode, password } = req.body;
  try {
    if (!otpCode) {
      res
        .status(403)
        .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Otp-Code"));
    } else if (!password) {
      res
        .status(403)
        .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Password"));
    } else {
      const userRecord = await userModel.findOne({ otpCode: otpCode });
      if (!userRecord) {
        return errorResponse(res, ErrorMessages.AUTH.INVALID_OTP, 400);
      }
      var utcMoment = moment.utc();
      var utcDate = new Date(utcMoment.format());
      var diff =
        (utcDate.getTime() - userRecord.otpCreateTime.getTime()) / 1000;
      const diffInMinute = diff / 60;
      if (diffInMinute > config.otpExpireTime)
        return errorResponse(res, ErrorMessages.AUTH.OTP_CODE_EXPIRED, 400);

      let hash = await hashPassword(password);
      userRecord.password = hash;
      userRecord.otpCode = 0;
      await userRecord.save();
      return successResponse(
        res,
        SuccessMessages.GENERIC.ITEM_UPDATED_SUCCESSFULLY("password"),
        200
      );
    }
  } catch (error) {
    return errorResponse(
      res,
      ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
        "Update password",
        error?.message
      ),
      500
    );
  }
});

router.patch(
  "/updateEmail",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;
    const { email } = req.body;
    try {
      const checkEmailExist = await userModel.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
      });

      if (checkEmailExist) {
        return errorResponse(
          res,
          ErrorMessages.AUTH.VALUE_ALREADY_EXIST("email", email),
          400
        );
      }

      let otpNumber = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      let utcDate = getUtcDate();

      let { delivered } = await sendEmail(
        email,
        config.email.updateEmailSubject,
        config.email.template.emailSignupOtp(otpNumber)
      );

      if (!delivered) {
        return errorResponse(
          res,
          ErrorMessages.AUTH.NETOWRK_PROBLEM_ERROR,
          400
        );
      }

      await userModel.updateOne(
        { _id: user._id },
        {
          $set: {
            otpCreateTime: utcDate,
            otpCode: otpNumber,
          },
        }
      );

      return responseWithData(
        res,
        true,

        SuccessMessages.AUTH.EMAIL_UPDATE_SUCCESSFULLY(email),
        { email: email },
        200
      );
    } catch (error) {
      return errorResponse(
        res,
        ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
          "Error email update",
          error?.message
        ),
        500
      );
    }
  }
);

router.patch(
  "/verfiyOtpProfile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { otpCode, authValue } = req.body;
    const user = req.user;
    try {
      const userRecord = await userModel.findOne({
        otpCode: otpCode,
      });
      if (!userRecord) {
        return errorResponse(res, ErrorMessages.AUTH.INVALID_OTP, 400);
      }

      var utcMoment = moment.utc();
      var utcDate = new Date(utcMoment.format());
      var diff =
        (utcDate.getTime() - userRecord.otpCreateTime.getTime()) / 1000;
      const diffInMinute = diff / 60;
      if (diffInMinute > config.otpExpireTime)
        return errorResponse(res, ErrorMessages.AUTH.OTP_CODE_EXPIRED, 400);

      await userModel.findByIdAndUpdate(
        { _id: user._id },
        {
          $set: {
            email: authValue,
            otpCode: 0,
          },
        }
      );
      return successResponse(
        res,
        SuccessMessages.GENERIC.ITEM_UPDATED_SUCCESSFULLY(
          "User account status"
        ),
        200
      );
    } catch (error) {
      return errorResponse(
        res,
        ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
          "Otp Verification",
          error?.message
        ),
        500
      );
    }
  }
);

router.patch(
  "/resendOtpCodeProfile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { authValue } = req.body;
    const user = req.user;
    try {
      const userRecord = await userModel.findOne({
        _id: user._id,
      });
      if (!userRecord) {
        return errorResponse(
          res,
          ErrorMessages.COMMON_VALIDATION_ERROR.USER_NOT_FOUND("email"),
          400
        );
      }
      let otpNumber = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      let utcDate = getUtcDate();
      let { delivered } = await sendEmail(
        authValue,
        config.email.resendOtpSubject,
        config.email.template.resendOtp(otpNumber)
      );

      if (!delivered) {
        return errorResponse(
          res,
          ErrorMessages.AUTH.NETOWRK_PROBLEM_ERROR,
          400
        );
      }
      await userModel.findByIdAndUpdate(
        { _id: user._id },
        {
          $set: {
            otpCreate_Time: utcDate,
            otpCode: otpNumber,
          },
        }
      );
      return successResponse(
        res,
        SuccessMessages.GENERIC.ITEM_UPDATED_SUCCESSFULLY("User Otp Updated"),
        200
      );
    } catch (error) {
      return errorResponse(
        res,
        ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
          "Resend Otp",
          error?.message
        ),
        500
      );
    }
  }
);

router.patch(
  "/updatePasswordOnProfile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let id = req.user._id;
    let { oldPassword, password, confirmPassword } = req.body;
    try {
      if (!oldPassword) {
        res
          .status(403)
          .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Old-Password"));
      } else if (!password) {
        res
          .status(403)
          .json(ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Password"));
      } else if (!confirmPassword) {
        res
          .status(403)
          .json(
            ErrorMessages.COMMON_VALIDATION_ERROR.MISSING("Confirm-Password")
          );
      } else if (password !== confirmPassword) {
        return errorResponse(res, ErrorMessages.AUTH.PASSWORD_NOT_MATCH, 400);
      } else {
        let userRecord = await userModel.findOne({ _id: id });

        if (!userRecord) {
          return errorResponse(
            res,
            ErrorMessages.COMMON_VALIDATION_ERROR.USER_NOT_FOUND(id),
            400
          );
        }
        let passwordCompare = await comparePassword(
          oldPassword,
          userRecord.password
        );

        if (!passwordCompare) {
          return errorResponse(res, ErrorMessages.AUTH.WRONG_OLD_PASSWORD, 400);
        }

        let hash = await hashPassword(password);
        userRecord.password = hash;
        await userRecord.save();
        return successResponse(
          res,
          SuccessMessages.GENERIC.ITEM_UPDATED_SUCCESSFULLY("Password"),
          200
        );
      }
    } catch (error) {
      return errorResponse(
        res,
        ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
          "Facing some issue to update password",
          error?.message
        ),
        500
      );
    }
  }
);

router.get(
  "/getUser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = await req.user._id;

    try {
      const getUser = await userModel.findById({ _id: userId });

      return responseWithData(
        res,
        true,
        SuccessMessages.AUTH.USER_GET,
        { user: getUser },
        200
      );
    } catch (error) {
      return errorResponse(
        res,
        ErrorMessages.GENERIC_ERROR.OPERATION_FAIL(
          "Facing some issue to get user",
          error?.message
        ),
        500
      );
    }
  }
);

module.exports = router;
