import Link from "next/link";



export default function VaultProjects(){


return(

<main className="min-h-screen bg-black text-green-400 p-10 font-mono">


<h1 className="text-5xl font-bold">

PROJECT CONTROL

</h1>



<p className="mt-5 text-gray-400">

Manage Nexus project database.

</p>



<Link

href="/vault/admin/content/projects"

className="
inline-block
mt-10

border
border-green-500

px-6
py-3

rounded

hover:bg-green-950
"

>

Open Project Manager

</Link>


</main>

);


}