import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { JWT_NAME } from "../config/constant";
import prisma from "../prisma/client";

const authPlugin = (app: Elysia) =>
  app
    .use(
      jwt({
        name: JWT_NAME,
        secret: Bun.env.JWT_SECRET!,
      })
    )
    .derive(async ({ jwt, cookie: { accessToken }, set }) => {
      if (!accessToken.value) {
        set.status = "Unauthorized";
        throw new Error("Access token is missing");
      }
      const jwtPayload = await jwt.verify(accessToken.value);
      if (!jwtPayload) {
        set.status = "Forbidden";
        throw new Error("Access token is invalid");
      }

      const userId = jwtPayload.sub;

      const user = await prisma.admin.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        set.status = "Forbidden";
        throw new Error("Access token is invalid");
      }

      return {
        user,
      };
    });

export { authPlugin };
