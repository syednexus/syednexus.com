"use client";


import { useEffect,useState } from "react";

import { profile } from "@/data/profile";

import NexusToast from "@/components/core/NexusToast";






export default function IdentityEditor(){





const [identity,setIdentity]=useState(

profile.identity

);



const [toast,setToast]=useState("");








useEffect(()=>{



const saved=

localStorage.getItem("nexus_identity");



if(saved){



setIdentity({

...profile.identity,

...JSON.parse(saved)

});



}



},[]);









function save(){



localStorage.setItem(

"nexus_identity",

JSON.stringify(identity)

);



setToast(

"Identity updated successfully"

);




setTimeout(()=>{

setToast("");

},2500);



}









function uploadImage(

e:React.ChangeEvent<HTMLInputElement>

){



const file=e.target.files?.[0];



if(!file){

return;

}





const reader=new FileReader();





reader.onload=()=>{



setIdentity({


...identity,


avatar:reader.result as string


});



};





reader.readAsDataURL(file);



}









return(

<div className="space-y-5">





<NexusToast

message={toast}

/>








<p className="

text-red-300

tracking-widest

text-sm

">

IDENTITY MANAGER

</p>











<img

src={identity.avatar || "/profile.jpg"}

className="

w-28

h-28

rounded-full

border

border-red-400

object-cover

"

/>









<input

type="file"

accept="image/*"

onChange={uploadImage}

className="text-sm"

/>










<input

value={identity.name}

placeholder="Name"

onChange={e=>

setIdentity({

...identity,

name:e.target.value

})

}

className="

w-full

bg-black/40

border

border-red-400/20

rounded

p-3

"

/>











<input

value={identity.headline}

placeholder="Headline"

onChange={e=>

setIdentity({

...identity,

headline:e.target.value

})

}

className="

w-full

bg-black/40

border

border-red-400/20

rounded

p-3

"

/>










<textarea

value={identity.summary}

placeholder="Summary"

onChange={e=>

setIdentity({

...identity,

summary:e.target.value

})

}

className="

w-full

min-h-40

bg-black/40

border

border-red-400/20

rounded

p-3

"

/>









<button

onClick={save}

className="

border

border-green-400/40

rounded-xl

px-5

py-3

text-green-300

hover:bg-green-400/10

"

>

SAVE CHANGES

</button>








</div>


);



}