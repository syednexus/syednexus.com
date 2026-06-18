import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";


export default async function Vault(){


const session =
await getServerSession(authOptions);


if(
session?.user?.role !== "OWNER"
){

redirect("/");

}


return(

<main className="
min-h-screen
bg-black
text-green-400
p-10
font-mono
">

<h1 className="
text-4xl
font-bold
">

NEXUS VAULT

</h1>


<p className="mt-5 text-gray-400">

Private knowledge system unlocked.

</p>


</main>

);


}