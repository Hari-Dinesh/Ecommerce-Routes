import Product from "../Models/ProductModel.js";
import authProductSchema from "../helper/Product.js";
import { ObjectId } from "mongodb";
class ProductController {
  static async AddProduct(req, res) {
    try {
      const value = await authProductSchema.validateAsync(req.body);
      if (
        !value.actualPrice ||
        !value.sellingPrice ||
        !value.ProductName ||
        !value.ProductDescription
      ) {
        return res
          .status(401)
          .send("Every field needs to be defined; there are still blanks");
      }
      const percentage = Math.round(
        ((value.actualPrice - value.sellingPrice) / value.actualPrice) * 100
      );
      const newProduct = await new Product({
        ProductName: value.ProductName,
        actualPrice: value.actualPrice,
        sellingPrice: value.sellingPrice,
        ProductDescription: value.ProductDescription,
        percentage: percentage,
      }).save();

      res.status(201).json({
        message: "New product saved successfully",
        Product: newProduct,
      });
    } catch (err) {
      if (err.isJoi === true) {
        err.status = 400;
        return res.status(400).send("Validation error: " + err.message);
      }
      res.status(404).json({ success: false });
    }
  }

  static async getProduct(req, res) {
    try {
      const data = await Product.find();

      const totalCount = await Product.countDocuments();
      res.status(201).json({ TotalProducts: totalCount, data: data });
    } catch (error) {
      res.status(500).json({ message: "Found the Error" });
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      // console.log(!ObjectId.isValid(id));
      if (!ObjectId.isValid(id)) {
        return res.status(400).send("Not a valid Product Id" );
      }

      const value = await authProductSchema.validateAsync(req.body);

      const productdetails = await Product.findById(id);
      if (!productdetails) {
        return res.status(404).send("Product not found");
      }

      let percentage;
      if (!value.actualPrice && !value.sellingPrice) {
        percentage = productdetails.percentage;
      } else if (value.actualPrice && !value.sellingPrice) {
        percentage = Math.round(
          ((value.actualPrice - productdetails.sellingPrice) /
            value.actualPrice) *
            100
        );
      } else if (!value.actualPrice && value.sellingPrice) {
        percentage = Math.round(
          ((productdetails.actualPrice - value.sellingPrice) /
            productdetails.actualPrice) *
            100
        );
      } else {
        percentage = Math.round(
          ((value.actualPrice - value.sellingPrice) / value.actualPrice) * 100
        );
      }

      const data = await Product.findByIdAndUpdate(
        id,
        {
          ProductName: value.ProductName,
          actualPrice: value.actualPrice,
          sellingPrice: value.sellingPrice,
          ProductDescription: value.ProductDescription,
          percentage: percentage,
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: data,
      });
    } catch (error) {
      if (error.isJoi === true) {
        return res.status(400).send("Validation error: " + error.message);
      }
      return res.status(500).json({ success: false });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.send("Id is Incorrect");
      }
      const data = await Product.findByIdAndDelete(id);
      if (!data) {
        return res
          .status(404)
          .json({ success: false, message: "Document not found" });
      }
      res.status(200).json({
        success: true,
        message: "Document deleted successfully",
        productName: data.ProductName,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: "error found" });
    }
  }
}

export { ProductController };
