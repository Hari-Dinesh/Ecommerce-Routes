let Order = require("../Models/orderModel");
var validateDate = require("validate-date"); //
let { isDate } = require('validator');
module.exports.Order = async (req, res) => {
  let { data } = req.body;
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
    const userPhoneNumber = req.body.Phone;
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const fromDate = req.body.fromDate?new Date(req.body.fromDate):"";
    const toDate = req.body.toDate?new Date(req.body.toDate):"";

    let totalOrderPrice = [];
    let thisMonthStats = [];
    let thisWeekStats = [];

    if (userPhoneNumber && fromDate && toDate) {
      console.log(fromDate)
      console.log(userPhoneNumber,"in if")
      totalOrderPrice = await Order.aggregate([
        {
          $match: {
            Phone: userPhoneNumber,
            orderDate: {
              $gte: fromDate,
              $lt: toDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            averageOrderPrice: { $avg: "$totalPrice" },
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
      ]);

      thisMonthStats = await Order.aggregate([
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
            monthOrders: { $sum: 1 },
            ItemdOrderWeek: { $sum: { $size: "$orderdata" } },
          },
        },
      ]);

      thisWeekStats = await Order.aggregate([
        {
          $match: {
            Phone: userPhoneNumber,
            orderDate: {
              $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() - 1)),
              $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay())),
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
    } else if (userPhoneNumber) {
      console.log(userPhoneNumber,"in el1")
      totalOrderPrice = await Order.aggregate([   
      {
        $match: {
          Phone: userPhoneNumber,
        },
      },
      {
        $group: {
          _id: null,
          averageOrderPrice: { $avg: "$totalPrice" },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

      thisMonthStats = await Order.aggregate([
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
            monthOrders: { $sum: 1 },
            ItemdOrderWeek: { $sum: { $size: "$orderdata" } },
          },
        },
      ]);

      thisWeekStats = await Order.aggregate([
        {
          $match: {
            Phone: userPhoneNumber,
            orderDate: {
              $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() - 1)),
              $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay())),
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
    } else if (fromDate && toDate) {
      totalOrderPrice = await Order.aggregate([
        {
          $match: {
            orderDate: {
              $gte: fromDate,
              $lt: toDate,
            },
          },
        },
        {
          $group: {
            _id: null,
            averageOrderPrice: { $avg: "$totalPrice" },
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
      ]);

      thisMonthStats = await Order.aggregate([
        {
          $match: {
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
            monthOrders: { $sum: 1 },
            ItemdOrderWeek: { $sum: { $size: "$orderdata" } },
          },
        },
      ]);

      thisWeekStats = await Order.aggregate([
        {
          $match: {
            orderDate: {
              $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() - 1)),
              $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay())),
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
    } else {
      totalOrderPrice = await Order.aggregate([
        {
          $group: {
            _id: null,
            averageOrderPrice: { $avg: "$totalPrice" },
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
      ]);

      thisMonthStats = await Order.aggregate([
        {
          $match: {
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
            monthOrders: { $sum: 1 },
            ItemdOrderWeek: { $sum: { $size: "$orderdata" } },
          },
        },
      ]);

      thisWeekStats = await Order.aggregate([
        {
          $match: {
            orderDate: {
              $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() - 1)),
              $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay())),
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
    }

    const responseData = {
      totalOrderPrice: totalOrderPrice[0],
      thisMonthStats: thisMonthStats[0],
      thisWeekStats: thisWeekStats[0],
    };

    res.json(responseData);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }
};
