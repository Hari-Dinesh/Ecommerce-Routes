import { jwtHelper } from "../helper/jwt_helper.js";
import User from "../Models/UserModel.js";
import {checkAuthorization} from './checkAuthorization.js';
import { ObjectId } from 'mongodb';
const verifyUser=async(req,res,next)=>{
    checkAuthorization(req,res,async(role)=>{
        if(role!=="user"){
            return res.status(402).json({message:"You are not a valid User",status:402,success:false})
          }
        try {
            jwtHelper.verifyAccessToken(req, res, async (err) => {
                if (err) {
                    return res.status(401).json({
                        error: "Unauthorized: Invalid access token Login TO get Your Details",
                    });
                }
                const userId = req.payload.aud;
                if (!ObjectId.isValid(userId)) {
                    return res.send("Not a valid user ID");
                }
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