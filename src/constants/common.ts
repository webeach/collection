export const __DEVELOPMENT__ = process.env.NODE_ENV !== "production";

export const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

export const isServer = !isBrowser;
