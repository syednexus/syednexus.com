"use client";


type Props={

message:string;

};




export default function NexusToast({

message

}:Props){



if(!message){

return null;

}



return(

<div className="

fixed

bottom-8

right-8

z-50

border

border-green-400/40

rounded-xl

px-5

py-3

bg-black/90

text-green-300

font-mono

shadow-lg

shadow-green-500/20

">

✓ {message}

</div>

);


}