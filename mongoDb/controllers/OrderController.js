const Order = require("../Models/orderModel");
const User = require("../Models/UserModel");
const Admin=require('../Models/adminModel')
const Token = require("../Models/Token");
// var validateDate = require("validate-date"); //
// let { isDate } = require("validator");
const jwt = require("jsonwebtoken");
const { Email } = require("../helper/Mail");
const { verifyAccessToken } = require("../helper/jwt_helper");
const checkAuthorization = async (req, res, next) => {
  if (!req.headers["authorization"]) {
      return res.status(400).json({
          success: false,
          message: "User Needs to Login to Perform this Action",
      });
  }
  const fnd = await Token.findOne({ Token: req.headers["authorization"].split(" ")[1] });//
  if (!fnd) {
      return res.status(404).send("Login to Perform this Action");
  }
};//
// const checkAdmin = async (req, res, next) => {
//   verifyAccessToken(req, res, async (err) => {
//       if (err) {
//           return res.status(401).json({
//               error: "Unauthorized: Invalid Access Token. Please Login to Access this Feature",
//           });
//       }
//       const userId = req.payload.aud;
//       const findAdmin = await Admin.findById(userId);
//       if (!findAdmin) {
//           return res.status(401).json({ message: "You are not authorized to perform this action" });
//       }
//       next();
//   });
// };
module.exports.Order = async (req, res) => {
  try {
    if (!req.headers["authorization"]) {
      return res.status(400).json({
          success: false,
          message: "User Needs to Login to Perform this Action",
      });
  }
  const fnd = await Token.findOne({ Token: req.headers["authorization"].split(" ")[1] });//
  if (!fnd) {
      return res.status(404).send("Login to Perform this Action");
  }
    
    try {
      verifyAccessToken(req, res, async (err) => {
        if (err) {
          return res
            .status(401)
            .json({
              error:
                "Unauthorized: Invalid access token Login TO get Your Details",//
            });
        }
        const userId = req.payload.aud;
        const user = await User.find({ _id: userId });
        const validatingemail=user.length>0?true:false;
        if(validatingemail){
        await Order.create({
          UserId: userId,
          orderDate: new Date(),
          totalPrice: req.body.totalPrice,
          shippingAddress: req.body.shippingAddress,
          orderdata: req.body.data,
          PaymentMode: req.body.PaymentMode,
        });
        
        Email(
          user[0].Email,
          "Yoy Your Order placed 😎",
          "<b>You order have been placed thank you <br/> your order will be reach to you at the earliest</b>"
        );
        return res.json({ success: true });
        }else{
          return res.send("you are not a valid user")
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error in." });
    }
  } catch (error) {
    console.log(error, "error in catch");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error out." });
  }
}; 
module.exports.dashboardData = async (req, res) => {
  try {
    if (!req.headers["authorization"]) {
      return res.status(400).json({
          success: false,
          message: "User Needs to Login to Perform this Action",
      });
  }
  const fnd = await Token.findOne({ Token: req.headers["authorization"].split(" ")[1] });//
  if (!fnd) {
      return res.status(404).send("Login to Perform this Action");
  }

    try {
      verifyAccessToken(req, res, async (err) => {
        if (err) {
          return res
            .status(401)
            .json({
              error:
                "Unauthorized: Invalid access token Login TO get Your Details",
            });
        }
        const userId = req.payload.aud;
        const findAdminId=await Admin.findById(userId)
        if(!findAdminId){
          return res.status(401).json({message:"you are not authorized to see this details"})
        }
      const { UserId, fromDate, toDate } = req.body;
      const currentDate = new Date();
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      const startOfWeek = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - (currentDate.getDay() - 1)
      );
      const endOfWeek = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + (7 - currentDate.getDay())
      );
      // console.log(startOfWeek,endOfWeek)

      const generatePipeline = (startDate, endDate) => {
        const matchConditions = {
          ...(UserId && { UserId }),
          ...(fromDate &&
            toDate && {
              orderDate: { $gte: new Date(fromDate), $lt: new Date(toDate) },
            }),
        };

        const pipeline = [{ $match: matchConditions }];
        if (startDate !== null && endDate !== null) {
          pipeline.push({
            $match: { orderDate: { $gte: startDate, $lt: endDate } },
          });
        }

        pipeline.push({
          $group: {
            _id: null,
            averageOrderPrice: { $avg: "$totalPrice" },
            Revenue: { $sum: "$totalPrice" },
            Orders: { $sum: 1 },
            ItemsOrdered: { $sum: { $size: "$orderdata" } },
          },
        });

        return pipeline;
      };

      const totalOrderPricePipeline = generatePipeline(null, null);
      const monthStatsPipeline = generatePipeline(
        firstDayOfMonth,
        lastDayOfMonth
      );
      const weekStatsPipeline = generatePipeline(startOfWeek, endOfWeek);

      const [totalOrderPrice, thisMonthStats, thisWeekStats] =
        await Promise.all([
          Order.aggregate(totalOrderPricePipeline),
          Order.aggregate(monthStatsPipeline),
          Order.aggregate(weekStatsPipeline),
        ]);

      const responseData = {
        totalOrderPrice: totalOrderPrice[0],
        thisMonthStats: thisMonthStats[0],
        thisWeekStats: thisWeekStats[0],
      };

      res.json(responseData);
    })
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.log(error, "error in catch");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error out." });
  }
};

module.exports.Myorder = async (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      const orders = await Order.find();
      res.send(orders);
    } else {
      verifyAccessToken(req, res, async (err) => {
        if (err) {
          return res
            .status(401)
            .json({
              error:
                "Unauthorized: Invalid access token Login TO get Your Details",
            });
        }
        const fnd = await Token.findOne({
          Token: req.headers["authorization"].split(" ")[1],
        });
        if (!fnd) {
          return res.status(404).send("Login to Get Your Order");
        }
        const Phone = req.payload.aud;
        const user = await User.find({ _id: Phone });
        if(user.length>0){
          const orders = await Order.find({ UserId: Phone });
          return res.send(orders.reverse());
        }
        res.send("You are not a valid user")
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
module.exports.adminOrders=async(req,res)=>{
  try {
    if (!req.headers["authorization"]) {
      return res.status(400).json({
          success: false,
          message: "User Needs to Login to Perform this Action",
      });
  }
  const fnd = await Token.findOne({ Token: req.headers["authorization"].split(" ")[1] });//
  if (!fnd) {
      return res.status(404).send("Login to Perform this Action");
  }
    try {
      verifyAccessToken(req, res, async (err) => {
        if (err) {
          return res
            .status(401)
            .json({
              error:
                "Unauthorized: Invalid access token Login TO get Your Details",
            });
        }
        const userId = req.payload.aud;
        const user = await Admin.find({ _id: userId });
        const validatingemail=user.length>0?true:false;
        if(validatingemail){
        const data=await Order.find({Status:"Pending"})
        return res.json({ success: true,data:data });
        }else{
          return res.send("you are not a valid user")
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error in." });
    }
  } catch (error) {
    res.status(401).send("error ocured")
  }
}
module.exports.updateOrderDetails=async(req,res)=>{
  try {
    if (!req.headers["authorization"]) {
      return res.status(400).json({
          success: false,
          message: "User Needs to Login to Perform this Action",
      });
  }
  const fnd = await Token.findOne({ Token: req.headers["authorization"].split(" ")[1] });//
  if (!fnd) {
      return res.status(404).send("Login to Perform this Action");
  }
    try {
      verifyAccessToken(req, res, async (err) => {
        if (err) {
          return res
            .status(401)
            .json({
              error:
                "Unauthorized: Invalid access token Login TO get Your Details",
            });
        }
        const userId = req.payload.aud;
        const user = await Admin.find({ _id: userId });
        const validatingemail=user.length>0?true:false;
        if(validatingemail){
          const {oid}=req.params;
        const currentOrder=await Order.find({_id:oid})
        const userId=currentOrder[0].UserId;
        const userdata=await User.findById(userId)
        const useremail=userdata.Email
        const updateddata=await Order.findByIdAndUpdate(
          oid,
          {
            Status:req.body.Status
        },
        { new: true }
        )
        if(!updateddata){
          return res.status(404).json({ success: false, message: 'Document not found' });
      }
        Email(
          useremail,
          "The Wait is Over Buddy 🫠",
          `<b>your order is updated${req.body.Status}</b>`
        );
        return res.json({ success: true,data:updateddata});
        }else{
          return res.send("you are not a valid user")
        }
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error in." });
    }
  } catch (error) {
    res.status(401).send("error ocured")
  }
}