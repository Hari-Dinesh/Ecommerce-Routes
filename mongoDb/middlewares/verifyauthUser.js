import { jwtHelper } from "../helper/jwt_helper.js";
import User from "../Models/UserModel.js";
import {checkAuthorization} from './checkAuthorization.js';
const verifyUser=async(req,res,next)=>{
    checkAuthorization(req,res,async()=>{
        try {
            jwtHelper.verifyAccessToken(req, res, async (err) => {
                if (err) {
                    return res.status(401).json({
                        error: "Unauthorized: Invalid access token Login TO get Your Details",
                    });
                }
                const userId = req.payload.aud;
          const finduserId = await User.findById(userId);
          if (!finduserId) {
            return res
              .status(401)
              .json({ message: "You are not authorized to see this details" });
          }
                next(); 
            });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    })
    
}
export {verifyUser}