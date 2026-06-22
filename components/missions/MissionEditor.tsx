"use client";


import { useEffect,useState } from "react";



type Mission={

id?:number;

title:string;

slug:string;

type:string;

category:string;

difficulty:string;

description:string;

scenario:string;

content:string;

answer:string;

explanation:string;

xp:number;

};






const empty:Mission={

title:"",

slug:"",

type:"",

category:"",

difficulty:"Easy",

description:"",

scenario:"",

content:"",

answer:"",

explanation:"",

xp:50

};







export default function MissionEditor(){


const [missions,setMissions]=useState<Mission[]>([]);

const [form,setForm]=useState<Mission>(empty);





useEffect(()=>{

load();

},[]);






async function load(){

const res =
await fetch("/api/missions/admin");


setMissions(

await res.json()

);

}







async function save(){



await fetch("/api/missions",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(form)

});



setForm(empty);

load();


}








async function remove(id:number){


await fetch("/api/missions",{

method:"DELETE",

body:JSON.stringify({

id

})

});


load();


}









function update(

key:keyof Mission,

value:any

){


setForm({

...form,

[key]:value

});


}











return(

<div className="space-y-10">



<div className="
border
border-green-800
rounded-xl
p-6
space-y-4
">



<h2 className="text-2xl">

CREATE MISSION

</h2>






{

[
"title",
"slug",
"category",
"description",
"scenario",
"content",
"answer",
"explanation"

].map(field=>(



<textarea

key={field}

placeholder={field}

value={(form as any)[field]}

onChange={(e)=>

update(field as keyof Mission,e.target.value)

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








<select

value={form.type}

onChange={(e)=>update("type",e.target.value)}

className="bg-black border border-green-700 p-3"

>


<option>

LINUX_GAME

</option>

<option>

PORT_HUNTER

</option>

<option>

SOC_ALERT

</option>

<option>

ATTACK_LAB

</option>


<option>

FORENSIC

</option>


<option>

QUIZ

</option>


</select>






<input

type="number"

value={form.xp}

onChange={(e)=>update("xp",e.target.value)}

className="
bg-black
border
border-green-700
p-3
"

/>








<button

onClick={save}

className="
border
border-green-500
px-6
py-3
"

>

SAVE MISSION

</button>




</div>









<div className="grid md:grid-cols-3 gap-5">


{


missions.map(m=>(


<div

key={m.id}

className="
border
border-green-900
rounded-xl
p-5
"

>



<p className="text-blue-400">

{m.type}

</p>



<h3 className="text-xl">

{m.title}

</h3>



<p>

XP {m.xp}

</p>



<button

onClick={()=>remove(m.id!)}

className="text-red-400 mt-5"

>

DELETE

</button>




</div>


))


}


</div>



</div>


);


}