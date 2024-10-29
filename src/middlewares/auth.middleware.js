import { asyncHandler } from "../services/asyncHandler.js";
import { ApiError } from "../services/ApiError.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.access_token || 
        req.header("Authorization")?.replace("Bearer", "")
        if (!token) {
            throw new ApiError(401, "Access denied. No token provided")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        //Reference for _id, refreshToken in user.model.js
        const user = await User.findById(decodedToken?._id).
        select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(403, "Unauthorized user..?")
        }
    
        req.user = user;
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token..!" )
        
    }

 })

export {verifyJWT}
