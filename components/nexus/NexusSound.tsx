"use client";


import {

createContext,

useContext,

useState,

useEffect

} from "react";





type SoundContextType={

enabled:boolean;

toggleSound:()=>void;

play:(type?:"click"|"success"|"alert")=>void;

};




const SoundContext =

createContext<SoundContextType | null>(null);








export function NexusSoundProvider({

children

}:{

children:React.ReactNode

}){



const [enabled,setEnabled] =

useState(false);





useEffect(()=>{


const saved =

localStorage.getItem("nexus_sound");


if(saved==="true"){

setEnabled(true);

}


},[]);








function toggleSound(){


const next = !enabled;


setEnabled(next);


localStorage.setItem(

"nexus_sound",

String(next)

);


}








function play(

type:"click"|"success"|"alert"="click"

){



if(!enabled){

return;

}



const audio =

new AudioContext();



const oscillator =

audio.createOscillator();



const gain =

audio.createGain();





oscillator.connect(gain);


gain.connect(audio.destination);






if(type==="success"){


oscillator.frequency.value=700;


}



else if(type==="alert"){


oscillator.frequency.value=200;


}



else{


oscillator.frequency.value=420;


}







gain.gain.value=0.05;



oscillator.start();



oscillator.stop(

audio.currentTime+0.08

);



}








return(

<SoundContext.Provider

value={{

enabled,

toggleSound,

play

}}

>


{children}


</SoundContext.Provider>

);



}









export function useNexusSound(){



const ctx =

useContext(SoundContext);



if(!ctx){


throw new Error(

"NexusSoundProvider missing"

);


}



return ctx;



}