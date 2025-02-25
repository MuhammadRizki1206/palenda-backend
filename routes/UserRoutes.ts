import { Elysia, t } from "elysia";
import UserController from "../controllers/UserController";
import { authPlugin } from "../middleware/auth";

const userRoutes = new Elysia({ prefix: "/users" })
  .use(authPlugin)
  .get("/:id", ({ params: { id } }) => UserController.getUser(id), {
    params: t.Object({
      id: t.String(),
    }),
  })
  .delete("/:id", ({ params: { id } }) => UserController.deleteUser(id), {
    params: t.Object({
      id: t.String(),
    }),
  });

export default userRoutes;
