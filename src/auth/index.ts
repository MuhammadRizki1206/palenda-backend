import { Elysia, t } from "elysia";
import prisma from "../prisma/client";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { authPlugin } from "../middleware/auth";
import { getExpTimestamp } from "../utils/getExpTimestamp";
import { ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP } from "../config/constant";
import AuthService from "../services/AuthService";

export const auth = (app: Elysia) =>
  app.group("/auth", (app) =>
    app
      .post(
        "/signup",
        async ({ body, set }) => {
          const { email, name, password, username } = body;
          // validate duplicate email address
          const emailExists = await prisma.admin.findUnique({
            where: {
              email,
            },
            select: {
              id: true,
            },
          });
          if (emailExists) {
            set.status = 400;
            return {
              success: false,
              data: null,
              message: "Email address already in use.",
            };
          }

          // handle password
          const { hash, salt } = await hashPassword(password);

          const payloadUser = {
            name,
            email,
            username,
            hash,
            salt,
          };

          const newUser = await AuthService.createUser(payloadUser);

          return {
            success: true,
            message: "Account created",
            data: {
              user: newUser,
            },
          };
        },
        {
          body: t.Object({
            name: t.String(),
            email: t.String(),
            username: t.String(),
            password: t.String(),
          }),
        }
      )
      .post(
        "/login",
        async ({ body, jwt, cookie: { accessToken, refreshToken }, set }) => {
          const { username, password } = body;
          // verify email/username
          const user = await prisma.admin.findFirst({
            where: {
              OR: [
                {
                  email: username,
                },
                {
                  username,
                },
              ],
            },
            select: {
              id: true,
              hash: true,
              salt: true,
              username: true,
            },
          });

          if (!user) {
            set.status = 400;
            return {
              success: false,
              data: null,
              message: "username is incorrect",
            };
          }

          // verify password
          const match = await comparePassword(password, user.salt, user.hash);
          if (!match) {
            set.status = 400;
            return {
              success: false,
              data: null,
              message: "password is incorrect",
            };
          }

          const accessJWTToken = await jwt.sign({
            sub: user.id,
            exp: getExpTimestamp(ACCESS_TOKEN_EXP),
          });

          accessToken.set({
            value: accessJWTToken,
            httpOnly: false,
            maxAge: ACCESS_TOKEN_EXP,
            path: "/",
            sameSite: "none", // Necessary for cross-origin cookies
            secure: process.env.NODE_ENV === "production", // Works over HTTPS
          });

          // create refresh token
          const refreshJWTToken = await jwt.sign({
            sub: user.id,
            exp: getExpTimestamp(REFRESH_TOKEN_EXP),
          });

          refreshToken.set({
            value: refreshJWTToken,
            httpOnly: false,
            maxAge: REFRESH_TOKEN_EXP,
            path: "/",
            sameSite: "none", // or "Strict" / "None" (with HTTPS)
            secure: process.env.NODE_ENV === "production",
          });

          return {
            message: "Sig-in successfully",
            data: {
              userid: user.id,
              username: user.username,
              accessToekn: accessJWTToken,
              refreshToken: refreshJWTToken,
            },
          };
        },
        {
          body: t.Object({
            username: t.String(),
            password: t.String(),
          }),
        }
      )
      .use(authPlugin)
      // protected route
      .get("/me", ({ user }) => {
        return {
          success: true,
          message: "Fetch authenticated user details",
          data: {
            user,
          },
        };
      })
  );
