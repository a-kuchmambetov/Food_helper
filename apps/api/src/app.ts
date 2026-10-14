import { env } from "@config/env.js";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import routes from "./modules/routes.js";

export async function buildApp() {
  const app = Fastify({ logger: env.NODE_ENV === "development" });

  await app.register(helmet);
  await app.register(cors, {
    origin: env.WEB_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });
  await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });

  app.addHook("onRequest", async (request, reply) => {
    if (reply.sent) return;
    if (request.method === "OPTIONS") return;
    const origin = request.headers.origin;
    if (origin && origin !== env.WEB_ORIGIN) {
      reply.code(403).send({ error: "Invalid origin" });
      return;
    }
  });

  await app.register(routes, { prefix: "/api" });

  return app;
}
