import { cookies } from "next/headers";

import {

adminSessionCookie,

verifyAdminSessionToken

} from "@/lib/auth";





export async function requireAdmin(){


try{



const cookieStore =
await cookies();




const session =
cookieStore.get(

adminSessionCookie.name

);





return verifyAdminSessionToken(

session?.value

);



}



catch(error){



console.error(

"ADMIN GUARD ERROR",

error

);




return false;



}



}