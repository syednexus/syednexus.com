"use client";


import { useEffect, useState } from "react";

import { profile } from "@/data/profile";

import NexusToast from "@/components/core/NexusToast";





type Certification={

name:string;

issuer:string;

status:string;

category:string;

skills:string[];

};







export default function CertificationEditor(){





const [certs,setCerts]=useState<Certification[]>([]);


const [editing,setEditing]=useState<string|null>(null);


const [toast,setToast]=useState("");







const [form,setForm]=useState({

name:"",

issuer:"",

status:"Completed",

category:"Cybersecurity",

skills:""

});









useEffect(()=>{



const saved=

localStorage.getItem("nexus_certifications");



if(saved){

setCerts(JSON.parse(saved));

}

else{

setCerts(profile.certifications);

}



},[]);









function notify(msg:string){


setToast(msg);


setTimeout(()=>{

setToast("");

},2500);


}










function save(){





if(!form.name){

return;

}






const cert:Certification={

name:form.name,

issuer:form.issuer,

status:form.status,

category:form.category,

skills:

form.skills

.split(",")

.map(x=>x.trim())

};









let updated:Certification[];





if(editing){



updated=

certs.map(item=>

item.name===editing

?

cert

:

item

);




notify("Certification updated successfully");



}



else{



updated=[

cert,

...certs

];



notify("Certification added successfully");



}









setCerts(updated);





localStorage.setItem(

"nexus_certifications",

JSON.stringify(updated)

);







setEditing(null);




setForm({

name:"",

issuer:"",

status:"Completed",

category:"Cybersecurity",

skills:""

});



}









function edit(cert:Certification){



setEditing(cert.name);



setForm({

name:cert.name,

issuer:cert.issuer,

status:cert.status,

category:cert.category,

skills:cert.skills.join(", ")

});



}









function remove(name:string){





const updated=

certs.filter(

cert=>cert.name!==name

);





setCerts(updated);




localStorage.setItem(

"nexus_certifications",

JSON.stringify(updated)

);




notify("Certification removed");



}











return(

<div className="

border
border-cyan-400/30

rounded-xl

p-5

bg-black/40

">








<NexusToast message={toast}/>










<p className="

text-cyan-300

tracking-widest

text-sm

">

CERTIFICATION VAULT

</p>










<input

placeholder="Certification name"

value={form.name}

onChange={e=>

setForm({

...form,

name:e.target.value

})

}

className="admin-input"

/>









<input

placeholder="Issuer"

value={form.issuer}

onChange={e=>

setForm({

...form,

issuer:e.target.value

})

}

className="admin-input"

/>










<input

placeholder="Status"

value={form.status}

onChange={e=>

setForm({

...form,

status:e.target.value

})

}

className="admin-input"

/>










<input

placeholder="Category"

value={form.category}

onChange={e=>

setForm({

...form,

category:e.target.value

})

}

className="admin-input"

/>










<input

placeholder="Skills comma separated"

value={form.skills}

onChange={e=>

setForm({

...form,

skills:e.target.value

})

}

className="admin-input"

/>










<button

onClick={save}

className="

mt-5

border

border-cyan-400

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

"ADD CERTIFICATION"

}


</button>











<div className="mt-8 space-y-4">







{certs.map(cert=>(






<div

key={cert.name}

className="

border

border-cyan-400/20

rounded-xl

p-4

bg-cyan-400/5

"

>






<h3>

🛡 {cert.name}

</h3>






<p className="text-gray-400 text-sm">

{cert.issuer} • {cert.status}

</p>








<div className="flex gap-4 mt-4">







<button

onClick={()=>edit(cert)}

className="text-blue-300"

>

EDIT

</button>







<button

onClick={()=>remove(cert.name)}

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