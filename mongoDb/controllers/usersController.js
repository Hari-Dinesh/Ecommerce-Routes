const User = require("../Models/UserModel");
const Admin = require("../Models/adminModel");
const Token = require("../Models/Token");
const bcrypt = require("bcryptjs");
const authSchema = require("../helper/validation");
const validlogin = require("../helper/validationLogin");
const { Email } = require("../helper/Mail");
// const mail=require('../helper/Mail')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} = require("../helper/jwt_helper");
const finalValidation = async (accessToken, user, req, res) => {
  const finddata = await Token.find({ UserId: user._id });
  if (finddata.length > 0) {
    const data = await Token.findByIdAndUpdate(finddata[0].id, {
      Token: accessToken,
    });
  } else {
    const data = new Token({
      UserId: user._id,
      Token: accessToken,
    }).save();
  }
  res.status(200).send({ accessToken });
};
module.exports.usersSigin = async (req, res) => {
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

    const accessToken = await signAccessToken(data.id);
    const datatoken = new Token({
      Token: accessToken,
    }).save();
    Email(
      data.Email,
      "Tericsoft Signin",
      `<p><b>You have successfully created a new account.</b></p><p>To verify your account, please click the following button:</p><a href='http://localhost:5000/api/${data.id}' style='background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;'>Verify Account</a>`
    );
    // const refreshToken = await signRefreshToken(data.id);
    res.status(200).send({ accessToken });
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 402;
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
};

module.exports.userLogin = async (req, res) => {
  try {
    const value = await validlogin.validateAsync(req.body);
    const user = await User.findOne({ Phone: value.Phone });
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
    await finalValidation(accessToken, user, req, res);
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 402;
      res.status(402).send("Validation error: " + error.message);
    } else {
      res.status(500).send("Error logging in user");
    }
  }
};

module.exports.refreshToken = async (req, res, next) => {
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
};

module.exports.logout = async (req, res) => {
  try {
    if (!req.headers["authorization"]) {
      return res.status(400).send("Refresh token is required");
    }
    verifyAccessToken(req, res, async (err) => {
      if (err) {
        return res
          .status(401)
          .json({ error: "Unauthorized: User has already logged out" });
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
};

module.exports.verify = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findByIdAndUpdate(id, {
      verification: true,
    });

    if (!data) {
      return res.status(404).send("<h1>User not found </h1> ");
    }

    res.send(
      "<h1>Verification successful!</h1> <a href='https://login'>Login from here</a>"
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("<h1>Error occurred during verification</h1>");
  }
};

//admin details starts here
module.exports.adminCreate = async (req, res) => {
  try {
    const { gmail, Password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);
    const data = new Admin({
      Email: gmail,
      Password: hashedPassword,
    });
    data.save();
    const emailAdmin = "sriharidinesh77@gmail.com";
    Email(
      emailAdmin,
      "Tericsoft Signin",
      `<p>new user has been created please check if reatricted with email:${data.Email}</p>`
    );

    res.status(201).json({ message: "Successfully Registered" });
  } catch (error) {
    res.send("unable to create the user");
    console.log(error);
  }
};

//admin login
module.exports.adminLogin = async (req, res) => {
  try {
    const { gmail, Password } = req.body;
    const user = await Admin.findOne({ Email: gmail });
    if (!user) {
      res.status(401).send({ message: "user does not exist with this Email" });
    }
    const passwordMatch = await bcrypt.compare(Password, user.Password);
    if (!passwordMatch) {
      return res.status(401).send("Invalid password");
    }
    const accessToken = await signAccessToken(user.id);
    await finalValidation(accessToken, user, req, res);
    const emailAdmin = "sriharidinesh77@gmail.com";
    Email(
      emailAdmin,
      "Tericsoft Login",
      `<p>Admin has logged in with email:${user.Email}</p>`
    );
  } catch (error) {
    console.log(error);
    res.send("error");
  }
};

module.exports.notification = async (req, res) => {
  if (!req.headers["authorization"]) {
    return res.status(400).json({
      success: false,
      message: "User Needs to Login to Perform this Action",
    });
  }
  const fnd = await Token.findOne({
    Token: req.headers["authorization"].split(" ")[1],
  }); //
  if (!fnd) {
    return res.status(404).send("Login to Perform this Action");
  }
  try {
    verifyAccessToken(req, res, async (err) => {
      if (err) {
        return res.status(401).json({
          error: "Unauthorized: Invalid access token Login TO get Your Details",
        });
      }
      const userId = req.payload.aud;
      const findAdminId = await Admin.findById(userId);
      if (!findAdminId) {
        return res
          .status(401)
          .json({ message: "you are not authorized to see this details" });
      }
      const { message } = req.body;
      const { restriction } = req.body;
      const email1 = restriction.split(":")
      const field=email1[0]
      const value=email1[1]
      const usersWithEmails = await User.find().select("Email");//
      console.log(usersWithEmails)
      const emails = usersWithEmails
        .filter((user) => user.Email)
        .map((user) => user.Email);
        console.log(emails)
    const email="gaddamsharathvitap@gmail.com"
    
      await Email(emails, "Tericsoft Signin", message);
      return res.send("email sent sucessfully");
    });
  } catch (error) {
    console.log(error);
    return res.send("error");
  }
};
