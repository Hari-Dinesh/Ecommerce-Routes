import Order from "../Models/orderModel.js";
import User from "../Models/UserModel.js";
import Cart from "../Models/cart.js";
import Product from "../Models/ProductModel.js";
import AllValidationSchema from "../helper/All_validation.js";
import { Email } from "../helper/Mail.js";
import { ObjectId } from 'mongodb';
const finalPlaceOrder=async(req,res,data,userId)=>{
      const user = await User.findById(userId);
      let totalPrice=0;
      const value= data.map(async x=>{
        const product=await Product.findById(x.productId)
        totalPrice+=(x.quantity)*(product.sellingPrice)
      })
      await Promise.all(value)
      await Order.create({
        UserId: userId,
        orderDate: new Date(),
        totalPrice: totalPrice,
        shippingAddress: user.Address,
        orderdata: data,
        PaymentMode: req.body.PaymentMode,
      });
      
      await Email(
        user.Email,
        "Yoy Your Order placed 😎",
        "<b>You order have been placed thank you <br/> your order will be reach to you at the earliest</b>"
      );
      
}
async function validateProduct(product) {
  const validationPromises = product.map(async (x) => {
    
    if (!ObjectId.isValid(x.productId)) {
      throw new Error("wrong producttt Id");
    }
    const foundProduct = await Product.findById(x.productId);
    if (!foundProduct) {
      throw new Error(`product id does not exist ${x.productId}`);
    }
    if (!x.quantity) {
      throw new Error("Incorrect quantity or quantity required");
    }
  });
  await Promise.all(validationPromises);
}
class OrderController {
  static async Order(req, res) {
    try {
      const userId = req.payload.aud;
      const data1=req.body.Item
      
      if(!Array.isArray(data1)||data1.length!=1){
        return res.status(301).send('Incorrect Item notation')
      }
      await validateProduct(data1)
      
      await finalPlaceOrder(req,res,data1,userId)
      res.status(201).json({status:201,success:true,message:"Order Placed YOY"})
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: error.message });
    }
  }

  static async dashboardData(req, res) {
    try {
      const value = await AllValidationSchema.validateAsync(req.body)
      let UserId;
      let location
      if(value.UserId){
        UserId=value.UserId
      }
      if(value.location){
        location=value.location
      }
      
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (currentDate.getDay() - 1));
      const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (7 - currentDate.getDay()));

      const generatePipeline = (startDate, endDate) => {
        const matchConditions = {
          ...(UserId && { UserId }),
          ...(location && { shippingAddress: { $regex: location, $options: 'i' } }),
          ...(value.fromDate && value.toDate && { orderDate: { $gte: new Date(value.fromDate), $lt: new Date(value.toDate) } }),
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
        },);

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
      const max_user=await Order.aggregate([
        [
          {
            $group: {
              _id: "$UserId",
              Orderscount:{$sum:1},
              totalValue: {
                $sum: "$totalPrice",
              },
            },
          },
          {
            $sort: {
              totalValue: -1,
            }, 
          },
          {
            $limit:5
          }
          
        ]
      ])

      res.status(201).json({status:201,success:true,Revenue_data:responseData,max_user});
    } catch (error) {
      if (error.isJoi === true) {
        return res.status(400).send("Validation error: " + error.message);
      }
      return res
        .status(500)
        .json({ success: false, message: "Internal server error out." });
    }
  }

  static async Myorder(req, res, next) {
    try {
      const UserId = req.payload.aud;
      const orders = await Order.find({UserId:UserId});
      if(!orders){
        return res.status(301).json({success:false,Status:301,message:"Incorrect Order Details"})
      }
    //   const data = await Promise.all(orders.map(async (ord) => {
    //     const orderData = ord.orderdata.map(async (prod) => {
    //         const product_here = await Product.findById(prod.productId);
    //         prod.product=product_here
    //         delete prod.productId
    //         return prod;
    //     });
       
    //    await Promise.all(orderData);
    // }));
    
      res.status(201).send(orders.reverse());
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async adminOrders(req, res) {
    try {
      const orders = await Order.find({Status : { $in: ["Pending", "Out for delivery"] }});
      if(!orders){
        return res.status(301).json({success:false,status:301,message:"Unable to Fetch the Data"})
      }
      await Promise.all(orders.map(async (ord) => {
        const orderData = ord.orderdata.map(async (prod) => {
            const product_here = await Product.findById(prod.productId);
            prod.product=product_here
            delete prod.productId
            return prod;
        });
        await Promise.all(orderData)
    }))
      res.status(201).json({ Status:201,success: true, data: orders });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error in." });
    }
  }

  static async updateOrderDetails(req, res) {
    try {
        const { oid } = req.params; //oid=>orderId
        if(!ObjectId.isValid(oid)){
          return res.status(401).send("Incorrect orderId")
        }
        const currentOrder = await Order.findById(oid);
        if(!currentOrder){
          return res.status(401).send("There is a error in order ID")
        }
        if(!req.body.Status){
          return res.status(401).send('Status need to be updated ')
        }
        // --------------------------------
        if (!['Pending', 'outForDelivery', 'Placed'].includes(req.body.Status)) {
          return res.status(400).send("Not a valid status");
      }
        if(currentOrder.Status===req.body.Status){
          return res.status(400).send("Status is already set to this value");
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

  static async addtoUserCart(req,res){
    try {
      const id=req.payload.aud;
    const {product}=req.body
    if(!Array.isArray(product)){
      return res.status(301).send('Incorrect Item notation')
    }
     if(product.length<1){
      return res.send("not a valid array")
     }
    await validateProduct(product)
    const data=await Cart.find({UserId:id});
    let updatedDate;
    if(data.length==0){
      updatedDate=await Cart.create({
        UserId:id,
        Products:[product]
      })
    }else{
      updatedDate=await Cart.findOneAndUpdate({UserId:id},
        {$push:{Products:product}})
    }
    if(updatedDate.length==0){
      return res.status(401).send("Not Updated")
    }
    res.status(201).send("saved")
    } catch (error) {
      res.status(401).json({status:401,message:error.message})
    }
  }

  static async placeMyCart(req,res){
    try {
    const {id}=req.params
    if(!ObjectId.isValid(id)){
      return res.status(401).send("Not a Valid Id")
    }
    const data=await Cart.findOne({UserId:id})
    if(data.Products.length==0){
      return res.status(302).json({message:"no item in the cart",status:302,success:false})
    }
    await finalPlaceOrder(req,res,data.Products,id)
    const cart=await Cart.findOneAndUpdate({UserId:id},{
      Products:[]
    })
    if(!cart){
      return res.status(401).send("Cart is still not empty")
    }
    res.status(200).json({ Status:200,success: true,message:"Email Sent Sucessfully" });
    } catch (error) {
      res.status(501).send(error.message)
    }
  }

  static async updateUserDetails(req,res){
    try {
      const userid= req.payload.aud
    const value=await AllValidationSchema.validateAsync(req.body)
    if(!value.Name&&!value.Phone&&!value.Address&&!value.Gender&&!value.Email){
      return res.status(401).send("No Field is Defined Nothing is Updated")
    }
    const data=await User.findByIdAndUpdate(userid,{
      Name:value.Name,
      Phone:value.Phone,
      Address:value.Address,
      Gender:value.Gender,
      Email:value.Email
    })
    if(!data){
      return res.status(401).json({status:401,success:false,message:"The data is not Updated error from the database"})
    }
    res.status(200).json({status:200,success:true,message:"userdetails updated sucessfully"})
    } catch (error) {
      if (error.isJoi === true) {
        return res.status(400).send("Validation error: " + error.message);
      }
      res.status(501).send(error.message)
    }
  }
}

export {OrderController};
