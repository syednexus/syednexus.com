"use client";

import { medcore } from "@/data/medcore";


export default function HealthCyberBridge(){


return(

<div className="
h-full
border
border-cyan-400/30
rounded-2xl
bg-black/40
p-6
">


<p className="
text-cyan-300
tracking-widest
text-sm
">

HEALTHCARE × CYBER BRIDGE

</p>



<div className="
space-y-4
mt-6
">


{medcore.cyberBridge.map(link=>(


<div

key={link.healthcare}

className="
border
border-cyan-400/20
rounded-xl
p-4
bg-cyan-400/5

nexus-hover
"

>


<p>

🧬 {link.healthcare}

</p>


<p className="
text-cyan-300
mt-2
">

↓


</p>


<p>

🛡 {link.security}

</p>


</div>


))}


</div>


</div>

)

}