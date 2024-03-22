const User=require('../Models/UserModel')
const Token=require('../Models/Token')
const bcrypt=require('bcryptjs')
const authSchema=require('../helper/validation')
const validlogin=require('../helper/validationLogin')
const {signAccessToken,signRefreshToken,verifyRefreshToken,verifyAccessToken}=require('../helper/jwt_helper')
module.exports.usersSigin = async (req, res) => {
  try {
    const value = await authSchema.validateAsync(req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(value.Password, salt);
    const user = new User({
      Name:value.Name,
      Phone:value.Phone,
      Address:value.Address,
      Password:hashedPassword,
      Gender:req.body.Gender
    });

    const data=await user.save();
    // console.log(data.id)
    const accessToken = await signAccessToken(data.id);
    const datatoken= new Token({
      Token:accessToken
    }).save();
    const refreshToken = await signRefreshToken(data.id);
    res.status(200).send({ accessToken });
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 402;
      res.status(402).send('Validation error: ' + error.message);
    } else if (error.code === 11000 && error.keyPattern && error.keyPattern.Phone === 1) {
      res.status(409).send('Phone number is already in use');
    } else {
      res.status(500).send('Error saving user');
    }
  }
};

module.exports.userLogin = async (req, res) => {
  try {
    const value=await validlogin.validateAsync(req.body)
    const user = await User.findOne({ Phone: value.Phone });
    if (!user) {
      return res.status(404).send('User not found');
    }
    const passwordMatch = await bcrypt.compare(value.Password, user.Password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid password');
    }
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    const data= new Token({
      Token:accessToken
    }).save();
    
    res.status(200).send({ accessToken });
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 402;
      res.status(402).send('Validation error: ' + error.message);
    } else {
      res.status(500).send('Error logging in user');
    }
  }
};
module.exports.refreshToken=async(req,res,next)=>{
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw createError.BadRequest()
    const Phone = await verifyRefreshToken(refreshToken)
    const accessToken = await signAccessToken(Phone)
    const refToken = await signRefreshToken(Phone)
    res.send({ accessToken: accessToken })
  } catch (error) {
    next(error)
  }
}

  module.exports.logout = async (req, res) => {
    try {
      if (!req.headers['authorization']) {
        return res.status(400).send('Refresh token is required');
      }
      verifyAccessToken(req, res, async (err) => {
        if (err) {
          return res.status(401).json({ error: 'Unauthorized: User has already logged out' });
        }
        const fnd=await Token.findOne({Token:req.headers['authorization'].split(" ")[1]})
        if(!fnd){
          return res.status(404).send('U have already LoggedOut');
        }
        await Token.deleteOne({Token:req.headers['authorization'].split(" ")[1]})
        res.status(200).send('Logout successful');
      });
    } catch (error) {
      res.status(500).send('Error logging out user');
    }
  };
  
