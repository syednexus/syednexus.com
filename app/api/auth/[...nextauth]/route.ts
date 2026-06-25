import NextAuth from "next-auth";

import { authOptions } from "@/auth";
import { logAuthConfigurationIssues } from "@/lib/auth/validateAuthConfig";

logAuthConfigurationIssues();

const handler = NextAuth(authOptions);


export {

handler as GET,

handler as POST

};