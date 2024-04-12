import User from "../Models/UserModel.js";
import Admin from "../Models/adminModel.js";
import Token from "../Models/Token.js";
import bcrypt from "bcryptjs";
import authSchema from "../helper/validation.js";
import validlogin from "../helper/validationLogin.js";
import { Email } from "../helper/Mail.js";
import { jwtHelper } from "../helper/jwt_helper.js";
import { ObjectId } from 'mongodb';
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} = jwtHelper;

//updating token
const finalValidationGenerateToken = async (accessToken, user, req, res,role) => {
  const finddata = await Token.find({ UserId: user._id });
  if (finddata.length > 0) {
    if(finddata[0].Role != role){
      return res.status(402).json({status:402,success:false,message:"incorrect role"});
    }
    await Token.findByIdAndUpdate(finddata[0].id, {
      Token: accessToken,
    });
  } else {
    await new Token({
      UserId: user._id,
      Role:role,
      Token: accessToken,
    }).save();
  }
  res.status(200).send({ accessToken });
};

class UserController {
  //usersignin
  static async usersSigin(req, res) {
    try {
      const value = await authSchema.validateAsync(req.body);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(value.Password, salt);
      const user = new User({
        Name: value.Name,
        Phone: value.Phone,
        Address: value.Address,
        Password: hashedPassword,
        Gender: req.body.Gender,
        Email: req.body.Email,
        verification: req.body.verification,
      });

      const data = await user.save();
      if (!data) {
        return res.send("User Not Saved");
      }
      const accessToken = await signAccessToken(data.id);
      const datatoken = new Token({
        UserId: data.id,
        Role:"user",
        Token: accessToken,
      }).save();
      await Email(
        data.Email,
        "Tericsoft Signin",
        `<p><b>You have successfully created a new account.</b></p><p>To verify your account, please click the following button:</p><a href='http://localhost:5000/api/${data.id}' style='background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;'>Verify Account</a>`
      );
      res.status(200).send({ accessToken });
    } catch (error) {
      if (error.isJoi === true) {
        error.status = 402;
        console.log(error)
        res.status(402).send("Validation error: " + error.message);
      } else if (
        error.code === 11000 &&
        error.keyPattern &&
        error.keyPattern.Phone === 1
      ) {
        
        res.status(409).send("Phone number is already in use");
      } else {
        res.status(500).send("Error saving user");
      }
    }
  }
  //user login
  static async userLogin(req, res) {
    try {
      const value = await validlogin.validateAsync(req.body);
      const user = await User.findOne({
        $or: [
          { Phone: value.Phone },
          { Email: value.Phone }
        ]
      });
      if (!user) {
        return res.status(404).send("User not found");
      }
      if (!user.verification) {
        return res.status(404).send("verify the account to login");
      }
      const passwordMatch = await bcrypt.compare(value.Password, user.Password);
      if (!passwordMatch) {
        return res.status(401).send("Invalid password");
      }
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      await finalValidationGenerateToken(accessToken, user, req, res,"user");
    } catch (error) {
      if (error.isJoi === true) {
        error.status = 402;
        res.status(402).send("Validation error: " + error.message);
      } else {
        console.log(error)
        res.status(500).send("Error logging in user");
      }
    }
  } //

  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const Phone = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(Phone);
      const refToken = await signRefreshToken(Phone);
      res.send({ accessToken: accessToken });
    } catch (error) {
      next(error);
    }
  }
  //logout for both user and admin
  static async logout(req, res) {
    try {
      if (!req.headers["authorization"]) {
        return res
          .status(400)
          .send("Token required to log out or the user already loggedout");
      }
      verifyAccessToken(req, res, async (err) => {
        if (err) {
          return res
            .status(401)
            .json({ error: "Unauthorized: you has already logged out" });
        }
        const fnd = await Token.findOne({
          Token: req.headers["authorization"].split(" ")[1],
        });
        if (!fnd) {
          return res.status(404).send("U have already LoggedOut");
        }
        await Token.deleteOne({
          Token: req.headers["authorization"].split(" ")[1],
        });
        res.status(200).send("Logout successful");
      });
    } catch (error) {
      res.status(500).send("Error logging out user");
    }
  }

  static async verify(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.send("Not a valid User Id");
      }
      const data = await User.findByIdAndUpdate(id, {
        verification: true,
      });

      if (!data) {
        return res.status(404).send("<h1>User not found </h1> ");
      }

      res.send(
        "<h1>Verification successful!</h1> <a href='http://localhost:3000/api/login'>Login from here</a>"
      );
    } catch (error) {
      res.status(500).send("<h1>Error occurred during verification</h1>");
    }
  }
  
}

class AdminController {
  static async adminCreate(req, res) {
    try {
      const { Email, Password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Password, salt);
      const data = new Admin({
        Email: Email,
        Password: hashedPassword,
      });
      data.save();
      res.status(201).json({ message: "Successfully Registered" });
    } catch (error) {
      res.send("unable to create the user");
    }
  }

  static async adminLogin(req, res) {
    try {
      const { Email, Password } = req.body;
      const user = await Admin.findOne({ Email: Email });
      if (!user) {
        return res.status(401).send({ message: "Invalid Email" });
      }
      const passwordMatch = await bcrypt.compare(Password, user.Password);
      if (!passwordMatch) {
        return res.status(401).send("Invalid password");
      }
      const accessToken = await signAccessToken(user.id);
      await finalValidationGenerateToken(accessToken, user, req, res,"admin");//saving the token to the Token Schema
    } catch (error) {
      console.log(error)
      res.status(402).json({status:402,success:false,message:error.message});
    }
  }
  //send notifications to users
  static async notification(req, res) {
    try {
      let { Message } = req.body;
      const { filter } = req.body;
      const { MessageHeader } = req.body;
      if (!Message||!MessageHeader) {
        return res.send(
          "Email Message and its Header need to be written properly"
        );
      }
      const usersWithEmails = await User.find(filter).select("Email");
      const emails = usersWithEmails
        .filter((user) => user.Email)
        .map((user) => user.Email);
      if (emails.length == 0) {
        return res.send(
          "There is No Such Customer You are trying to send message for"
        );
      }
      await Email(emails, MessageHeader, Message);
      return res.send("email sent sucessfully");
    } catch (error) {
      console.log(error)
      return res.send("error");
    }
  }
}

export { UserController, AdminController };
