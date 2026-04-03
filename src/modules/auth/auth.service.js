import ApiError from "../../common/utils/api-error.js";
import crypto from "node:crypto";
import User from "./auth.model.js"
import {
    generateResetToken,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../../common/config/email.js"; 
 

// Hash refresh token before storing — same approach as reset tokens
const hashToken = (token) => {
    crypto.createHash("sha256").update(token).digest("hex");
}

const register = async ({ name, email, password, role }) => {

    const existing = await User.findOne({ email });
    if (existing) throw ApiError.conflict("Email already exist");


    const { rawToken, hashedToken } = generateResetToken()

    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken: hashedToken
    });

    // Don't let email failure crash registration — user is already created
  try {
    await sendVerificationEmail(email, rawToken);
  } catch (err) {
    console.error("Failed to send verification email:", err.message);
  }

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.verificationToken

    return userObj;

};

//login 

// get email and password from body
//validation
//if user email in db or not 
//if email not error
//if email i sthere then check hashes password 
// if hash is match
//give the user a token 
// else throw error



const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw ApiError.unauthorized("Invalid Email or Password");


    if (!user.isVerified) { // to get access for only verifid user 
        throw ApiError.forbidden("Please verify your email before loggin");
    }
    //  we generate token  get login we send token to the user
    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    // to save token  in data base before user get login
    //  // Store hashed refresh token in DB so it can be invalidated on logout
    user.refreshToken = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false }); // to save in db we change one thing so we make false

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };

};

// to access token is expire then we generate new access token here user send new refresh token to generate new accaess token .

//take token from user
// check toekn
//then decode that token 
// on based on decode token and refresh token  find user in db 
//if user not found then throw error 
//if refresh token and hashed token not match then throw error

//all good then access token generate


// Issues a new access token using a valid refresh token

const refresh = async (token) => {
    if (!token) throw ApiError.unauthorized("Refresh token is missing");
    const decode = verifyRefreshToken(token);

    const user = await User.findById(decode.id).select("+refreshToken");
    if (!user) throw ApiError.unauthorized("user not found");

      // Verify the refresh token matches what's stored (prevents reuse of old tokens)

    if (user.refreshToken !== hashToken(token)) {
        throw ApiError.unauthorized(" invalid refresh ");
    }
    const accaessToken = generateAccessToken({ id: user._id, role: user.role })
    return { accaessToken };

};
// logout

// get userid from user 
const logout = async(userId)=>{

      // Clear stored refresh token so it can't be reused

    await User.findByIdAndUpdate(userId,{refreshToken:null})
};

const verifyEmail = async (token) => {
  const trimmed = String(token).trim();
  if (!trimmed) {
    throw ApiError.badRequest("Invalid or expired verification token");
  }


  
  // DB stores SHA256(raw). Links / email use the raw token — we hash for lookup.
  // If you paste the hash from MongoDB into Postman, hashing again would not match;
  // so we also try a direct match on the stored value.
  const hashedInput = hashToken(trimmed);
  let user = await User.findOne({ verificationToken: hashedInput }).select(
    "+verificationToken",
  );
  if (!user) {
    user = await User.findOne({ verificationToken: trimmed }).select(
      "+verificationToken",
    );
  }
  if (!user) throw ApiError.badRequest("Invalid or expired verification token");

  await User.findByIdAndUpdate(user._id, {
    $set: { isVerified: true },
    $unset: { verificationToken: 1 },
  });

  return user;
};

// forgotPassword

// get email from user
// check the emil in db
// not found give error
// generate rawtoken and hasedtoken
// save hashedToken in user db 
// set reset expire 
// save user

const forgotPassword = async(email)=>{
    const user =  await User.findOne({email});
    if(!user) throw ApiError.notfound("no account with this email");

    const {rawToken,hashedToken} = generateResetToken()
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 *1000;

    await user.save();

    try {
    await sendResetPasswordEmail(email, rawToken);
  } catch (err) {
    console.error("Failed to send reset email:", err.message);
  }

};

const resetPassword = async (token, newPassword) => {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) throw ApiError.badRequest("Invalid or expired reset token");

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

const getMe = async(userId) =>{
    const user = await User.findById(userId);
    if(!user) throw ApiError.notFound("user not found");
    return user;

}

export { register, login, refresh, logout,verifyEmail, forgotPassword, resetPassword, getMe   }