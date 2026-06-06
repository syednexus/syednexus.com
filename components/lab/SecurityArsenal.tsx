"use client";


export default function SecurityArsenal(){



const tools=[


{
icon:"🛡",
name:"Nessus",
type:"Vulnerability Scanner"
},


{
icon:"🌐",
name:"Burp Suite",
type:"Web Security Testing"
},


{
icon:"📡",
name:"Wireshark",
type:"Network Analysis"
},


{
icon:"⚔",
name:"Nmap",
type:"Network Discovery"
},


{
icon:"🐧",
name:"Linux CLI",
type:"Security Operations"
},


{
icon:"🔐",
name:"Cryptography",
type:"Security Engineering"
}


];








return(

<div className="

border
border-orange-400/30

rounded-2xl

bg-black/40

p-5

font-mono

shadow-lg

shadow-orange-500/10

">








<p className="

text-orange-300

tracking-widest

text-sm

">

SECURITY ARSENAL

</p>











<div className="

grid

gap-3

mt-6

">







{tools.map(tool=>(






<div

key={tool.name}

className="

border
border-orange-400/20

rounded-xl

p-4

bg-orange-400/5

nexus-hover

"

>







<div className="

flex

gap-3

items-center

">






<span className="text-2xl">

{tool.icon}

</span>







<div>



<h3>

{tool.name}

</h3>






<p className="

text-xs

text-gray-400

mt-1

">

{tool.type}

</p>







</div>






</div>








</div>





))}








</div>








</div>


);


}