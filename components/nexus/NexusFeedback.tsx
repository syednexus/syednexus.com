"use client";


import { useState } from "react";





export default function NexusFeedback(){



const [open,setOpen] =
useState(false);



const [message,setMessage] =
useState("");



const [status,setStatus] =
useState("");







async function submit(){



const res =
await fetch(

"/api/feedback",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

message

})

}

);







if(res.ok){


setStatus(
"Feedback sent"
);


setMessage("");


}


else{


setStatus(
"Failed to send"
);


}



}









return(

<>


<button


onClick={()=>setOpen(true)}


className="

border

border-green-700


px-3

py-1


rounded


text-xs

text-green-400


hover:bg-green-950


transition

"

>


Feedback


</button>








{open && (



<div

className="

fixed

top-24

right-10


z-50



w-96



bg-black



border

border-green-500



rounded-xl



p-5



font-mono



shadow-xl

shadow-green-500/20

"

>




<div

className="

flex

justify-between

items-center

"

>


<h2

className="text-green-400"

>

Nexus Feedback

</h2>





<button

onClick={()=>setOpen(false)}

className="text-gray-400"

>

×

</button>




</div>









<textarea


value={message}


onChange={(e)=>

setMessage(e.target.value)

}


placeholder="Share your thoughts..."


className="

mt-4


w-full

h-32



bg-black



border

border-green-900



text-green-400



p-3



outline-none

"

 />







<button


onClick={submit}


className="

mt-4



border

border-green-500



px-4

py-2



text-green-400



rounded

"

>

SEND

</button>






<p

className="

mt-3

text-xs

text-gray-500

"

>

{status}

</p>





</div>


)}




</>


);



}