"use client";


import { useState } from "react";


import { profile } from "@/data/profile";


import IdentityEditor from "./IdentityEditor";
import EducationEditor from "./EducationEditor";
import CertificationEditor from "./CertificationEditor";
import ProjectEditor from "./ProjectEditor";
import BlogEditor from "./BlogEditor";
import PasswordManager from "./PasswordManager";
import ExperienceEditor from "./ExperienceEditor";
import SkillEditor from "./SkillEditor";






type Module =
"home" |
"identity" |
"education" |
"experience" |
"skills" |
"certs" |
"projects" |
"blogs" |
"security";







export default function AdminConsole(){





const [active,setActive]=useState<Module>("home");








const modules:{id:Module;icon:string;name:string;desc:string}[]=[






{
id:"identity",
icon:"👤",
name:"Identity Manager",
desc:"Update profile information"
},






{
id:"education",
icon:"🎓",
name:"Education Manager",
desc:"Manage education records"
},






{
id:"experience",
icon:"💼",
name:"Career Manager",
desc:"Manage professional experience"
},

{

id:"skills",

icon:"🧠",

name:"Capability Matrix",

desc:"Manage cybersecurity, tools and healthcare skills"

},




{
id:"certs",
icon:"🛡",
name:"Certification Vault",
desc:"Manage certificates"
},






{
id:"projects",
icon:"⚔",
name:"Project Database",
desc:"Manage projects"
},






{
id:"blogs",
icon:"📝",
name:"Blog Console",
desc:"Publish research logs"
},






{
id:"security",
icon:"🔐",
name:"Security Settings",
desc:"Admin credentials"
}





];









return(

<div className="

border
border-red-400/30
rounded-2xl
bg-black/50
p-6
font-mono

">








{/* HEADER */}


<div className="flex justify-between">


<p className="

text-red-300
tracking-widest
text-sm

">

ROOT ADMIN CONTROL PANEL

</p>





<button

onClick={()=>setActive("home")}

className="text-gray-400 text-xs"

>

HOME

</button>



</div>











{/* OWNER */}



<div className="

flex
gap-5
items-center
mt-6

">



<img

src={profile.identity.avatar || "/profile.jpg"}

className="

w-20
h-20
rounded-full
border
border-red-400
object-cover

"

/>





<div>


<h2 className="text-2xl">

{profile.identity.name}

</h2>




<p className="text-gray-400 text-sm">

SYSTEM OWNER

</p>


</div>




</div>











{/* MENU */}


{active==="home" && (

<div className="

grid
md:grid-cols-2
gap-4
mt-8

">






{modules.map(item=>(


<button

key={item.id}

onClick={()=>setActive(item.id)}

className="

border
border-red-400/20
rounded-xl
p-5
text-left
nexus-hover

"

>





<h3>

{item.icon} {item.name}

</h3>




<p className="

text-sm
text-gray-400
mt-2

">

{item.desc}

</p>





</button>


))}




</div>

)}









{/* MODULE RENDER */}


<div className="mt-8">



{active==="identity" &&

<IdentityEditor/>

}



{active==="education" &&

<EducationEditor/>

}



{active==="experience" &&

<ExperienceEditor/>

}

{active==="skills" &&

<SkillEditor/>

}

{active==="certs" &&

<CertificationEditor/>

}



{active==="projects" &&

<ProjectEditor/>

}



{active==="blogs" &&

<BlogEditor/>

}



{active==="security" &&

<PasswordManager/>

}



</div>







</div>


);



}