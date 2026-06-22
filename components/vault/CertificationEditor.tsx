"use client";

import { useEffect,useState } from "react";


type Certification={

id?:number;

name:string;

issuer:string;

status:string;

category:string;

skills:string;

};




export default function CertificationEditor(){


const empty={

name:"",
issuer:"",
status:"",
category:"",
skills:""

};


const [certs,setCerts]=useState<Certification[]>([]);

const [form,setForm]=useState<Certification>(empty);

const [message,setMessage]=useState("");





async function load(){


const res =
await fetch("/api/certifications");


const data =
await res.json();


setCerts(data);


}





useEffect(()=>{

load();

},[]);






async function save(){


const res =
await fetch("/api/certifications",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(form)

});




if(res.ok){

setMessage("CERTIFICATION SAVED");

setForm(empty);

load();

}

else{

setMessage("SAVE FAILED");

}


}







async function remove(id:number){


await fetch("/api/certifications",{

method:"DELETE",

body:JSON.stringify({id})

});


load();


}









return(

<div className="mt-10">



<div className="
border
border-green-800
rounded-xl
p-6
space-y-5
">


{
[
"name",
"issuer",
"status",
"category",
"skills"
].map(field=>(


<input

key={field}

placeholder={field}

value={(form as any)[field]}

onChange={(e)=>

setForm({

...form,

[field]:e.target.value

})

}

className="
w-full
bg-black
border
border-green-800
p-3
"

/>


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

SAVE CERTIFICATION

</button>



<p>

{message}

</p>


</div>









<div className="
mt-10
space-y-5
">


{


certs.map(cert=>(


<div

key={cert.id}

className="
border
border-green-900
rounded-xl
p-5
"

>


<p className="text-gray-500">

{cert.issuer}

</p>



<h2 className="text-xl">

{cert.name}

</h2>



<p>

[{cert.status}]

</p>



<p className="
text-gray-400
text-sm
mt-3
">

{cert.skills}

</p>




<div className="flex gap-5 mt-5">


<button

onClick={()=>

setForm(cert)

}

>

EDIT

</button>




<button

onClick={()=>

remove(cert.id!)

}

>

DELETE

</button>


</div>



</div>


))

}


</div>



</div>


);


}