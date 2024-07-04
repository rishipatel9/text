import { NEXT_AUTH } from "@/app/lib/auth";
import nextAuth from "next-auth";

const handler=nextAuth(NEXT_AUTH);

export const  GET=handler;
export const POST=handler;