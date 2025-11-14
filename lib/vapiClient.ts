"use client";

import Vapi from "@vapi-ai/web";

const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

export const vapi = token ? new Vapi(token) : null;


