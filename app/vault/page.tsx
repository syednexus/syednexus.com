import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";

import { redirect } from "next/navigation";

import Link from "next/link";



const modules=[

{
title:"AI MEMORY",
desc:"Nexus intelligence storage",
status:"ACTIVE",
path:"/vault/ai"
},

{
title:"CYBER LAB",
desc:"Tools, labs and research notes",
status:"ONLINE",
path:"/vault/cyber"
},

{
title:"SOC CONSOLE",
desc:"Threat monitoring environment",
status:"READY",
path:"/vault/soc"
},

{
title:"SYSTEM CORE",
desc:"Database and API health",
status:"SECURE",
path:"/vault/system"
},

{
title:"PROJECT CONTROL",
desc:"Manage Nexus projects",
status:"SYNCED",
path:"/vault/projects"
},

{
title:"ADMIN OPS",
desc:"Owner management interface",
status:"ROOT",
path:"/vault/admin"
},

{
title:"VAULT SECURITY",
desc:"Owner MFA and access controls",
status:"HARDENED",
path:"/vault/security"
},

{
title:"WORLD ANALYTICS",
desc:"Completion, drop-off, and tool usage",
status:"LIVE",
path:"/vault/analytics"
}

];





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
font-mono
"

>



<section

className="
max-w-7xl
mx-auto
"

>


<p

className="
text-xs
text-gray-500
mb-2
"

>

root@nexus:/vault#

</p>



<h1

className="
text-5xl
font-bold
tracking-widest
"

>

NEXUS VAULT

</h1>




<p

className="
mt-4
text-gray-400
"

>

Owner command environment active.

Welcome {session.user?.name}

</p>









<div

className="
grid
grid-cols-1
md:grid-cols-3
gap-6
mt-12
"

>


{


modules.map((item)=>(


<Link

href={item.path}

key={item.title}

className="
border
border-green-800

rounded-xl

p-6

bg-green-950/10

hover:bg-green-950/30

transition
"

>


<p

className="
text-xs
text-gray-500
"

>

[{item.status}]

</p>



<h2

className="
text-2xl
mt-4
"

>

{item.title}

</h2>



<p

className="
text-gray-400
text-sm
mt-3
"

>

{item.desc}

</p>



</Link>



))


}


</div>








<div

className="
mt-12

border
border-green-900

rounded-xl

p-6

bg-black
"

>


<p>

SYSTEM STATUS

</p>



<pre

className="
mt-5
text-sm
text-green-500
"

>

{`

AUTH        OWNER
DATABASE    CONNECTED
SECURITY    ACTIVE
AI CORE     ONLINE
CLI         ENABLED

`}

</pre>



</div>





</section>


</main>


);


}