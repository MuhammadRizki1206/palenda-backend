import prisma from "../prisma/client";
import { Admin } from "@prisma/client";
import { UserPayload } from "../types/User";

class UserService {
  static async getUser(id: string): Promise<Admin | null> {
    const user = prisma.admin.findUnique({ where: { id } });
    return user;
  }

  static async updateUser(id: string, data: UserPayload): Promise<Admin> {
    return await prisma.admin.update({
      where: { id },
      data: { ...data },
    });
  }

  static async createUser(data: UserPayload): Promise<Admin> {
    const user = await prisma.admin.create({ data });
    return user;
  }

  static async deleteUser(id: string) {
    return prisma.admin.delete({ where: { id } });
  }
}

export default UserService;
