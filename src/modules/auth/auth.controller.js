import ApiResponse from "../../common/utils/api-response.js";
import * as authService from "./auth.service.js"


 const register = async (req , res)=>{
 const user = await authService.register(req.body)
 ApiResponse.created(res, "Registration success" , user);

 };

 const login = async(req , res)=>{
    const {user,accessToken,refreshToken} = await authService.login(req.body);

    // refresh token goes in httponly cookies

    res.cookie("refreshToken" , refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV == "production",
        sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, 

    });
    ApiResponse.ok(res,"login successful",{user,accessToken});
 };

 const refreshToken = async (req , res) =>{
    const token = req.cookie?.refreshToken;
    const{accessToken} = await authService.refresh(token);
    ApiResponse.ok(res,"Token REfreshed",{accessToken});
 };

 const logout = async (req,res)=>{
    await authService.logout(req.user.id);
    res.clearCookies("refreshToken");
    ApiResponse.ok(res , refreshToken);
 };

 const verifyEmail = async (req,res) =>{
    await authService.verifyEmail(req.params.token);
    ApiResponse.ok(res, "Email verified successfully");

 };
 const forgotPassword = async (req, res) => {
  await authService.forgotPassword(req.body.email);
  ApiResponse.ok(res, "Password reset email sent");
};

const resetPassword = async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  ApiResponse.ok(res, "Password reset successful");
};

const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  ApiResponse.ok(res, "User profile", user);
};




 export {register, login, refreshToken, logout, forgotPassword,resetPassword,verifyEmail,getMe}