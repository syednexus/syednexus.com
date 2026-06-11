"use client";


import { useEffect,useState } from "react";



type Memory={

id:number;

category:string;

content:string;

};





export default function AiMemoryEditor(){


const [items,setItems]=useState<Memory[]>([]);



const [form,setForm]=useState({

category:"",

content:""

});






useEffect(()=>{

load();

},[]);





async function load(){


const res =
await fetch("/api/ai/memory");


setItems(await res.json());


}






async function save(){


if(!form.category || !form.content){

return;

}



await fetch(

"/api/ai/memory",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(form)

}

);




setForm({

category:"",

content:""

});



load();


}







return(

<div className="space-y-5">


<h2 className="text-purple-300">

🧠 NEXUS AI MEMORY

</h2>





<input

className="admin-input"

placeholder="Memory Category"

value={form.category}

onChange={e=>

setForm({

...form,

category:e.target.value

})

}

/>






<textarea

className="admin-input min-h-32"

placeholder="Memory Content"

value={form.content}

onChange={e=>

setForm({

...form,

content:e.target.value

})

}

/>





<button

onClick={save}

className="border border-purple-400 px-5 py-2 rounded"

>

SAVE MEMORY

</button>






<div className="space-y-3">


{

items.map(memory=>(


<div

key={memory.id}

className="border border-purple-400/20 p-4 rounded"

>


<p className="text-purple-300">

{memory.category}

</p>


<p className="text-gray-300 text-sm">

{memory.content}

</p>



</div>


))

}


</div>



</div>

);


}