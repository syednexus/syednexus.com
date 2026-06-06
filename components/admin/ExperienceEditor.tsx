"use client";


import { useEffect,useState } from "react";

import { profile } from "@/data/profile";

import NexusToast from "@/components/core/NexusToast";




type Experience={

role:string;

company:string;

period:string;

domain:string;

details:string[];

};





export default function ExperienceEditor(){



const [experience,setExperience]=useState<Experience[]>([]);


const [editing,setEditing]=useState<string|null>(null);


const [toast,setToast]=useState("");





const [form,setForm]=useState({

role:"",

company:"",

period:"",

domain:"",

details:""

});







useEffect(()=>{



const saved=

localStorage.getItem("nexus_experience");



if(saved){

setExperience(JSON.parse(saved));

}

else{

setExperience(profile.experience);

}



},[]);








function notify(msg:string){


setToast(msg);


setTimeout(()=>{

setToast("");

},2500);


}








function save(){



if(!form.role){

return;

}





const record:Experience={

role:form.role,

company:form.company,

period:form.period,

domain:form.domain,

details:

form.details

.split(",")

.map(x=>x.trim())

};







let updated:Experience[];




if(editing){



updated=

experience.map(item=>

item.role===editing

?

record

:

item

);



notify("Experience updated successfully");



}


else{



updated=[

record,

...experience

];


notify("Experience added successfully");



}







setExperience(updated);




localStorage.setItem(

"nexus_experience",

JSON.stringify(updated)

);




setEditing(null);




setForm({

role:"",

company:"",

period:"",

domain:"",

details:""

});



}








function edit(item:Experience){



setEditing(item.role);



setForm({

role:item.role,

company:item.company,

period:item.period,

domain:item.domain,

details:item.details.join(", ")

});



}








function remove(role:string){



const updated=

experience.filter(

item=>item.role!==role

);




setExperience(updated);



localStorage.setItem(

"nexus_experience",

JSON.stringify(updated)

);



notify("Experience removed");



}









return(

<div className="

border
border-yellow-400/30

rounded-xl

p-5

bg-black/40

">






<NexusToast message={toast}/>







<p className="

text-yellow-300

tracking-widest

text-sm

">

CAREER MANAGER

</p>








<input

placeholder="Role"

value={form.role}

onChange={e=>setForm({...form,role:e.target.value})}

className="admin-input"

/>








<input

placeholder="Company"

value={form.company}

onChange={e=>setForm({...form,company:e.target.value})}

className="admin-input"

/>








<input

placeholder="Period"

value={form.period}

onChange={e=>setForm({...form,period:e.target.value})}

className="admin-input"

/>








<input

placeholder="Domain"

value={form.domain}

onChange={e=>setForm({...form,domain:e.target.value})}

className="admin-input"

/>








<textarea

placeholder="Details separated by comma"

value={form.details}

onChange={e=>setForm({...form,details:e.target.value})}

className="admin-input min-h-32"

/>









<button

onClick={save}

className="

mt-5

border

border-yellow-400

px-5

py-2

rounded

"

>


{

editing

?

"SAVE CHANGES"

:

"ADD EXPERIENCE"

}


</button>











<div className="mt-8 space-y-4">



{experience.map(item=>(



<div

key={item.role}

className="

border
border-yellow-400/20

rounded-xl

p-4

bg-yellow-400/5

"

>





<h3>

💼 {item.role}

</h3>




<p className="text-gray-400">

{item.company}

</p>



<p className="text-xs text-gray-500">

{item.period}

</p>







<div className="flex gap-4 mt-4">


<button

onClick={()=>edit(item)}

className="text-blue-300"

>

EDIT

</button>



<button

onClick={()=>remove(item.role)}

className="text-red-400"

>

DELETE

</button>



</div>





</div>


))}




</div>






</div>

);


}