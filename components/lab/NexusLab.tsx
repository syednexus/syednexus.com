"use client";


import { useEffect, useState } from "react";

// LAB MODULES

import Terminal from "./Terminal";
import NodeMap from "./NodeMap";
import MissionPanel from "./MissionPanel";
import SystemLog from "./SystemLog";
import BootScreen from "./BootScreen";
import StatusBar from "./StatusBar";
import RootPanel from "./RootPanel";
import LabIdentity from "./LabIdentity";
import SecurityArsenal from "./SecurityArsenal";


// ADMIN AUTH

import AdminLogin from "@/components/admin/AdminLogin";
import LogoutButton from "@/components/admin/LogoutButton";

// TYPES

import { AccessLevel } from "@/types/access";





type Props = {

access:AccessLevel;

setAccess:(access:AccessLevel)=>void;

};









export default function NexusLab({

access,

setAccess

}:Props){








const hasAccess =

access==="root" ||

access==="owner";








const [booted,setBooted] =

useState(

hasAccess

);








const [unlocked,setUnlocked] =

useState<string[]>(

hasAccess

?

[

"IDENTITY",

"SKILLS",

"PROJECTS",

"CERTS"

]

:

[]

);









const [completed,setCompleted] =

useState(

hasAccess

);









const [logs,setLogs] =

useState<string[]>([

access==="owner"

?

"[OWNER] Administrator session restored"

:

"[+] Guest session initialized"

]);









function unlock(name:string){



setUnlocked(prev=>{



if(prev.includes(name)){

return prev;

}




setLogs(old=>[

...old,

`[+] ${name} archive unlocked`

]);




return [

...prev,

name

];


});


}










useEffect(()=>{



if(

unlocked.length>=4 &&

!completed

){



setCompleted(true);



setAccess("root");




setLogs(prev=>[

...prev,

"[ROOT] Vault reconstruction complete",

"[ROOT] Read-only profile access granted"

]);


}



},[

unlocked,

completed,

setAccess

]);












// OWNER COOKIE SESSION RESTORE


useEffect(()=>{



if(access==="owner"){



setBooted(true);



setUnlocked([

"IDENTITY",

"SKILLS",

"PROJECTS",

"CERTS"

]);




setCompleted(true);





setLogs(prev=>{



if(

prev.includes(

"[OWNER] Administrator privileges activated"

)

){

return prev;

}



return [

...prev,

"[OWNER] Administrator privileges activated"

];


});


}



},[access]);












// SECURE LOGIN SCREEN


if(access==="auth"){


return(

<AdminLogin

success={()=>setAccess("root")}

/>

);


}










if(!booted){


return(

<BootScreen

complete={()=>setBooted(true)}

/>

);


}









return(

<main

className="

min-h-screen

bg-linear-to-br

from-[#020617]

via-[#081b33]

to-[#14091f]

text-white

"

>






<StatusBar

unlocked={unlocked}

access={access}



/>




{

access==="owner"

&&

(

<div className="p-5">

<LogoutButton

setAccess={setAccess}

/>

</div>

)

}



<section className="p-6 space-y-6">



<LabIdentity/>








<div className="grid grid-cols-12 gap-6">









<aside className="col-span-12 xl:col-span-3 space-y-6">


<MissionPanel

unlocked={unlocked}

/>


<SecurityArsenal/>


</aside>











<section

className="

col-span-12

xl:col-span-6

flex

items-center

justify-center

"

>


{

completed

?

<RootPanel

access={access}

/>

:

<NodeMap

unlocked={unlocked}

/>

}


</section>









<aside className="col-span-12 xl:col-span-3 space-y-5">


<SystemLog

logs={logs}

/>


<Terminal

unlock={unlock}

setAccess={setAccess}

access={access}

/>

</aside>








</div>



</section>





</main>

);



}