import { cookies } from "next/headers";
import { adminSessionCookie, verifyAdminSessionToken } from "@/lib/auth";



export async function requireAdmin(){


const cookieStore =
await cookies();



const session =
cookieStore.get(adminSessionCookie.name);



if(

!verifyAdminSessionToken(session?.value)

){


return false;


}



return true;


}
