"use client";

import { useEffect,useState } from "react";


type Education={

id?:number;

degree:string;

institution:string;

period:string;

field:string;

focus:string;

};





export default function EducationEditor(){


const empty={

degree:"",
institution:"",
period:"",
field:"",
focus:""

};


const [education,setEducation]=useState<Education[]>([]);

const [form,setForm]=useState<Education>(empty);

const [status,setStatus]=useState("");







async function load(){


const res =
await fetch("/api/education");


const data =
await res.json();


setEducation(data);


}







useEffect(()=>{

load();

},[]);









async function save(){



const res =
await fetch("/api/education",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(form)

});





if(res.ok){


setStatus("EDUCATION SAVED");

setForm(empty);

load();


}

else{


setStatus("SAVE FAILED");


}



}









async function remove(id:number){



await fetch("/api/education",{

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
"degree",
"institution",
"period",
"field"
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

placeholder="focus"

value={form.focus}

onChange={(e)=>

setForm({

...form,

focus:e.target.value

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

SAVE EDUCATION

</button>



<p>{status}</p>


</div>










<div className="
mt-10
space-y-5
">


{


education.map(item=>(


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

{item.period}

</p>




<h2 className="text-xl">

{item.degree}

</h2>




<p>

{item.institution}

</p>




<p className="
mt-3
text-gray-400
">

{item.focus}

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