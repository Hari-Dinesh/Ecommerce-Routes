import { jwtHelper } from "../helpers/jwt_helper.js";
import {checkAuthorization} from './checkAuthorization.js';
import { client } from "../db.js";
const {verifyAccessToken}=jwtHelper
const adminverify = async (req, res, next) => {
  checkAuthorization(req,res,async(role)=>{
    if(role!=="admin"){
      return res.status(402).json({message:"You are not a valid admin",status:402,success:false})
    }
    try {
      verifyAccessToken(req, res, async (err) => {
        if (err) {
          return res.status(401).json({
            error: "Unauthorized: validity expired fot the access token Login TO get Your Details",
          });
        }
        next();
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
};
export {adminverify};
