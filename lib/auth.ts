/** @deprecated Lab session helpers moved to lib/auth/labSession.ts */
export {
  createLabSessionToken,
  verifyLabSessionToken,
  labSessionCookie,
  createLabSessionToken as createAdminSessionToken,
  verifyLabSessionToken as verifyAdminSessionToken,
  labSessionCookie as adminSessionCookie
} from "@/lib/auth/labSession";
