const Order = require("../Models/orderModel");
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
        orderDate: req.body.orderDate,
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

