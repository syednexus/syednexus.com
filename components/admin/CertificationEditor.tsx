"use client";

import {useEffect,useState} from "react";
import NexusToast from "@/components/core/NexusToast";


type Cert={
id?:number;
name:string;
issuer:string;
status:string;
category:string|null;
skills:string;
};





export default function CertificationEditor(){



const [certs,setCerts]=useState<Cert[]>([]);

const [editing,setEditing]=useState<Cert|null>(null);

const [toast,setToast]=useState("");



const [form,setForm]=useState({

name:"",

issuer:"",

status:"Completed",

category:"",

skills:""

});






useEffect(()=>{

load();

},[]);







async function load(){


const r =
await fetch("/api/certifications");


setCerts(

await r.json()

);


}








function notify(msg:string){


setToast(msg);


setTimeout(()=>setToast(""),2500);


}








async function save(){



const res =
await fetch("/api/certifications",{

method:"POST",

credentials:"include",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

id:editing?.id,

...form

})

});







if(!res.ok){


notify("Unauthorized - login again");


return;


}






notify(

editing ?

"Certification updated"

:

"Certification added"

);





setEditing(null);




setForm({

name:"",

issuer:"",

status:"Completed",

category:"",

skills:""

});




load();


}










function edit(cert:Cert){



setEditing(cert);



setForm({

name:cert.name,

issuer:cert.issuer,

status:cert.status,

category:cert.category || "",

skills:cert.skills

});


}









async function remove(id:number){



const res =
await fetch("/api/certifications",{

method:"DELETE",

credentials:"include",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

id

})

});







if(!res.ok){


notify("Unauthorized - login again");


return;


}






notify("Certification removed");


load();


}









return(

<div className="space-y-5">



<NexusToast message={toast}/>



<p className="text-cyan-300 tracking-widest">

🛡 CERT DATABASE

</p>






{

editing &&

(

<p className="text-yellow-300 text-sm">

Editing: {editing.name}

</p>

)

}







{Object.keys(form).map(key=>(


<input

key={key}

placeholder={key}

value={form[key as keyof typeof form]}


onChange={e=>

setForm({

...form,

[key]:e.target.value

})

}


className="admin-input"

/>


))}









<button

onClick={save}

className="

border

border-green-400

px-5

py-2

rounded-lg

text-green-300

hover:bg-green-400/10

"

>


{

editing ?

"UPDATE CERTIFICATION"

:

"SAVE CERTIFICATION"

}


</button>











<div className="space-y-3">



{certs.map(cert=>(



<div

key={cert.id}

className="

border

border-cyan-400/20

rounded-xl

p-4

bg-cyan-400/5

flex

justify-between

items-center

"

>




<div>


<p className="text-cyan-200">

🛡 {cert.name}

</p>



<p className="text-xs text-gray-400">

{cert.issuer} • {cert.status}

</p>



</div>









<div className="flex gap-3">





<button

onClick={()=>edit(cert)}

className="

border

border-yellow-400

px-3

py-1

rounded

text-yellow-300

hover:bg-yellow-400/10

"

>

EDIT

</button>








<button

onClick={()=>remove(cert.id!)}

className="

border

border-red-400

px-3

py-1

rounded

text-red-300

hover:bg-red-400/10

"

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