"use strict";

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";

module.exports = {
  // ======================
  // LOGIN
  // ======================
  async login(ctx) {
    const { identifier, password } = ctx.request.body;

    if (!identifier || !password) {
      return ctx.badRequest("Missing credentials");
    }

    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          $or: [{ email: identifier }, { username: identifier }],
        },
        populate: {
          role: true,
          user_info: true,
        },
      });

    if (!user) {
      return ctx.unauthorized("Invalid credentials");
    }

    const validPassword = await strapi
      .plugin("users-permissions")
      .service("user")
      .validatePassword(password, user.password);

    if (!validPassword) {
      return ctx.unauthorized("Invalid credentials");
    }

    // ✅ Access token (short-lived)
    const accessToken = strapi
      .plugin("users-permissions")
      .service("jwt")
      .issue({ id: user.id }, { expiresIn: ACCESS_EXPIRES });

    // ✅ Refresh token (httpOnly cookie)
    const refreshToken = strapi
      .plugin("users-permissions")
      .service("jwt")
      .issue({ id: user.id }, { expiresIn: REFRESH_EXPIRES });

    console.log("protocol:", ctx.request.protocol);
    console.log("secure:", ctx.request.secure);
    console.log("x-forwarded-proto:", ctx.request.headers["x-forwarded-proto"]);

    ctx.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      domain: 'https://payroll-server.snc.edu.ph',
      path: "/api/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    ctx.send({
      accessToken,
      //user,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        user_info: user.user_info,
      },
    });
  },

  // ======================
  // REFRESH ACCESS TOKEN
  // ======================
  async refresh(ctx) {
    const token = ctx.cookies.get("refresh_token");
    if (!token) return ctx.unauthorized();

    try {
      const payload = await strapi
        .plugin("users-permissions")
        .service("jwt")
        .verify(token);

      // Find user and populate relations
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: payload.id },
          populate: {
            role: true,
            user_info: true,
          },
        });

      if (!user) return ctx.unauthorized();

      const accessToken = strapi
        .plugin("users-permissions")
        .service("jwt")
        .issue({ id: user.id }, { expiresIn: ACCESS_EXPIRES });

      ctx.send({
        accessToken,
        //user,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          user_info: user.user_info,
        },
      });
    } catch {
      ctx.unauthorized();
    }
  },

  // ======================
  // LOGOUT
  // ======================
  async logout(ctx) {
    ctx.cookies.set("refresh_token", null, {
      path: "/api/auth/refresh",
    });

    ctx.send({ ok: true });
  },
};
