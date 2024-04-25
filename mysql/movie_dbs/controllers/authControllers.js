import { client } from "../db.js";
import {validateLogin,validateUserRegistration} from '../helpers/validation.js'
import { jwtHelper } from "../helpers/jwt_helper.js";
const {
    signAccessToken
  } = jwtHelper;
  const finalValidationGenerateToken = async (accessToken, userid, req, res,role) => {  
    const query='select * from tokens where role=$1 and user_id=$2'
    const values=[role,userid]
    const finddata = await client.query(query,values);
    if (finddata.rows.length > 0) {
      if(finddata.rows[0].role!= role){
        return res.status(402).json({status:402,success:false,message:"incorrect role"});
      }
      await client.query('update tokens set token=$1',[accessToken])
      console.log(accessToken)
    } else {
      await client.query(`insert into tokens (user_id,token,role) VALUES ($1, $2, $3)`, [userid, accessToken, role]);

    }
    res.status(200).send({ accessToken });
  };
class Authenticate{
    static async adminLogin(req,res){
        try {
            const validation=await validateLogin.validate(req.body)
            const data = await client.query('SELECT * FROM admin WHERE email = $1', [validation.email]);
            if(data.rows.length!=1){
                res.status(301).json({status:500,success:false,message:"not a valid Email"})
            }
            if(data.rows[0].password!==validation.password){
                res.status(301).json({status:500,success:false,message:"Incorrect password"})
            }
            const accessToken = await signAccessToken(data.rows);
            console.log(data.rows[0])
            await finalValidationGenerateToken(accessToken, data.rows[0].id, req, res,"user");
        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
}
export {Authenticate}