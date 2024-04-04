
import Product from "../Models/ProductModel.js";

class ProductController {
  static async AddProduct(req, res) {
    const { actualPrice, sellingPrice } = req.body;
    const percentage = Math.round(

      ((actualPrice - sellingPrice) / actualPrice) * 100
    );

    const newProduct = new Product({
      ProductName: req.body.ProductName,
      actualPrice,
      sellingPrice,
      ProductDescription: req.body.ProductDescription,
      percentage: percentage,
    });
    
    if(!newProduct.ProductName||!newProduct.sellingPrice){
      return res.send("Not a valid data")
    }
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
      const { ProductName, actualPrice, sellingPrice, ProductDescription } = req.body;
      const percentage = Math.round(((actualPrice - sellingPrice) / actualPrice) * 100);
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
      res.status(404).json({ success: false });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const data = await Product.findByIdAndDelete(id);
      if (!data) {
        return res.status(404).json({ success: false, message: "Document not found" });
      }
      res.json({
        success: true,
        message: "Document deleted successfully",
        data: data,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: "error found" });
    }
  }
}

export {ProductController}
