const dotenv = require("dotenv");
dotenv.config();

const config = {
  otpExpireTime: 90,

  email: {
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.PASS,
    host: process.env.HOST,
    adminEmail: process.env.ADMIN_EMAIL,
    resendOtpSubject: "Resend Otp ",
    signupSubject: "New User SignUp ",
    forgotSubject: "Forgot Password  ",
    updateEmailSubject: "Update Email ",

    template: {
      emailSignupOtp: (token) => {
        return `
      <div style="width: 600px; font-size: 18px; background-color: white; color: black;">
        
          
          <div style="height: 1px; background-color: rgb(198, 198, 198); width: 100%; margin-top: 15px; margin-bottom: 25px;"></div>
          <div style="padding: 10px 30px 10px 30px;">
            <span style="font-weight: 600;">Hello ,</span>
            <br>
            <br>
  
            Your OTP verification number is <b>${token}</b>. Please put this number in the given box to complete the process. Thanks!
          </div>
          <div style="height: 1px; background-color: rgb(198, 198, 198); width: 100%; margin-top: 15px; margin-bottom: 25px;"></div>
          <div style="padding-left: 35px; padding-right: 35px; line-height: 30px;">
         <br> 
          <br>
        
          <div style="padding: 10px; font-size: 16px; text-align: center; line-height: 18px;">
            If you have any questions or would like us to match a competitor's rate please call us at (954) 302-2650
          </div>
          </div>
          <div style="height: 160px; background-color: rgb(225, 225, 225); width: 100%; margin-top: 25px; margin-bottom: 25px; padding-top:40px;">
            <div style="width: 100%; padding-left: 5px;">
              <div style="width: 235px; display: inline-block;">
                <a style="text-decoration: none; margin-left: 180px;" href="#">
                  <img style="height: 35px;" src="https://res.cloudinary.com/maxxvin-com/image/upload/c_scale,h_100/v1666291012/twitter_cqk2eh.png">
                </a>
              </div>
          </div>
        </div>
        `;
      },

      resendOtp: (token) => {
        return `
    <div style="width: 600px; font-size: 18px; background-color: white; color: black;">
        
        
        <div style="height: 1px; background-color: rgb(198, 198, 198); width: 100%; margin-top: 15px; margin-bottom: 25px;"></div>
        <div style="padding: 10px 30px 10px 30px;">
          <span style="font-weight: 600;">Hello ,</span>
          <br>
          <br>

          Your new OTP verification number is <b>${token}</b>. Please put this number in the given box to complete the process. Thanks!
        </div>
        <div style="height: 1px; background-color: rgb(198, 198, 198); width: 100%; margin-top: 15px; margin-bottom: 25px;"></div>
        <div style="padding-left: 35px; padding-right: 35px; line-height: 30px;">
       <br>
       
        <br>
       
        <div style="padding: 10px; font-size: 16px; text-align: center; line-height: 18px;">
          If you have any questions or would like us to match a competitor's rate please call us at (954) 302-2650
        </div>
        </div>
        <div style="height: 160px; background-color: rgb(225, 225, 225); width: 100%; margin-top: 25px; margin-bottom: 25px; padding-top:40px;">
          <div style="width: 100%; padding-left: 5px;">
            <div style="width: 235px; display: inline-block;">
              <a style="text-decoration: none; margin-left: 180px;" href="#">
                <img style="height: 35px;" src="https://res.cloudinary.com/maxxvin-com/image/upload/c_scale,h_100/v1666291012/twitter_cqk2eh.png">
              </a>
            </div>
           
          </div>
          
        </div>
      </div>
      `;
      },
      emailForgotPassword: (token) => {
        return `
    <div style="width: 600px; font-size: 18px; background-color: white; color: black;">
       
        
        <div style="height: 1px; background-color: rgb(198, 198, 198); width: 100%; margin-top: 15px; margin-bottom: 25px;"></div>
        <div style="padding: 10px 30px 10px 30px;">
          <span style="font-weight: 600;">Hello ,</span>
          <br>
          <br>

         For the completion of the reset password process, your OTP token is: <b>${token}</b>
        </div>
        <div style="height: 1px; background-color: rgb(198, 198, 198); width: 100%; margin-top: 15px; margin-bottom: 25px;"></div>
        <div style="padding-left: 35px; padding-right: 35px; line-height: 30px;">
       <br> 
        <br>
      
        <div style="padding: 10px; font-size: 16px; text-align: center; line-height: 18px;">
          If you have any questions or would like us to match a competitor's rate please call us at (954) 302-2650
        </div>
        </div>
        <div style="height: 160px; background-color: rgb(225, 225, 225); width: 100%; margin-top: 25px; margin-bottom: 25px; padding-top:40px;">
          <div style="width: 100%; padding-left: 5px;">
            <div style="width: 235px; display: inline-block;">
              <a style="text-decoration: none; margin-left: 180px;" href="#">
                <img style="height: 35px;" src="https://res.cloudinary.com/maxxvin-com/image/upload/c_scale,h_100/v1666291012/twitter_cqk2eh.png">
              </a>
            </div>
          
          </div>
         
        </div>
      </div>
      `;
      },
    },
  },
};

module.exports = config;
