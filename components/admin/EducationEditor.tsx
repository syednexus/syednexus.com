"use client";


import { useEffect, useState } from "react";

import { profile } from "@/data/profile";

import NexusToast from "@/components/core/NexusToast";





type Education={

degree:string;

institution:string;

period:string;

field:string;

focus:string[];

};








export default function EducationEditor(){





const [education,setEducation]=useState<Education[]>([]);


const [editing,setEditing]=useState<string|null>(null);


const [toast,setToast]=useState("");








const [form,setForm]=useState({

degree:"",

institution:"",

period:"",

field:"",

focus:""

});











useEffect(()=>{



const saved =

localStorage.getItem("nexus_education");



if(saved){


setEducation(JSON.parse(saved));


}


else{


setEducation(profile.education);


}



},[]);









function notify(message:string){


setToast(message);


setTimeout(()=>{

setToast("");

},2500);


}









function save(){



if(!form.degree){

return;

}







const record:Education={

degree:form.degree,

institution:form.institution,

period:form.period,

field:form.field,

focus:

form.focus

.split(",")

.map(x=>x.trim())

};









let updated:Education[];





if(editing){



updated=

education.map(item=>

item.degree===editing

?

record

:

item

);



notify("Education updated successfully");



}



else{



updated=[

record,

...education

];



notify("Education added successfully");



}










setEducation(updated);





localStorage.setItem(

"nexus_education",

JSON.stringify(updated)

);








setEditing(null);





setForm({

degree:"",

institution:"",

period:"",

field:"",

focus:""

});




}











function edit(item:Education){



setEditing(item.degree);




setForm({

degree:item.degree,

institution:item.institution,

period:item.period,

field:item.field,

focus:item.focus.join(", ")

});



}











function remove(degree:string){





const updated=

education.filter(

item=>item.degree!==degree

);






setEducation(updated);






localStorage.setItem(

"nexus_education",

JSON.stringify(updated)

);





notify("Education removed");



}












return(

<div className="

border
border-blue-400/30
rounded-xl
p-5
bg-black/40

">







<NexusToast message={toast}/>









<p className="

text-blue-300
tracking-widest
text-sm

">

EDUCATION MANAGER

</p>










<input

placeholder="Degree"

value={form.degree}

onChange={(e)=>

setForm({

...form,

degree:e.target.value

})

}

className="admin-input"

/>











<input

placeholder="Institution"

value={form.institution}

onChange={(e)=>

setForm({

...form,

institution:e.target.value

})

}

className="admin-input"

/>











<input

placeholder="Period"

value={form.period}

onChange={(e)=>

setForm({

...form,

period:e.target.value

})

}

className="admin-input"

/>










<input

placeholder="Field"

value={form.field}

onChange={(e)=>

setForm({

...form,

field:e.target.value

})

}

className="admin-input"

/>











<input

placeholder="Focus areas comma separated"

value={form.focus}

onChange={(e)=>

setForm({

...form,

focus:e.target.value

})

}

className="admin-input"

/>










<button

onClick={save}

className="

mt-5

border
border-blue-400

px-5
py-2

rounded

nexus-hover

"

>


{

editing

?

"SAVE CHANGES"

:

"ADD EDUCATION"

}



</button>












<div className="mt-8 space-y-4">







{education.map(item=>(






<div

key={item.degree}

className="

border
border-blue-400/20

rounded-xl

p-4

bg-blue-400/5

nexus-hover

"

>






<h3>

🎓 {item.degree}

</h3>







<p className="text-gray-400">

{item.institution}

</p>









<div className="flex gap-4 mt-4">








<button

onClick={()=>edit(item)}

className="text-blue-300"

>

EDIT

</button>








<button

onClick={()=>remove(item.degree)}

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