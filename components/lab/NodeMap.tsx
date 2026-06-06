"use client";


type Props={

unlocked:string[];

};




export default function NodeMap({

unlocked

}:Props){



const nodes=[


{
id:"IDENTITY",
icon:"👤",
name:"Identity Server"
},


{
id:"SKILLS",
icon:"🖥",
name:"Linux Host"
},


{
id:"PROJECTS",
icon:"⚔",
name:"Project Vault"
},


{
id:"CERTS",
icon:"🛡",
name:"Credential Store"
}


];







return(

<div className="

w-full

border
border-purple-400/30
rounded-2xl
bg-black/40
p-8
font-mono
shadow-lg
shadow-purple-500/10

">






<p className="

text-purple-300
tracking-widest
text-sm

">

ATTACK SURFACE MAP

</p>







<div className="

mt-10

grid
grid-cols-3
gap-6
items-center
text-center

">








<div className="space-y-6">


{nodes.slice(0,2).map(node=>(


<Node

key={node.id}

node={node}

active={unlocked.includes(node.id)}

/>


))}


</div>










<div>


<div className="

border
border-purple-400
rounded-full
w-40
h-40
mx-auto
flex
items-center
justify-center
bg-purple-500/10
nexus-hover
">


<div>


<div className="text-4xl">

🧠

</div>


<div className="text-sm mt-2">

NEXUS CORE

</div>


</div>


</div>



<div className="

mt-6
text-xs
text-gray-400

">

Encrypted intelligence hub

</div>



</div>









<div className="space-y-6">


{nodes.slice(2).map(node=>(


<Node

key={node.id}

node={node}

active={unlocked.includes(node.id)}

/>


))}


</div>






</div>







</div>

)


}









function Node({

node,

active

}:{

node:{

id:string;

icon:string;

name:string;

};

active:boolean;

}){



return(


<div className={`

border

rounded-xl

p-4

transition

nexus-hover
${

active

?

"border-green-400 bg-green-400/10 text-green-300"

:

"border-gray-700 bg-black/40 text-gray-500"

}

`}>



<div className="text-3xl">

{node.icon}

</div>



<p className="

text-sm
mt-2

">

{node.name}

</p>



<p className="

text-xs
mt-2

">


{

active

?

"ONLINE"

:

"LOCKED"

}


</p>




</div>


)


}