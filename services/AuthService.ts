import prisma from "../prisma/client";
import { UserPayload } from "../types/User";
import { Admin } from "@prisma/client";

class AuthService {
  static async createUser(payload: UserPayload): Promise<Admin> {
    const result = await prisma.$transaction(async () => {
      //crate user
      const user = await prisma.admin.create({
        data: {
          username: payload.username,
          name: payload.name,
          email: payload.email,
          salt: payload.salt,
          hash: payload.hash,
          updatedAt: payload.updatedAt,
          createdAt: payload.createdAt,
        },
      });

      return user;
    });
    return result;
  }
}

export default AuthService;
