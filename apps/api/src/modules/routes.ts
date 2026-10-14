import { auth } from "@plugins/auth/auth.js";
import type { FastifyPluginAsync } from "fastify";
import authRoutes from "./auth/auth.routes.js";

const routes: FastifyPluginAsync = async (app) => {
  app.get("/health", async () => {
    return { status: "ok" };
  });

  await app.register(authRoutes, { auth });
};

export default routes;
