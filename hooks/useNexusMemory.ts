"use client";


import { useEffect,useState } from "react";





export type MemoryEvent={

type:string;

message:string;

time:string;

};








export function useNexusMemory(){








const [memory,setMemory]=useState<MemoryEvent[]>([]);










useEffect(()=>{







try{







const saved =

localStorage.getItem("nexus_activity");








if(saved){








setMemory(

JSON.parse(saved)

);









}







}

catch{








setMemory([]);








}








},[]);










function latest(){









if(memory.length===0){


return "No recent Nexus activity recorded.";

}










return memory

.slice(0,5)

.map(

item=>

`${item.type}: ${item.message}`

)

.join("\n");








}










return {

memory,

latest

};







}