import Product from "../Models/ProductModel.js";
import { ObjectId } from 'mongodb';
class ProductController {
  static async AddProduct(req, res) {
    const { actualPrice, sellingPrice ,ProductName,ProductDescription} = req.body;
    if(!actualPrice||!sellingPrice||!ProductName||!ProductDescription){
      return res.send("Every field need to be defined there are still blanks")
    }
    const percentage = Math.round(
      ((actualPrice - sellingPrice) / actualPrice) * 100
    );//
      
    const newProduct = new Product({
      ProductName,
      actualPrice,
      sellingPrice,
      ProductDescription,
      percentage: percentage,
    });
    try {
      const Product = await newProduct.save();
      res.status(201).json({ message: "new Product saved successfully", Product: Product });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getProduct(req, res) {
    try {
        const data = await Product.find();
        res.send(data);
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
      const { ProductName, actualPrice, sellingPrice, ProductDescription } = req.body;
      const productdetails=await Product.findById(id);
      if(!productdetails){
        return res.send("Incorrect Product Id")
      }
      let percentage;
      if(!actualPrice&&!sellingPrice){
        percentage=productdetails.percentage
      }else if(actualPrice&&!sellingPrice){
        percentage=Math.round(((actualPrice - productdetails.sellingPrice) / actualPrice) * 100)
      }else if(!actualPrice&&sellingPrice){
        percentage=Math.round(((productdetails.actualPrice - sellingPrice) / productdetails.actualPrice) * 100)
        console.log(percentage)
      }else{
        percentage=Math.round(((actualPrice - sellingPrice) / actualPrice) * 100)
      }
      
      const data = await Product.findByIdAndUpdate(
        id,
        {
          ProductName,
          actualPrice,
          sellingPrice,
          ProductDescription,
          percentage: percentage,
        },
        { new: true }
      );
      
      if (!data) {
        return res.status(404).json({ success: false, message: "Document not found" });
      }

      res.json({
        success: true,
        message: "Document updated successfully",
        data: data,
      });
    } catch (error) {
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
      res.json({
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
