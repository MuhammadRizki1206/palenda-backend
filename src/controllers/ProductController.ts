import ProductService from "../services/ProductService";
import { UploadService } from "../services/UploadService";
import { ProductPayload } from "../types/product";

class ProductController {
  static async uploadProduct(file: File) {
    try {
      const imageUrl = await UploadService.uploadImage(file, file.name);
      return imageUrl;
    } catch (error) {
      console.error("Upload Error:", error);
      return { error: error?.message };
    }
  }
  static async getProducts() {
    try {
      const product = await ProductService.getProducts();
      return {
        data: product,
        status: 200,
        message: "Succesfully get product",
      };
    } catch (error) {
      return error;
    }
  }

  static async getProduct(id: string) {
    try {
      const product = await ProductService.getProduct(id);
      return {
        data: product,
        status: 200,
        message: "Succesfully get product",
      };
    } catch (error) {
      return error;
    }
  }

  static async updateProduct(id: string, data: ProductPayload) {
    try {
      const update = await ProductService.updateProduct(id, data);
      return update;
    } catch (error) {
      return error;
    }
  }

  static async createProduct(data: ProductPayload) {
    try {
      const create = await ProductService.createProduct(data);
      return create;
    } catch (error) {
      return error;
    }
  }
}

export default ProductController;
