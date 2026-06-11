import { cookies } from "next/headers";
import crypto from "crypto";


const sessionCookieName =
"nexus_admin";


const sessionMaxAge =
60*60*24;


function getSessionSecret(){

const secret =
process.env.NEXUS_SECRET;


if(!secret){

throw new Error("NEXUS_SECRET missing from environment");

}


return secret;

}


function sign(value:string){

return crypto
.createHmac("sha256",getSessionSecret())
.update(value)
.digest("base64url");

}


export function createAdminSessionToken(){

const payload =
Buffer
.from(JSON.stringify({

role:"admin",

exp:
Date.now() + sessionMaxAge*1000

}))
.toString("base64url");


return `${payload}.${sign(payload)}`;

}


export function verifyAdminSessionToken(token:string | undefined){

if(!token){

return false;

}


const [
payload,
signature
] = token.split(".");


if(!payload || !signature){

return false;

}


const expected =
sign(payload);


if(signature.length !== expected.length){

return false;

}


if(

!crypto.timingSafeEqual(

Buffer.from(signature),

Buffer.from(expected)

)

){

return false;

}


try{

const session =
JSON.parse(

Buffer.from(payload,"base64url").toString("utf8")

) as {
role?:string;
exp?:number;
};


return (

session.role==="admin"

&&

typeof session.exp==="number"

&&

session.exp > Date.now()

);

}

catch{

return false;

}

}


export const adminSessionCookie = {

name:sessionCookieName,

maxAge:sessionMaxAge

};



export async function isAdmin(){


const cookieStore =
await cookies();



return (

verifyAdminSessionToken(

cookieStore.get(sessionCookieName)?.value

)

);


}
