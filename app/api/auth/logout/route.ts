import { NextResponse } from "next/server";
import { adminSessionCookie } from "@/lib/auth";



export async function POST(){



const response =
NextResponse.json({

success:true

});




response.cookies.set(adminSessionCookie.name,"",{

path:"/",

maxAge:0

});



return response;


}
