import Elysia from "elysia";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { auth } from "./auth/index";
import userRoutes from "./routes/UserRoutes";
import productRoutes from "./routes/ProductRoutes";

const app = new Elysia()
  .group("/api", (app) =>
    app
      .use(
        jwt({
          name: "jwt",
          secret: Bun.env.JWT_SECRET!,
        })
      )
      .use(cookie())
      .use(auth)
      .use(userRoutes)
      .use(productRoutes)
  )
  .listen(3001);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
