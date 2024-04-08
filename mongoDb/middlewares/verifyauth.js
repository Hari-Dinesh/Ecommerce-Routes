import { jwtHelper } from "../helper/jwt_helper.js";
import {checkAuthorization} from './checkAuthorization.js';
import Admin from "../Models/adminModel.js";
import { ObjectId } from 'mongodb';
const adminverify = async (req, res, next) => {
  checkAuthorization(req,res,async()=>{
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
        const findAdminId = await Admin.findById(userId);
        if (!findAdminId) {
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
};
export {adminverify};