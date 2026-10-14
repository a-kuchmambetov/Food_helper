import type { FastifyPluginAsync } from "fastify";

export interface AuthRoutesOptions {
  auth: { handler: (request: Request) => Promise<Response> };
}

// Forwards /auth/* to Better Auth, translating between Fastify and Fetch API objects.
const authRoutes: FastifyPluginAsync<AuthRoutesOptions> = async (
  app,
  { auth },
) => {
  app.route({
    method: ["GET", "POST"],
    url: "/auth/*",
    handler: async (request, reply) => {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const headers = new Headers();
      for (const [key, value] of Object.entries(request.headers)) {
        if (value !== undefined) headers.append(key, value.toString());
      }

      const response = await auth.handler(
        new Request(url, {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        }),
      );

      reply.status(response.status);
      response.headers.forEach((value, key) => {
        if (key !== "set-cookie") reply.header(key, value);
      });
      const cookies = response.headers.getSetCookie();
      if (cookies.length > 0) reply.header("set-cookie", cookies);
      return reply.send(response.body ? await response.text() : null);
    },
  });
};

export default authRoutes;
