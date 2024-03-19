const Order = require("../Models/orderModel");
var validateDate = require("validate-date");//
module.exports.Order = async (req, res) => {
  const { data } = req.body;
  try {
    if (!req.body.Phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number is required." });
    }

    try {
      await Order.create({
        Phone: req.body.Phone,
        orderDate: new Date(),
        totalPrice: req.body.totalPrice,
        shippingAddress: req.body.shippingAddress,
        orderdata: [req.body.data],
      });
      return res.json({ success: true });
    } catch (error) {
      console.log(error, "in create");
      return res
        .status(500)
        .json({ success: false, message: "Internal server error." });
    }
  } catch (error) {
    console.log(error, "error in catch");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
//
module.exports.dashboardData = async (req, res) => {
  try {
    let data = await Order.find();
    const date = new Date();
    console.log(date);
  
    const totalOrderPrice = await Order.aggregate([
      {
        $group: {
          _id: null,
          averageOrderPrice: { $avg: "$totalPrice" },
          totalRevenue: { $sum: "$totalPrice" }
        },
      },
    ]);

    const thisMonthStats = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            $lt: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0
            ),
          },
        },
      },
      {
        $group: {
          _id: null,
          thisMonthRevenue: { $sum: "$totalPrice" },
          monthNumberOfOrders: { $sum: 1 },
          numberOfItemsOrderMonth: { $sum: { $size: "$orderdata" } },
        },
      },
    ]);

    const thisWeekStats = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() - (new Date().getDay() - 1)
            ),
            $lt: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() + (7 - new Date().getDay())
            ),
          },
        },
      },
      {
        $group: {
          _id: null,
          thisWeekRevenue: { $sum: "$totalPrice" },
          weekNumberOfOrders: { $sum: 1 },
          numberOfItemsOrderWeek: { $sum: { $size: "$orderdata" } },
        },
      },
    ]);

    console.log("This Month Stats:", thisMonthStats);
    console.log("This Week Stats:", thisWeekStats);
    const responseData = {
      totalOrderPrice: totalOrderPrice[0], 
      thisMonthStats: thisMonthStats[0], 
      thisWeekStats: thisWeekStats[0] 
    };

    res.json(responseData);
  } catch (error) {
    res.send(error);
  }
};

module.exports.userDashBoard=async(req,res)=>{
  const userPhoneNumber=req.body.Phone;
  const currentDate = new Date();
const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
console.log(firstDayOfMonth)
  const thisMonthStatsOfUser = await Order.aggregate([
    {
      $match: {
        Phone: userPhoneNumber,
        orderDate: {
          $gte: firstDayOfMonth,
          $lt: lastDayOfMonth,  
        },
      },

    },
    {
      $group: {
        _id: null, 
        thisMonthRevenue: { $sum: "$totalPrice" },
        monthOrders:{$sum: 1},
        ItemdOrderWeek:{ $sum: { $size: "$orderdata" } },//
      },
    },
  ]);
  const thisWeekStats = await Order.aggregate([
    {
      $match: {
        Phone:userPhoneNumber,//
        orderDate: {
          $gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - (new Date().getDay() - 1)
          ),
          $lt: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() + (7 - new Date().getDay())
          ),
        },
      },
    },
    {
      $group: {
        _id:null, 
        thisWeekRevenue: { $sum: "$totalPrice" },
        weekNumberOfOrders: { $sum: 1 },
        numberOfItemsOrderWeek: { $sum: { $size: "$orderdata" } },
      },
    },
  ])
  const userDashDetails={
    thismonth:thisMonthStatsOfUser[0],
    thisweek:thisWeekStats[0]
  }
  res.json(userDashDetails)
}
module.exports.dateDashboard = async (req, res) => {
  try {
    if(!validateDate(req.body.fromDate,responseType="boolean")&&!validateDate(req.body.toDate,responseType="boolean")){//
      return res.send("Enter the valid Date Format")
    }
    const fromDate = new Date(req.body.fromDate);
    const toDate = new Date(req.body.toDate);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {//checking the date is ?
      return res.status(400).json({ error: "Invalid date format" });
    }
    if(fromDate>toDate){
      return res.status(400).json({err:"enter valid from date"})//error handled heree....
    }
    
    const dateOutput = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: fromDate,
            $lt: toDate,
          },
        },
      },
      {
        $group: {//
          _id: null,
          Revenue: { $sum: "$totalPrice" },
          NumberOfOrders: { $sum: 1 },
          numberOfItemsOrdered: { $sum: { $size: "$orderdata" } },
        },
      },
    ]);
    const aggregatedData = dateOutput.length > 0 ? dateOutput[0] : {};//

    return res.json(aggregatedData);
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
