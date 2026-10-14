"use client";

import type { PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { RouterProvider as AriaRouterProvider } from "react-aria-components";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export const RouteProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  return (
    <AriaRouterProvider navigate={router.push}>{children}</AriaRouterProvider>
  );
};
