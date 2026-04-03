import joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";


class ResetPasswordDto extends BaseDto{
    static schema = joi.object({
        passord:joi.string().min(8).required().pattern(/(?=.*[A-Z])(?=.*\d)/).message("Password must contain at least one uppercase letter and one digit"),
    });
}
export default ResetPasswordDto;