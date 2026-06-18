import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";




export async function requireOwner(){


const session =
await getServerSession(authOptions);



if(

!session ||

session.user?.role !== "OWNER"

){


return null;


}



return session;


}







export async function requireManager(){


const session =
await getServerSession(authOptions);



if(

!session ||

(

session.user?.role !== "OWNER"

&&

session.user?.role !== "MANAGER"


)

){


return null;


}



return session;


}

// Legacy compatibility
// V2 admin = V3 owner

export async function requireAdmin(){


return await requireOwner();


}