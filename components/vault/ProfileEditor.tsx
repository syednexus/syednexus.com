"use client";

import { useEffect,useState } from "react";

import { refreshAppData } from "@/lib/refreshAppData";




type Identity={

name:string;

headline:string;

summary:string;

location:string;

avatar:string;

email:string;

linkedin:string;

github:string;

resume:string;

};







export default function ProfileEditor(){


const [profile,setProfile]=useState<Identity>({

name:"",

headline:"",

summary:"",

location:"",

avatar:"",

email:"",

linkedin:"",

github:"",

resume:""

});


const [status,setStatus]=useState("");








useEffect(()=>{


fetch("/api/identity")

.then(res=>res.json())

.then(data=>{


if(data){

setProfile(data);

}


});


},[]);









async function save(){


setStatus("Saving...");


const res=

await fetch("/api/identity",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(profile)

});




if(res.ok){

setStatus("PROFILE UPDATED");

refreshAppData();

}

else{

setStatus("UPDATE FAILED");

}


}









function update(

key:keyof Identity,

value:string

){


setProfile({

...profile,

[key]:value

});


}











return(

<div

className="
mt-10

border
border-green-800

rounded-xl

p-6

space-y-5
"

>


{

Object.keys(profile).map((key)=>(


<div key={key}>


<p className="uppercase text-xs text-gray-500">

{key}

</p>


<textarea

value={profile[key as keyof Identity] || ""}

onChange={(e)=>

update(

key as keyof Identity,

e.target.value

)

}


className="
mt-2

w-full

bg-black

border
border-green-800

p-3

text-green-400

outline-none
"

/>


</div>


))

}








<button

onClick={save}

className="
border
border-green-600

px-6
py-3

hover:bg-green-950
"

>

SAVE PROFILE

</button>




<p>

{status}

</p>



</div>

);


}