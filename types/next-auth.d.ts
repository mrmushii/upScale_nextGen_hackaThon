import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tier: "basic" | "pro" | "ultimate";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    tier: "basic" | "pro" | "ultimate";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    tier: "basic" | "pro" | "ultimate";
  }
}

