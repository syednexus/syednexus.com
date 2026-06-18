import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";

import { redirect } from "next/navigation";


export default async function VaultPage(){


const session =
await getServerSession(authOptions);


if(
!session ||
session.user?.role !== "OWNER"
){

redirect("/");

}


return(

<main
className="
min-h-screen
bg-black
text-green-400
p-10
"
>

<h1
className="
text-4xl
font-bold
tracking-widest
"
>

NEXUS VAULT

</h1>


<p
className="
mt-5
text-gray-400
"
>

Owner command environment active.

</p>


</main>

);

}