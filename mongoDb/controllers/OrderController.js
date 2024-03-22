let Order = require("../Models/orderModel");
const Token=require('../Models/Token')
var validateDate = require("validate-date"); //
let { isDate } = require('validator');
const jwt=require('jsonwebtoken')
// const {verifyAccessToken}=require('../helper/jwt_helper')
module.exports.Order = async (req, res) => {
  try {
    if (!req.headers['authorization']) {
      return res
        .status(400)
        .json({ success: false, message: "User Needed Login To Place the Order" });
    }
    const fnd=await Token.findOne({Token:req.headers['authorization'].split(" ")[1]})
        if(!fnd){
          return res.status(404).send('Login to Place Your Order');
        }

    try {
      
      await Order.create({
        UserId: fnd.id,
        orderDate: new Date(),
        totalPrice: req.body.totalPrice,
        shippingAddress: req.body.shippingAddress,
        orderdata: [req.body.data],
      });
      return res.json({ success: true });
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
};//
//
// module.exports.dashboardData = async (req, res) => {
//   try {
//     const userPhoneNumber = req.body.Phone;
//     const currentDate = new Date();
//     const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//     const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
//     const fromDate = req.body.fromDate?new Date(req.body.fromDate):"";
//     const toDate = req.body.toDate?new Date(req.body.toDate):"";

//     let totalOrderPrice = [];
//     let thisMonthStats = [];
//     let thisWeekStats = [];

//     if (userPhoneNumber && fromDate && toDate) {
//       console.log(fromDate)
//       console.log(userPhoneNumber,"in if")
//       totalOrderPrice = await Order.aggregate([
//         {
//           $match: {
//             Phone: userPhoneNumber,
//             orderDate: {
//               $gte: fromDate,
//               $lt: toDate,
//             },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             averageOrderPrice: { $avg: "$totalPrice" },
//             totalRevenue: { $sum: "$totalPrice" },
//           },
//         },
//       ]);

//       thisMonthStats = await Order.aggregate([
//         {
//           $match: {
//             Phone: userPhoneNumber,
//             orderDate: {
//               $gte: firstDayOfMonth,
//               $lt: lastDayOfMonth,
//             },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             thisMonthRevenue: { $sum: "$totalPrice" },
//             monthOrders: { $sum: 1 },
//             ItemdOrderWeek: { $sum: { $size: "$orderdata" } },
//           },
//         },
//       ]);

//       thisWeekStats = await Order.aggregate([
//         {
//           $match: {
//             Phone: userPhoneNumber,
//             orderDate: {
//               $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() - 1)),
//               $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay())),
//             },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             thisWeekRevenue: { $sum: "$totalPrice" },
//             weekNumberOfOrders: { $sum: 1 },
//             numberOfItemsOrderWeek: { $sum: { $size: "$orderdata" } },
//           },
//         },
//       ]);
//     } else if (userPhoneNumber) {
//       console.log(userPhoneNumber,"in el1")
//       totalOrderPrice = await Order.aggregate([   
//       {
//         $match: {
//           Phone: userPhoneNumber,
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           averageOrderPrice: { $avg: "$totalPrice" },
//           totalRevenue: { $sum: "$totalPrice" },
//         },
//       },
//     ]);

//       thisMonthStats = await Order.aggregate([
//         {
//           $match: {
//             Phone: userPhoneNumber,
//             orderDate: {
//               $gte: firstDayOfMonth,
//               $lt: lastDayOfMonth,
//             },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             thisMonthRevenue: { $sum: "$totalPrice" },
//             monthOrders: { $sum: 1 },
//             ItemdOrderWeek: { $sum: { $size: "$orderdata" } },
//           },
//         },
//       ]);

//       thisWeekStats = await Order.aggregate([
//         {
//           $match: {
//             Phone: userPhoneNumber,
//             orderDate: {
//               $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() - 1)),
//               $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay())),
//             },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             thisWeekRevenue: { $sum: "$totalPrice" },
//             weekNumberOfOrders: { $sum: 1 },
//             numberOfItemsOrderWeek: { $sum: { $size: "$orderdata" } },
//           },
//         },
//       ]);
//     } else if (fromDate && toDate) {
//       totalOrderPrice = await Order.aggregate([
//         {
//           $match: {
//             orderDate: {
//               $gte: fromDate,
//               $lt: toDate,
//             },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             averageOrderPrice: { $avg: "$totalPrice" },
//             totalRevenue: { $sum: "$totalPrice" },
//           },
//         },
//       ]);

//       thisMonthStats = await Order.aggregate([
//         {
//           $match: {
//             orderDate: {
//               $gte: firstDayOfMonth,
//               $lt: lastDayOfMonth,
//             },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             thisMonthRevenue: { $sum: "$totalPrice" },
//             monthOrders: { $sum: 1 },
//             ItemdOrderWeek: { $sum: { $size: "$orderdata" } },
//           },
//         },
//       ]);

//       thisWeekStats = await Order.aggregate([
//         {
//           $match: {
//             orderDate: {
//               $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() - 1)),
//               $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay())),
//             },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             thisWeekRevenue: { $sum: "$totalPrice" },
//             weekNumberOfOrders: { $sum: 1 },
//             numberOfItemsOrderWeek: { $sum: { $size: "$orderdata" } },
//           },
//         },
//       ]);
//     } else {
//       totalOrderPrice = await Order.aggregate([
//         {
//           $group: {
//             _id: null,
//             averageOrderPrice: { $avg: "$totalPrice" },
//             totalRevenue: { $sum: "$totalPrice" },
//           },
//         },
//       ]);

//       thisMonthStats = await Order.aggregate([
//         {
//           $match: {
//             orderDate: {
//               $gte: firstDayOfMonth,
//               $lt: lastDayOfMonth,
//             },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             thisMonthRevenue: { $sum: "$totalPrice" },
//             monthOrders: { $sum: 1 },
//             ItemdOrderWeek: { $sum: { $size: "$orderdata" } },
//           },
//         },
//       ]);

//       thisWeekStats = await Order.aggregate([
//         {
//           $match: {
//             orderDate: {
//               $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() - 1)),
//               $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay())),
//             },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             thisWeekRevenue: { $sum: "$totalPrice" },
//             weekNumberOfOrders: { $sum: 1 },
//             numberOfItemsOrderWeek: { $sum: { $size: "$orderdata" } },
//           },
//         },
//       ]);
//     }

//     const responseData = {
//       totalOrderPrice: totalOrderPrice[0],
//       thisMonthStats: thisMonthStats[0],
//       thisWeekStats: thisWeekStats[0],
//     };

//     res.json(responseData);
//   } catch (error) {
//     console.error("An error occurred:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };
//

//type-2

// module.exports.dashboardData = async (req, res) => {
//   try {
//     const { Phone, fromDate, toDate } = req.body;
//     const currentDate = new Date();
//     const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//     const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
//     const matchConditions = {
//       ...(Phone && { Phone }),
//       ...(fromDate && toDate && { orderDate: { $gte: new Date(fromDate), $lt: new Date(toDate) } })
//     };
//     const groupConditions = {
//       _id: null,
//       averageOrderPrice: { $avg: "$totalPrice" },
//       Revenue: { $sum: "$totalPrice" },
//       Orders: { $sum: 1 },
//       ItemsOrdered: { $sum: { $size: "$orderdata" } } 
//     };

//     const totalOrderPricePipeline = [
//       { $match: matchConditions },
//       { $group: groupConditions }
//     ];
//     const monthStatsPipeline = [
//       { $match: { ...matchConditions, orderDate: { $gte: firstDayOfMonth, $lt: lastDayOfMonth } } },
//       { $group: groupConditions }
//     ];

//     const weekStatsPipeline = [
//       { $match: { ...matchConditions, orderDate: { $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() - 1)), $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay())) } } },
//       { $group: groupConditions }
//     ];

//     const [totalOrderPrice, thisMonthStats, thisWeekStats] = await Promise.all([
//       Order.aggregate(totalOrderPricePipeline),
//       Order.aggregate(monthStatsPipeline),
//       Order.aggregate(weekStatsPipeline)
//     ]);

//     const responseData = {
//       totalOrderPrice: totalOrderPrice[0],
//       thisMonthStats: thisMonthStats[0],
//       thisWeekStats: thisWeekStats[0],
//     };

//     res.json(responseData);
//   } catch (error) {
//     console.error("An error occurred:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };


//type-3.o
module.exports.dashboardData = async (req, res) => {
  try {
    const { UserId, fromDate, toDate } = req.body;
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() - 1))
    const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay()))
    // console.log(startOfWeek,endOfWeek)

    const generatePipeline = (startDate, endDate) => {
      const matchConditions = {
        ...(UserId && { UserId }),
        ...(fromDate && toDate && { orderDate: { $gte: new Date(fromDate), $lt: new Date(toDate) } })
      };

      const pipeline = [
        { $match: matchConditions }
      ];
      if (startDate !== null && endDate !== null) {
        pipeline.push({ $match: { orderDate: { $gte: startDate, $lt: endDate } } });
      }

      pipeline.push({
        $group: {
          _id: null,
          averageOrderPrice: { $avg: "$totalPrice" },
          Revenue: { $sum: "$totalPrice" },
          Orders: { $sum: 1 },
          ItemsOrdered: { $sum: { $size: "$orderdata" } }
        }
      });

      return pipeline;
    };

    const totalOrderPricePipeline = generatePipeline(null, null);
    const monthStatsPipeline = generatePipeline(firstDayOfMonth, lastDayOfMonth);
    const weekStatsPipeline = generatePipeline(startOfWeek, endOfWeek);

    const [totalOrderPrice, thisMonthStats, thisWeekStats] = await Promise.all([
      Order.aggregate(totalOrderPricePipeline),
      Order.aggregate(monthStatsPipeline),
      Order.aggregate(weekStatsPipeline)
    ]);

    const responseData = {
      totalOrderPrice: totalOrderPrice[0],
      thisMonthStats: thisMonthStats[0],
      thisWeekStats: thisWeekStats[0],
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};


//type-3
// module.exports.dashboardData = async (req, res) => {
//   try {
//     const { Phone, fromDate, toDate } = req.body;
//     const currentDate = new Date();
//     const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//     const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
//     const startOfWeek = new Date(currentDate);
//     startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
//     const endOfWeek = new Date(currentDate);
//     endOfWeek.setDate(startOfWeek.getDate() + 6);

//     const generatePipeline = (startDate, endDate) => [
//       { $match: { ...(Phone && { Phone }), ...(fromDate && toDate && { orderDate: { $gte: new Date(fromDate), $lt: new Date(toDate) } }) } },
//       { $match: { orderDate: { $gte: startDate, $lt: endDate } } },
//       { $group: { _id: null, averageOrderPrice: { $avg: "$totalPrice" }, Revenue: { $sum: "$totalPrice" }, Orders: { $sum: 1 }, ItemdOrder: { $sum: { $size: "$orderdata" } } } }
//     ];

//     const totalOrderPricePipeline = generatePipeline(null, null);
//     const monthStatsPipeline = generatePipeline(firstDayOfMonth, lastDayOfMonth);
//     const weekStatsPipeline = generatePipeline(startOfWeek, endOfWeek);

//     const [totalOrderPrice, thisMonthStats, thisWeekStats] = await Promise.all([
//       Order.aggregate(totalOrderPricePipeline),
//       Order.aggregate(monthStatsPipeline),
//       Order.aggregate(weekStatsPipeline)
//     ]);

//     const responseData = {
//       totalOrderPrice: totalOrderPrice[0],
//       thisMonthStats: thisMonthStats[0],
//       thisWeekStats: thisWeekStats[0],
//     };

//     res.json(responseData);
//   } catch (error) {
//     console.error("An error occurred:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };
const { verifyAccessToken } = require('../helper/jwt_helper');

module.exports.Myorder = async (req, res, next) => {
  try {
    if(!req.headers['authorization']){
      const orders = await Order.find();
    res.send(orders);
    }
    else{
      verifyAccessToken(req, res, async (err) => {
        if (err) {
          return res.status(401).json({ error: 'Unauthorized: Invalid access token' });
        }
        const fnd=await Token.findOne({Token:req.headers['authorization'].split(" ")[1]})
        if(!fnd){
          return res.status(404).send('Login to Get Your Order');
        }
        const Phone = req.payload.aud;
        
        const orders = await Order.find({ UserId:Phone });
        res.send(orders);
      });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};