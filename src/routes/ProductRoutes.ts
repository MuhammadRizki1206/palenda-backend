import { Elysia, t } from "elysia";
import ProductController from "../controllers/ProductController";
import { uploadFile } from "../middleware/upload";
import { authPlugin } from "../middleware/auth";

const productRoutes = new Elysia({ prefix: "/product" })
  .get("/", () => ProductController.getProducts())
  .get("/:id", ({ params: { id } }) => ProductController.getProduct(id), {
    params: t.Object({
      id: t.String(),
    }),
  })
  .use(authPlugin)
  .post("/upload", async ({ request }) => {
    try {
      const file = await uploadFile(request);
      if (!file) return { error: "No file uploaded" };

      const imageUrl = await ProductController.uploadProduct(file);
      return { imageUrl };
    } catch (error) {
      console.error("Upload error:", error);
      return { error: error?.message };
    }
  })
  .post(
    "/",
    async ({ body }) => {
      try {
        const product = await ProductController.createProduct(body);
        return { data: product, message: "Product created successfully" };
      } catch (error) {
        return { error: error?.message };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        description: t.String(),
        price: t.Number(),
        imageUrl: t.Optional(t.String()),
        stock: t.Optional(t.Number()),
      }),
    }
  )

  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      try {
        const updatedProduct = await ProductController.updateProduct(id, body);
        return {
          data: updatedProduct,
          message: "Product updated successfully",
        };
      } catch (error) {
        return { error: error?.message };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.String(),
        description: t.String(),
        price: t.Number(),
        imageUrl: t.Optional(t.String()),
        stock: t.Optional(t.Number()),
      }),
    }
  );

export default productRoutes;
