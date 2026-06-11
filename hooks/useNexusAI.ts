"use client";


import { useState } from "react";



type Message={

role:"user" | "ai";

text:string;

};





export function useNexusAI(){


const [messages,setMessages] =
useState<Message[]>([

{
role:"ai",
text:"Nexus AI online. Security intelligence loaded."
}

]);


const [loading,setLoading] =
useState(false);







async function ask(question:string){


if(!question.trim()){

return;

}



const thinkingMessage:Message = {

role:"ai",

text:"🧠 Nexus AI is thinking..."

};




setMessages(prev=>[

...prev,

{
role:"user",
text:question
},

thinkingMessage

]);



setLoading(true);





try{


const response =
await fetch(

"/api/ai",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

message:question,

history:messages.slice(-10)

})

}

);




const data =
await response.json();




setMessages(prev=>{


const updated = [...prev];


updated[updated.length-1]={

role:"ai",

text:

data.reply ??

data.error ??

"Nexus AI response unavailable."

};



return updated;


});





}

catch(error){



console.error(error);



setMessages(prev=>{


const updated=[...prev];


updated[updated.length-1]={

role:"ai",

text:"Nexus AI connection error."

};


return updated;


});



}





setLoading(false);


}








return {

messages,

ask,

loading

};


}