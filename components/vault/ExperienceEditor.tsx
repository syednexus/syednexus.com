"use client";

import { useEffect,useState } from "react";


type Experience={

id?:number;

role:string;

company:string;

period:string;

domain:string;

details:string;

};




export default function ExperienceEditor(){


const empty={

role:"",
company:"",
period:"",
domain:"",
details:""

};


const [experience,setExperience]=useState<Experience[]>([]);

const [form,setForm]=useState<Experience>(empty);

const [status,setStatus]=useState("");




async function load(){


const res =
await fetch("/api/experience");


const data =
await res.json();


setExperience(data);


}




useEffect(()=>{

load();

},[]);






async function save(){


const res =
await fetch("/api/experience",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(form)

});




if(res.ok){


setStatus("EXPERIENCE SAVED");

setForm(empty);

load();


}

else{


setStatus("SAVE FAILED");


}


}







async function remove(id:number){


await fetch("/api/experience",{

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
"role",
"company",
"period",
"domain"
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






<textarea

placeholder="details"

value={form.details}

onChange={(e)=>

setForm({

...form,

details:e.target.value

})

}

className="
w-full
h-40
bg-black
border
border-green-800
p-3
"

/>







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

SAVE EXPERIENCE

</button>


<p>{status}</p>



</div>










<div className="
mt-10
space-y-5
">


{


experience.map(item=>(


<div

key={item.id}

className="
border
border-green-900
rounded-xl
p-5
"

>


<p className="text-gray-500">

{item.company}

</p>



<h2 className="text-xl">

{item.role}

</h2>



<p>

{item.period}

</p>



<p className="
text-gray-400
mt-3
">

{item.details}

</p>





<div className="
flex
gap-5
mt-5
">


<button

onClick={()=>

setForm(item)

}

>

EDIT

</button>




<button

onClick={()=>

remove(item.id!)

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