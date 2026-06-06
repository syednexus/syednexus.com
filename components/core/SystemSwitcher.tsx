"use client";


import { Mode } from "@/types/mode";



type Props = {

current: Mode;

setMode:(mode:Mode)=>void;

};





export default function SystemSwitcher({

current,

setMode

}:Props){





const systems:{mode:Mode;label:string}[]=[


{

mode:"defender",

label:"🛡 Sentinel"

},



{

mode:"medcore",

label:"🧬 MedCore"

},



{

mode:"lab",

label:"⚔ Lab"

},



{

mode:"blogs",

label:"📝 Blogs"

}


];










return(

<div className="

fixed

bottom-6

right-6

z-50

flex

gap-3

font-mono

flex-wrap

">







{systems.map(system=>(




<button


key={system.mode}


type="button"


onClick={()=>setMode(system.mode)}


className={`


px-4

py-2

rounded-lg

border

bg-black/80

backdrop-blur

transition

cursor-pointer



${


current===system.mode


?


"border-green-400 text-green-300 shadow-lg shadow-green-500/20"


:


"border-gray-600 text-gray-400 hover:text-white hover:border-white"



}


`}


>




{system.label}





</button>





))}







</div>


);


}