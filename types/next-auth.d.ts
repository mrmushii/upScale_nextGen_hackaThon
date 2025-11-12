import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tier: "basic" | "pro" | "ultimate";
      role: "user" | "admin" | "recruiter" | "mentor";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    tier: "basic" | "pro" | "ultimate";
    role: "user" | "admin" | "recruiter" | "mentor";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    tier: "basic" | "pro" | "ultimate";
    role: "user" | "admin" | "recruiter" | "mentor";
  }
}

