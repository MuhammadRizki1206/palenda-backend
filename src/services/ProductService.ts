import prisma from "../prisma/client";
import { Product } from "@prisma/client";
import { ProductPayload } from "../types/product";

class ProductService {
  static getProducts(): Promise<Product[] | null> {
    const products = prisma.product.findMany();
    return products;
  }
  static getProduct(id: string): Promise<Product | null> {
    const product = prisma.product.findUnique({ where: { id } });
    return product;
  }

  static async updateProduct(
    id: string,
    data: ProductPayload
  ): Promise<Product> {
    return await prisma.product.update({
      where: { id },
      data: { ...data },
    });
  }

  static async createProduct(data: ProductPayload): Promise<Product> {
    return await prisma.product.create({
      data: { ...data },
    });
  }
}

export default ProductService;
