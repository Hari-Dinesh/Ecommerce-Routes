import Product from "../Models/ProductModel.js";
import authProductSchema from "../helper/Product.js";
import { ObjectId } from 'mongodb';
class ProductController {
  static async AddProduct(req, res) {
    try {
      const value = await authProductSchema.validateAsync(req.body);
    if(!value.actualPrice||!value.sellingPrice||!value.ProductName||!value.ProductDescription){
      return res.status(401).send("Every field need to be defined there are still blanks")
    }
    const percentage = Math.round(
      ((value.actualPrice - value.sellingPrice) / value.actualPrice) * 100
    );
      
    const newProduct = new Product({
      ProductName:value.ProductName,
      actualPrice:value.actualPrice,
      sellingPrice:value.sellingPrice,
      ProductDescription:value.ProductDescription,//
      percentage: percentage,
    });
      const Product = await newProduct.save();
      if(!Product){
        return res.status(301).json({success:true,status:301,message:"Unable to save the product"})
      }
      res.status(201).json({ message: "new Product saved successfully", Product: Product });
    } catch (err) {
      if (err.isJoi === true) {
        err.status = 402;
        return res.status(400).send("Validation error: " + err.message);
      }
      res.status(400).json({ message: err.message });
    }
  }

  static async getProduct(req, res) {
    try {
        const data = await Product.find();
        if(!data){
          return res.status(301).send({status:301,success:false,message:"Unable to get Data"})
        }
        res.status(201).send(data);
    } catch (error) {
      res.send("Found the Error");
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      if(!ObjectId.isValid(id)){
        return res.send("Not a valid userId")
      }
      const value=await authProductSchema.validateAsync(req.body);
      const productdetails=await Product.findById(id);
      if(!productdetails){
        return res.send("Incorrect Product Id")
      }
      let percentage;
      if(!value.actualPrice&&!value.sellingPrice){
        percentage=productdetails.percentage
      }else if(value.actualPrice&&!value.sellingPrice){
        percentage=Math.round(((value.actualPrice - productdetails.sellingPrice) / value.actualPrice) * 100)
      }else if(!value.actualPrice&&value.sellingPrice){
        percentage=Math.round(((productdetails.actualPrice - value.sellingPrice) / productdetails.actualPrice) * 100)
      }else{
        percentage=Math.round(((value.actualPrice - value.sellingPrice) / value.actualPrice) * 100)
      }
      
      const data = await Product.findByIdAndUpdate(
        id,
        {
          ProductName:value.ProductName,
          actualPrice:value.actualPrice,
          sellingPrice:value.sellingPrice,
          ProductDescription:value.ProductDescription,
          percentage: percentage,
        },
        { new: true }
      );
      console.log(data)
      if (!data) {
        return res.status(404).json({ success: false, message: "Document not found" });
      }

      res.status(201).json({
        success: true,
        message: "Document updated successfully",
        data: data,
      });
    } catch (error) {
      if (error.isJoi === true) {
        error.status = 402;
        return res.status(400).send("Validation error: " + error.message);
      }
      console.log(error)
      res.status(404).json({ success: false });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      if(!ObjectId.isValid(id)){
        return res.send("Id is Incorrect")
      }
      const data=await Product.findByIdAndDelete(id);
      if (!data) {
        return res.status(404).json({ success: false, message: "Document not found" });
      }
      res.status(200).json({
        success: true,
        message: "Document deleted successfully",
        productName:data.ProductName
      });
    } catch (error) {
      res.status(404).json({ success: false, message: "error found" });
    }
  }
}

export {ProductController}
