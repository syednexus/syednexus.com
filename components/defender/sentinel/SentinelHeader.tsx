type Props={

setMode:(mode:"gateway"|"defender"|"lab")=>void;

};



export default function SentinelHeader({
setMode
}:Props){



return(

<header className="
h-16
px-8
flex
items-center
justify-between
border-b
border-cyan-400/20
bg-black/30
font-mono
">


<div className="text-cyan-300">

🛡 NEXUS SENTINEL

</div>



<div className="flex gap-4">


<button

onClick={()=>setMode("lab")}

className="
border
border-green-400
text-green-300
px-4
py-2
rounded
"

>

⚔ Lab

</button>




<button

onClick={()=>setMode("gateway")}

className="
border
border-gray-500
px-4
py-2
rounded
"

>

Gateway

</button>


</div>


</header>

);


}