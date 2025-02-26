import { Elysia } from "elysia";
import ProductController from "../controllers/ProductController";
import { uploadFile } from "../middleware/upload";

const productRoutes = new Elysia({ prefix: "/product" }).post(
  "/upload",
  async ({ request }) => {
    try {
      const file = await uploadFile(request);

      if (!file) return { error: "No file uploaded" };

      const imageUrl = await ProductController.uploadProduct(file);
      return imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      return { error: error };
    }
  }
);

export default productRoutes;
