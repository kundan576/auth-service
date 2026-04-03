class ApiError extends Error{
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this,this.constructor);
    }

    static badRequest(message = "Bad request"){
        return new ApiError(400, message)
        
    } 

    static unauthorized(message = "unauthorized"){
        return new ApiError(400,message);
    }
    static conflict(message = "User already exist "){
        return new ApiError(404,message);
    }
    static forbidden(message ="Not Allow to Access"){
        return new ApiError(404,message);
    }
    static notFound(message = "Not Found") {
  return new ApiError(404, message);
}
     


}
export default ApiError