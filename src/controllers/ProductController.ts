import { UploadService } from "../services/UploadService";

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
}

export default ProductController;
