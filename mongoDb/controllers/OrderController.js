import Order from "../Models/orderModel.js";
import User from "../Models/UserModel.js";
import Admin from "../Models/adminModel.js";
import { Email } from "../helper/Mail.js";


class OrderController {
  static async Order(req, res) {
    try {
      const userId = req.payload.aud;
      const user = await User.findById(userId);
      await Order.create({
        UserId: userId,
        orderDate: new Date(),
        totalPrice: req.body.totalPrice,
        shippingAddress: req.body.shippingAddress,
        orderdata: req.body.data,
        PaymentMode: req.body.PaymentMode,
      });

      Email(
        user.Email,
        "Yoy Your Order placed 😎",
        "<b>You order have been placed thank you <br/> your order will be reach to you at the earliest</b>"
      );
      res.json({ success: true });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error out." });
    }
  }

  static async dashboardData(req, res) {
    try {
      const { UserId, fromDate, toDate } = req.body;
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() - 1));
      const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay()));

      const generatePipeline = (startDate, endDate) => {
        const matchConditions = {
          ...(UserId && { UserId }),
          ...(fromDate && toDate && { orderDate: { $gte: new Date(fromDate), $lt: new Date(toDate) } }),
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
      const monthStatsPipeline = generatePipeline(firstDayOfMonth, lastDayOfMonth);
      const weekStatsPipeline = generatePipeline(startOfWeek, endOfWeek);

      const [totalOrderPrice, thisMonthStats, thisWeekStats] = await Promise.all([
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
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error out." });
    }
  }

  static async Myorder(req, res, next) {
    try {
      const Phone = req.payload.aud;
      const user = await User.find({ _id: Phone });
      if (user.length > 0) {
        const orders = await Order.find({ UserId: Phone });
        return res.send(orders.reverse());
      }
      res.send("You are not a valid user");
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async adminOrders(req, res) {
    try {
      const userId = req.payload.aud;
      const user = await Admin.find({ _id: userId });
      const validatingemail = user.length > 0 ? true : false;
      if (validatingemail) {
        const data = await Order.find({ Status: "Pending" });
        return res.json({ success: true, data: data });
      } else {
        return res.send("you are not a valid user");
      }
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error in." });
    }
  }

  static async updateOrderDetails(req, res) {
    try {
        const { oid } = req.params;
        const currentOrder = await Order.find({ _id: oid });
        const userId = currentOrder[0].UserId;
        const userdata = await User.findById(userId);
        const useremail = userdata.Email;
        const updateddata = await Order.findByIdAndUpdate(
          oid,
          {
            Status: req.body.Status,
          },
          { new: true }
        );
        if (!updateddata) {
          return res.status(404).json({ success: false, message: 'Document not found' });
        }
        Email(
          useremail,
          "The Wait is Over Buddy 🫠",
          `<b>your order is updated${req.body.Status}</b>`
        );
        return res.json({ success: true, data: updateddata });
      } 
    catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error in." });
    }
  }
}

export {OrderController};
