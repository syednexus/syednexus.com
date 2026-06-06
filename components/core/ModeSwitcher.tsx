"use client";


type Props={

current:"gateway"|"defender"|"lab";

setMode:(mode:"gateway"|"defender"|"lab")=>void;

};



export default function ModeSwitcher({
current,
setMode
}:Props){


return(

<div className="
fixed
bottom-6
right-6
z-99999
flex
gap-3
pointer-events-auto
">



<button

type="button"

onClick={(e)=>{

e.preventDefault();

console.log("Switch Defender");

setMode("defender");

}}

className={`
px-5
py-3
rounded-lg
border
backdrop-blur
bg-black/70

${current==="defender"
?
"border-blue-400 text-blue-300"
:
"border-gray-500 text-gray-300"
}

`}

>

🛡 Defender

</button>







<button

type="button"

onClick={(e)=>{

e.preventDefault();

console.log("Switch Lab");

setMode("lab");

}}

className={`
px-5
py-3
rounded-lg
border
backdrop-blur
bg-black/70


${current==="lab"
?
"border-green-400 text-green-300"
:
"border-gray-500 text-gray-300"
}

`}

>

⚔ Lab

</button>




</div>

);


}