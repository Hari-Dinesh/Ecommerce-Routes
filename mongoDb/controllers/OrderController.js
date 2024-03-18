const Order = require("../Models/orderModel");
module.exports.Order = async (req, res) => {
  const {data}=req.body
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
    const date=new Date();
    console.log(date)
    // for (let i = 0; i < data.length; i++) {
    //   console.log(i);
    //   for (let j = 0; j < data[i].orderdata.length; j++) {
    //     const [dd, mm, yyyy] = data[i].orderdata[j][0].Order_date.split("/");
    //     const date = new Date(`${mm}/${dd}/${yyyy}`);
    //     const isInMonth = isInCurrentMonth(date);
    //     const isInWeek = isInCurrentWeek(date);
    //     if (isInMonth) {
    //       ThisMonthRevenue += data[i].orderdata[j][0].Total_price;
    //       NumberOfItemsOrderMonth += data[i].orderdata[j].length - 1;
    //       MonthNumberOfOrders++;
    //     }
    //     if (isInWeek) {
    //       THisWeekRevenue = data[i].orderdata[j][0].Total_Price;
    //       NumberOfItemsOrderWeek += data[i].orderdata[j].length - 1;
    //       WeekNumberOfOrder++;
    //     }
    //   }
    // }
    const averageOrderPrice = await Order.aggregate([
      {
        $group: {
          _id: null,
          averageTotalPrice: { $avg: "$totalPrice" },
        },
      },
    ]);
const thisMonthStats = await Order.aggregate([
  {
    $match: {
      orderDate: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), 
        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) 
      }
    }
  },
  {
    $group: {
      _id: null,
      ThisMonthRevenue: { $sum: "$orderdata.totalPrice" }, 
      MonthNumberOfOrders: { $sum: 1 }, 
      NumberOfItemsOrderMonth: { $sum: { $size: "$orderdata" } } 
    }
  }
]);


const thisWeekStats = await Order.aggregate([
  {
    $match: {
      orderDate: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - (new Date().getDay() - 1)), 
        $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + (7 - new Date().getDay())) 
      }
    }
  },
  {
    $group: {
      _id: null,
      ThisWeekRevenue: { $sum: "$orderdata.totalPrice" }, 
      WeekNumberOfOrders: { $sum: 1 }, 
      NumberOfItemsOrderWeek: { $sum: { $size: "$orderdata" } } 
    }
  }
]);


console.log("This Month Stats:", thisMonthStats);
console.log("This Week Stats:", thisWeekStats);


const thisMonthRevenue = thisMonthStats.length > 0 ? thisMonthStats[0].ThisMonthRevenue : 0;
const monthNumberOfOrders = thisMonthStats.length > 0 ? thisMonthStats[0].MonthNumberOfOrders : 0;
const numberOfItemsOrderMonth = thisMonthStats.length > 0 ? thisMonthStats[0].NumberOfItemsOrderMonth : 0;

const thisWeekRevenue = thisWeekStats.length > 0 ? thisWeekStats[0].ThisWeekRevenue : 0;
const weekNumberOfOrders = thisWeekStats.length > 0 ? thisWeekStats[0].WeekNumberOfOrders : 0;
const numberOfItemsOrderWeek = thisWeekStats.length > 0 ? thisWeekStats[0].NumberOfItemsOrderWeek : 0;

console.log("This Month Revenue:", thisMonthRevenue);
console.log("Month Number of Orders:", monthNumberOfOrders);
console.log("Number of Items Ordered This Month:", numberOfItemsOrderMonth);
console.log("This Week Revenue:", thisWeekRevenue);
console.log("Week Number of Orders:", weekNumberOfOrders);
console.log("Number of Items Ordered This Week:", numberOfItemsOrderWeek);

    
    console.log("this is Totoa",totalRevenue);
    const responseData = {
      ThisMonthRevenue,
      MonthNumberOfOrders,
      NumberOfItemsOrderMonth,
      ThisWeekRevenue,
      WeekNumberOfOrders,
      NumberOfItemsOrderWeek,
    };

    res.json({
      responseData,
      averageTotalPrice: averageResult[0].averageTotalPrice,
    });
  } catch (error) {
    res.send(error);
  }
};
