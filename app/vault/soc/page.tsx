const alerts=[

{
id:"INC-001",
severity:"LOW",
event:"Port scan detected",
source:"192.168.1.24",
status:"CLOSED"
},

{
id:"INC-002",
severity:"MEDIUM",
event:"Multiple failed authentication attempts",
source:"10.0.0.12",
status:"INVESTIGATING"
},

{
id:"INC-003",
severity:"INFO",
event:"Endpoint heartbeat received",
source:"Nexus Agent",
status:"NORMAL"
}

];






const rules=[

{
name:"MITRE T1110",
desc:"Brute Force Detection"
},

{
name:"MITRE T1046",
desc:"Network Service Discovery"
},

{
name:"MITRE T1059",
desc:"Command Execution Monitoring"
}

];









export default function SOCVault(){



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

root@nexus:/vault/soc#

</p>





<h1

className="
text-5xl
font-bold
tracking-widest
mt-5
"

>

SOC COMMAND CENTER

</h1>






<p

className="
mt-5
text-gray-400
"

>

Security monitoring and incident response environment.

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



<div className="
border
border-green-800
rounded-xl
p-6
bg-green-950/10
">

<p>SYSTEM</p>

<h2 className="text-3xl mt-4">

ONLINE

</h2>

</div>







<div className="
border
border-green-800
rounded-xl
p-6
bg-green-950/10
">

<p>EVENTS</p>

<h2 className="text-3xl mt-4">

3 ACTIVE

</h2>

</div>







<div className="
border
border-green-800
rounded-xl
p-6
bg-green-950/10
">

<p>THREAT LEVEL</p>

<h2 className="text-3xl mt-4">

LOW

</h2>

</div>



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

LIVE SECURITY EVENTS

</p>






<div className="mt-6 space-y-5">


{


alerts.map(alert=>(


<div

key={alert.id}

className="
border-b
border-green-900
pb-4
"

>


<p>

[{alert.id}] {alert.event}

</p>


<p className="text-gray-500 text-sm">

SRC: {alert.source}

</p>


<p className="text-xs">

{alert.severity} | {alert.status}

</p>



</div>


))

}


</div>



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

DETECTION RULES

</p>






{

rules.map(rule=>(


<div

key={rule.name}

className="
mt-5
"

>


<p>

{rule.name}

</p>


<p className="text-gray-500 text-sm">

{rule.desc}

</p>



</div>


))

}



</div>







</section>


</main>


);



}