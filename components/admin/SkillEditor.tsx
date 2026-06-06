"use client";


import { useEffect,useState } from "react";

import { profile } from "@/data/profile";

import NexusToast from "@/components/core/NexusToast";





type Skills={

cybersecurity:string[];

tools:string[];

programming:string[];

pharmacy:string[];

};








export default function SkillEditor(){





const [skills,setSkills]=useState<Skills>(

profile.skills

);



const [toast,setToast]=useState("");








useEffect(()=>{



const saved=

localStorage.getItem("nexus_skills");



if(saved){


setSkills(

JSON.parse(saved)

);


}



},[]);










function update(

category:keyof Skills,

value:string

){





setSkills({

...skills,


[category]:

value

.split("\n")

.filter(Boolean)


});



}










function save(){





localStorage.setItem(

"nexus_skills",

JSON.stringify(skills)

);





setToast(

"Capability matrix updated successfully"

);





setTimeout(()=>{

setToast("");

},2500);




}









return(

<div className="space-y-6">






<NexusToast message={toast}/>








<p className="

text-red-300

tracking-widest

text-sm

">

CAPABILITY MATRIX MANAGER

</p>









{Object.keys(skills).map(key=>(







<div


key={key}


className="

border

border-red-400/20

rounded-xl

p-4

bg-red-400/5

"

>









<p className="

uppercase

text-xs

text-red-300

mb-3

">

{key}

</p>










<textarea


value={

skills[key as keyof Skills]

.join("\n")

}


onChange={e=>

update(

key as keyof Skills,

e.target.value

)

}



className="

w-full

min-h-32

bg-black/40

border

border-red-400/20

rounded-xl

p-3

outline-none

text-white

"


/>









</div>







))}









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

SAVE MATRIX

</button>










</div>


);



}