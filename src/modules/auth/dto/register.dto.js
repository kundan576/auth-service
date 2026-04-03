import joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class RegisterDto extends BaseDto{
        static schema = joi.object({
            name:joi.string().trim().min(2).max(20).required(),
            email: joi.string().email().lowercase().required(),
            password: joi.string().min(8).required().pattern(/(?=.*[A-Z])(?=.*\d)/).message("password must contain at least one uppercase letter and one digit"),
            role: joi.string().valid("customer" , "seller").default("customer"),
        });
}
export default RegisterDto;