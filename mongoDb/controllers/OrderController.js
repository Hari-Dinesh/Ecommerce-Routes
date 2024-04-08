import Order from "../Models/orderModel.js";
import User from "../Models/UserModel.js";
import Admin from "../Models/adminModel.js";
import { Email } from "../helper/Mail.js";
import { ObjectId } from 'mongodb';

class OrderController {
  static async Order(req, res) {
    try {
      const userId = req.payload.aud;
      const user = await User.findById(userId);
      if(!user.Email){
        return res.status(404).json({status:true,message:"Email Not Found Update Your Page"})
      }
      await Order.create({
        UserId: userId,
        orderDate: new Date(),
        totalPrice: req.body.totalPrice,
        shippingAddress: req.body.shippingAddress,
        orderdata: req.body.data,
        PaymentMode: req.body.PaymentMode,
      });
      
      await Email(
        user.Email,
        "Yoy Your Order placed 😎",
        "<b>You order have been placed thank you <br/> your order will be reach to you at the earliest</b>"
      );
      res.json({ Status:200,success: true,message:"Email Sent Sucessfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error out." });
    }
  }

  static async dashboardData(req, res) {
    try {
      const { UserId, fromDate, toDate } = req.body;
      if(typeof UserId!='undefined'){
        if(!UserId){
          return res.send("Not a correct user id")
        }
      }
      
      if(fromDate>toDate){
        return res.send("Input Date Format is Incorrect")
      }
      
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
      console.log(error)
      return res
        .status(500)
        .json({ success: false, message: "Internal server error out." });
    }
  }

  static async Myorder(req, res, next) {
    try {
      const UserId = req.payload.aud;
      const orders = await Order.find({UserId:UserId});
      res.send(orders.reverse());
    
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async adminOrders(req, res) {
    try {
      const data = await Order.find({Status : { $in: ["Pending", "Out for delivery"] }});
      res.json({ success: true, data: data });
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({ success: false, message: "Internal server error in." });
    }
  }

  static async updateOrderDetails(req, res) {
    try {
        const { oid } = req.params; //oid=>orderId
        if(!ObjectId.isValid(oid)){
          return res.send("Incorrect orderId")
        }
        const currentOrder = await Order.findById(oid);
        if(!currentOrder){
          return res.send("There is a error in order ID")
        }
        if(!req.body.Status){
          return res.send('Status need to be updated ')
        }
        if(currentOrder.Status===req.body.Status){
          return res.send("not a valid request")
        }
        const userId = currentOrder.UserId;
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
        await Email(
          useremail,
          "The Wait is Over Buddy 🫠",
          `<b>your order is updated${req.body.Status}</b>`
        );
        res.json({ success: true, data: updateddata });
      } 
    catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error in." });
    }
  }
}

export {OrderController};
