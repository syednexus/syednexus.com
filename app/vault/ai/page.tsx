export default function AIMemoryVault(){


const memories=[

{
key:"IDENTITY",
value:"Syed Nexus owner profile loaded"
},

{
key:"CYBER PATH",
value:"SOC Analyst | PenTesting | Security Research"
},

{
key:"TOOLS",
value:"Linux • Nmap • Burp • Metasploit • Wireshark"
},

{
key:"SYSTEM",
value:"Nexus AI Core operational"
}

];





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

root@nexus:/vault/ai#

</p>




<h1

className="
text-5xl
font-bold
tracking-widest
mt-5
"

>

AI MEMORY CORE

</h1>




<p

className="
mt-5
text-gray-400
"

>

Nexus intelligence storage and memory interface.

</p>








<div

className="
grid
grid-cols-1
md:grid-cols-2
gap-6
mt-12
"

>


{


memories.map((item)=>(


<div

key={item.key}

className="
border
border-green-800

rounded-xl

p-6

bg-green-950/10
"

>


<p

className="
text-xs
text-gray-500
"

>

[{item.key}]

</p>


<p

className="
mt-4
"

>

{item.value}

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

AI STATUS

</p>


<pre

className="
mt-5
"

>

{`

MODEL        NEXUS AI
MEMORY       ACTIVE
ACCESS       OWNER
API          ONLINE

`}

</pre>


</div>


</section>


</main>

);


}