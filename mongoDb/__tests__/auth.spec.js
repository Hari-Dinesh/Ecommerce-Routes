// import { UserController} from "../../controllers/usersController";

// const request={
//     body:{
//         email:"fakeemail@gmail.com",
//         password:"fakepassword"
//     }
// }

// it('should should send the status code 400',()=>{
//     UserController.userLogin(request);
// })

// import { describe, expect, test } from '@jest/globals';
// import { sum } from '../ctrl2/sum';

// describe('sum module', () => {
//   test('adds 1 + 2 to equal 3', () => {
//     expect(sum(1, 2)).toBe(3);
//   });
// });

// import { UserController } from '../controllers/usersController';
// import { describe } from '@jest/globals';

// describe('UserController',()=>{
//   describe('userLogin',()=>{
//     console.log("je ")
//   })
// })

import { describe, expect, jest } from "@jest/globals";
import { ProductController } from "../controllers/ProductController";
import Product from "../Models/ProductModel";
describe("ProductController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "660e6cf20732c23434fdf754",
      },
      body: {
        actualPrice: 150,
        sellingPrice: 123,
        ProductName: "google pixel",
        ProductDescription: "Something and finally the google is best ",
      },
    };
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.spyOn(Product.prototype, "save").mockImplementationOnce(() =>
      Promise.resolve({
        _id: "660e6cdd0732c23434fdf74f",
        ProductName: "Test Item",
        actualPrice: 50,
        sellingPrice: 40,
        rating: 0,
        numberOfRatings: 0,
        numberOfReviews: 0,
        percentage: 20,
        __v: 0,
        ProductDescription: "Test description",
      })
    );
  });

  describe("Add a new Product", () => {
    it("should return the Product added successfully", async () => {
      const req = {
        body: {
          actualPrice: 143,
          sellingPrice: 123,
          ProductName: "google pixel",
          ProductDescription: "Something and finally the google is best ",
        },
      };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await ProductController.AddProduct(req, res);
      const expectedProduct = {
        _id: "660e6cdd0732c23434fdf74f",
        ProductName: "Test Item",
        actualPrice: 50,
        sellingPrice: 40,
        rating: 0,
        numberOfRatings: 0,
        numberOfReviews: 0,
        percentage: 20,
        __v: 0,
        ProductDescription: "Test description",
      };
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "New product saved successfully",
        Product: expectedProduct,
      });
    });

    it("should return some input  is a joi error", async () => {
      const req = {
        body: {
          actualPrice: 50,
          sellingPrice: 40,
          ProductName: "Te",
          ProductDescription: "Test description",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      };

      await ProductController.AddProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        'Validation error: "ProductName" length must be at least 3 characters long'
      );
    });

    it("should return some input is missing", async () => {
      const req = {
        body: {
          sellingPrice: 40,
          ProductName: "Test Item",
          ProductDescription: "Test description",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      };

      await ProductController.AddProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith(
        "Every field needs to be defined; there are still blanks"
      );
    });

    it("should handle errors gracefully", async () => {
      const req = { params: { id: "66190fd52297bfc76beb0147" } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockError = new Error("Test error");
      Product.save = jest.fn().mockRejectedValue(mockError);
      await ProductController.AddProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false });
    });
  });

  describe("getProduct", () => {
    it("should return the total count and data when products are found", async () => {
      const mockData = [{ _id: "1" }];
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; // Define res with status and json
      Product.find = jest.fn().mockResolvedValue(mockData);
      Product.countDocuments = jest.fn().mockResolvedValue(mockData.length);

      await ProductController.getProduct(req, res);

      expect(Product.find).toHaveBeenCalled();
      expect(Product.countDocuments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        TotalProducts: mockData.length,
        data: mockData,
      });
    });

    it('should return "Found the Error" when an error occurs', async () => {
      const mockError = new Error("Test error");
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      Product.find = jest.fn().mockRejectedValue(mockError);

      await ProductController.getProduct(req, res);

      expect(Product.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Found the Error" });
    });
  });

  describe("updateProduct", () => {
    it("should update the product successfully", async () => {
      const req = {
        params: {
          id: "660e6cf20732c23434fdf754",
        },
        body: {
          actualPrice: 143,
          sellingPrice: 123,
          ProductName: "google pixel",
          ProductDescription: "Something and finally the google is best ",
        },
      };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const updatedProductData = {
        _id: "660e6cf20732c23434fdf754",
        actualPrice: 143,
        sellingPrice: 123,
        ProductName: "google pixel",
        ProductDescription: "Something and finally the google is best ",
        rating: 0,
        numberOfRatings: 0,
        numberOfReviews: 0,
        percentage: 14,
      };

      Product.findById = jest.fn().mockResolvedValue(updatedProductData);

      Product.findByIdAndUpdate = jest
        .fn()
        .mockResolvedValue(updatedProductData);

      await ProductController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: updatedProductData,
        message: "Product updated successfully",
        success: true,
      });
    });
    it("should return no product exist", async () => {
      Product.findById = jest.fn().mockResolvedValue(null);

      await ProductController.updateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Product not found");
    });

    // it("should return no product not found", async () => {
    //   Product.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
    //   await ProductController.updateProduct(req, res);
    //   expect(res.status).toHaveBeenCalledWith(200);
    //   expect(res.json).toHaveBeenCalledWith({ success: false, message: "Product not found" });
    // });

    it('should return "Not a valid userId" when the product ID is invalid', async () => {
      req.params.id = "invalid";

      await ProductController.updateProduct(req, res);

      expect(res.send).toHaveBeenCalledWith(
         "Not a valid Product Id"
    );
    });

    it('should return "Validation error" when input is invalid', async () => {
      req.body.actualPrice = "abc";

      await ProductController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        expect.stringContaining("Validation error")
      );
    });

    it("should handle internal server errors", async () => {
      const req = {
        params: { id: "660e6cf20732c23434fdf754" },
        body: {
          actualPrice: 150,
          sellingPrice: 123,
          ProductName: "google pixel",
          ProductDescription: "Something and finally the google is best ",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockError = new Error("Internal server error");
      const productData = {
        _id: "660e6cf20732c23434fdf754",
        actualPrice: 143,
        sellingPrice: 123,
        ProductName: "google pixel",
        ProductDescription: "Something and finally the google is best ",
        rating: 0,
        numberOfRatings: 0,
        numberOfReviews: 0,
        percentage: 14,
      };

      Product.findById = jest.fn().mockResolvedValue(productData);
      Product.findByIdAndUpdate = jest.fn().mockRejectedValue(mockError);

      await ProductController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      // expect(Product.findById).toBeCalled();

      expect(res.json).toHaveBeenCalledWith({ success: false });
    });
  });

  describe("deleteProduct", () => {
    it("should delete the product successfully", async () => {
      Product.findByIdAndDelete = jest.fn().mockResolvedValue({
        _id: "66190fd52297bfc76beb0147",
        ProductName: "google pixel",
      });

      const req = {
        params: {
          id: "66190fd52297bfc76beb0147",
        },
      };

      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ProductController.deleteProduct(req, res);

      expect(Product.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Document deleted successfully",
        productName: "google pixel",
      });
    });

    it('should return "Id is Incorrect" when the product ID is invalid', async () => {
      req.params.id = "invalidProductId";

      await ProductController.deleteProduct(req, res);

      expect(res.send).toHaveBeenCalledWith("Id is Incorrect");
    });

    it('should return "Document not found" when the product does not exist', async () => {
      const req = { params: { id: "66190fd52297bfc76beb0147" } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Product.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await ProductController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Document not found",
      });
    });

    it("should handle errors gracefully", async () => {
      const req = { params: { id: "66190fd52297bfc76beb0147" } };
      const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockError = new Error("Test error");
      Product.findByIdAndDelete = jest.fn().mockRejectedValue(mockError);

      await ProductController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "error found",
      });
    });
  });
});
