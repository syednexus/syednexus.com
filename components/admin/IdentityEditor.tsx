"use client";


import { useEffect,useState } from "react";

import NexusToast from "@/components/core/NexusToast";





type Identity={

id?:number;

name:string;

headline:string;

summary:string;

location?:string|null;

avatar?:string|null;

email?:string|null;

linkedin?:string|null;

github?:string|null;

resume?:string|null;

};










export default function IdentityEditor(){





const [identity,setIdentity]=useState<Identity>({

name:"",

headline:"",

summary:"",

avatar:null,

location:null,

email:null,

linkedin:null,

github:null,

resume:null

});



const [loading,setLoading]=useState(true);

const [toast,setToast]=useState("");











useEffect(()=>{


loadIdentity();


},[]);









async function loadIdentity(){


try{


const res=

await fetch("/api/identity");



const data=

await res.json();





if(data){


setIdentity(data);


}



}


catch(error){


console.error(error);


}



setLoading(false);


}










function notify(msg:string){


setToast(msg);



setTimeout(()=>{


setToast("");


},2500);


}










async function save(){


try{


await fetch(

"/api/identity",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify(identity)

}

);




notify(

"Identity saved to Nexus Database"

);



}



catch(error){


console.error(error);


notify(

"Database save failed"

);


}



}









async function uploadResume(

e:React.ChangeEvent<HTMLInputElement>

){



const file=

e.target.files?.[0];



if(!file){

return;

}





if(file.type!=="application/pdf"){


notify(

"Resume must be a PDF file"

);


e.target.value="";


return;


}





if(file.size > 2*1024*1024){


notify(

"Resume must be below 2MB"

);


e.target.value="";


return;


}






const form=

new FormData();



form.append(

"resume",

file

);





try{


const res=

await fetch(

"/api/upload/resume",

{

method:"POST",

body:form

}

);





if(!res.ok){


notify(

"Resume upload rejected"

);


return;


}





const data=

await res.json();





if(data.success){



const updated={

...identity,

resume:data.path

};




setIdentity(updated);






await fetch(

"/api/identity",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify(updated)

}

);






notify(

"Resume uploaded and saved"

);



}



else{


notify(

"Resume upload failed"

);


}



}



catch(error){


console.error(error);


notify(

"Resume upload error"

);


}



}









function uploadImage(

e:React.ChangeEvent<HTMLInputElement>

){



const file=

e.target.files?.[0];



if(!file){

return;

}



const isJpeg=

file.type==="image/jpeg"

&&

/\.(jpe?g)$/i.test(file.name);





if(!isJpeg){


notify(

"Profile picture must be JPG/JPEG"

);


e.target.value="";


return;


}






if(file.size > 1000000){


notify(

"Image must be below 1MB"

);


e.target.value="";


return;


}






const reader=

new FileReader();




reader.onload=()=>{


setIdentity({

...identity,

avatar:reader.result as string

});


};




reader.readAsDataURL(file);


}









if(loading){


return(

<p className="text-green-400">

Loading Identity...

</p>

);


}











return(

<div className="space-y-5">





<NexusToast message={toast}/>






<p className="
text-red-300
tracking-widest
text-sm
">

IDENTITY DATABASE MANAGER

</p>






<img

src={identity.avatar || "/profile.jpg"}

alt={identity.name || "Profile"}

className="
w-28
h-28
rounded-full
border
border-red-400
object-cover
"

/>







<input

type="file"

accept=".jpg,.jpeg,image/jpeg"

onChange={uploadImage}

className="text-sm"

/>








<input

value={identity.name}

onChange={e=>

setIdentity({

...identity,

name:e.target.value

})

}

placeholder="Name"

className="admin-input"

/>








<input

value={identity.headline}

onChange={e=>

setIdentity({

...identity,

headline:e.target.value

})

}

placeholder="Headline"

className="admin-input"

/>









<textarea

value={identity.summary}

onChange={e=>

setIdentity({

...identity,

summary:e.target.value

})

}

placeholder="Summary"

className="admin-input min-h-40"

/>









<input

value={identity.email || ""}

onChange={e=>

setIdentity({

...identity,

email:e.target.value

})

}

placeholder="Email"

className="admin-input"

/>








<input

value={identity.location || ""}

onChange={e=>

setIdentity({

...identity,

location:e.target.value

})

}

placeholder="Location"

className="admin-input"

/>








<input

value={identity.linkedin || ""}

onChange={e=>

setIdentity({

...identity,

linkedin:e.target.value

})

}

placeholder="LinkedIn URL"

className="admin-input"

/>








<input

value={identity.github || ""}

onChange={e=>

setIdentity({

...identity,

github:e.target.value

})

}

placeholder="GitHub URL"

className="admin-input"

/>











<div className="space-y-3">


<p className="
text-red-300
text-xs
">

RESUME VAULT

</p>





<input

type="file"

accept="application/pdf,.pdf"

onChange={uploadResume}

className="text-sm"

/>





{

identity.resume && (

<p className="
text-green-400
text-xs
">

✓ Resume stored: {identity.resume}

</p>

)

}



</div>









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

SAVE TO DATABASE

</button>








</div>

);


}