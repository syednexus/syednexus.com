const tools=[

{
name:"NMAP",
type:"Recon",
status:"READY",
desc:"Network discovery, ports and service enumeration"
},

{
name:"BURP SUITE",
type:"Web Security",
status:"ACTIVE",
desc:"Proxy, request analysis and web application testing"
},

{
name:"WIRESHARK",
type:"Analysis",
status:"ONLINE",
desc:"Packet capture and network traffic inspection"
},

{
name:"METASPLOIT",
type:"Exploit Lab",
status:"READY",
desc:"Vulnerability validation and security research"
},

{
name:"NESSUS",
type:"Scanner",
status:"SYNCED",
desc:"Vulnerability scanning and reporting"
},

{
name:"HYDRA",
type:"Authentication Testing",
status:"LEARNING",
desc:"Password auditing and login security testing"
}

];







export default function CyberVault(){



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
"

>

root@nexus:/vault/cyber#

</p>




<h1

className="
text-5xl
font-bold
tracking-widest
mt-5
"

>

CYBER LAB

</h1>



<p

className="
mt-5
text-gray-400
"

>

Security research, tools and practical lab environment.

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


tools.map((tool)=>(


<div

key={tool.name}

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

[{tool.status}]

</p>




<h2

className="
text-2xl
mt-4
"

>

{tool.name}

</h2>




<p

className="
text-sm
text-green-600
mt-2
"

>

{tool.type}

</p>




<p

className="
text-gray-400
text-sm
mt-4
"

>

{tool.desc}

</p>



</div>


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
"

>


<p>

TRAINING STATUS

</p>


<pre

className="
mt-5
text-sm
"

>

{`

TRYHACKME      COMPLETED
SOC PATH       ACTIVE
PENTESTING     ACTIVE
SECURITY+      PLANNED

LAB STATUS     ONLINE

`}

</pre>


</div>



</section>


</main>


);



}