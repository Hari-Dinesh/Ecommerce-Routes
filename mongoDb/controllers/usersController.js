const User=require('../Models/UserModel')
module.exports.users=async(req,res)=>{
  const {name,phone,Adress}=req.body
    const user=new User({
        name:name,
        phone:phone,
        Adress:Adress

    })
    user.save()
    .then(() => {
      res.status(201).send('User created successfully');
    })
    .catch((error) => {
      console.error('Error saving user:', error);
      res.status(500).send('Error saving user');
    });
}