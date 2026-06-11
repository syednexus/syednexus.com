"use client";


import { useEffect,useState } from "react";
import { profile } from "@/data/profile";
import NexusToast from "@/components/core/NexusToast";



type Identity={

id?:number;

name:string;

headline:string;

summary:string;

location?:string|null;

avatar?:string|null;

email?:string|null;

};





export default function IdentityEditor(){



const [identity,setIdentity]=useState<Identity>({

name:profile.identity.name,

headline:profile.identity.headline,

summary:profile.identity.summary,

avatar:profile.identity.avatar,

location:profile.identity.location,

email:Array.isArray(profile.identity.email)
?
profile.identity.email[0]
:
profile.identity.email

});



const [loading,setLoading]=useState(true);

const [toast,setToast]=useState("");






useEffect(()=>{

loadIdentity();

},[]);







async function loadIdentity(){


try{


const res =
await fetch("/api/identity");


const data =
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


setTimeout(()=>setToast(""),2500);


}








async function save(){



try{


const res =
await fetch("/api/identity",{

method:"POST",

credentials:"include",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify(identity)

});






if(!res.ok){


notify("Unauthorized - login again");


return;


}





notify("Identity saved successfully");


}



catch(error){


console.error(error);


notify("Database save failed");


}


}











function uploadImage(

e:React.ChangeEvent<HTMLInputElement>

){



const file =
e.target.files?.[0];



if(!file){

return;

}

const isJpeg =

file.type==="image/jpeg"

&&

/\.(jpe?g)$/i.test(file.name);


if(!isJpeg){

notify("Profile picture must be a JPG or JPEG file");

e.target.value="";

return;

}





if(file.size > 1000000){


notify("Image must be below 1MB");

e.target.value="";


return;


}






const reader =
new FileReader();




reader.onload=()=>{


setIdentity({

...identity,

avatar:reader.result as string

});



notify("Profile picture updated");


};




reader.readAsDataURL(file);



}









function removeImage(){



setIdentity({

...identity,

avatar:null

});



notify("Profile picture removed");


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







<p className="text-red-300 tracking-widest text-sm">

👑 IDENTITY DATABASE MANAGER

</p>









<div className="flex items-center gap-6">



<img

src={identity.avatar || "/profile.jpg"}


className="

w-32

h-32

rounded-full

border

border-red-400

object-cover

shadow-lg

shadow-red-500/20

"

/>





<div className="space-y-3">


<label

className="

block

border

border-cyan-400

rounded-lg

px-4

py-2

text-cyan-300

cursor-pointer

hover:bg-cyan-400/10

"

>

CHANGE IMAGE


<input

hidden

type="file"

accept=".jpg,.jpeg,image/jpeg"

onChange={uploadImage}

/>


</label>






<button

onClick={removeImage}

className="

border

border-red-400

rounded-lg

px-4

py-2

text-red-300

hover:bg-red-400/10

"

>

REMOVE IMAGE

</button>



</div>


</div>











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









<button

onClick={save}

className="

border

border-green-400

rounded-xl

px-5

py-3

text-green-300

hover:bg-green-400/10

"

>

SAVE IDENTITY

</button>







</div>

);



}
