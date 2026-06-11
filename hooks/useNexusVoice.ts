"use client";


import { useRef,useState } from "react";




export function useNexusVoice(){


const [listening,setListening]=useState(false);

const [transcript,setTranscript]=useState("");

const recognitionRef=useRef<any>(null);







function start(){



if(typeof window==="undefined"){

return;

}





const SpeechRecognition =

(window as any).SpeechRecognition ||

(window as any).webkitSpeechRecognition;






if(!SpeechRecognition){

alert("Voice unavailable");

return;

}








const recognition = new SpeechRecognition();

recognitionRef.current=recognition;







recognition.lang="en-AU";

recognition.continuous=true;

recognition.interimResults=true;








recognition.onstart=()=>{

setListening(true);

setTranscript("");

console.log("🎙 Nexus recording");

};







recognition.onresult=(event:any)=>{



let text="";



for(

let i=0;

i<event.results.length;

i++

){



text +=

event.results[i][0].transcript;



}




setTranscript(text);



};








recognition.onerror=(e:any)=>{



if(

e.error !== "no-speech"

){

console.log(

"Voice:",

e.error

);

}



};








recognition.onend=()=>{


setListening(false);


};








recognition.start();



}











function stop(

callback:(text:string)=>void

){





if(

recognitionRef.current

){


recognitionRef.current.stop();


recognitionRef.current=null;


}





setListening(false);






if(

transcript.trim()

){


callback(

transcript.trim()

);


}







}









return {

start,

stop,

listening,

transcript

};




}