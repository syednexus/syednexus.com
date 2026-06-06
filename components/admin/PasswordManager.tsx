"use client";


import { useEffect, useState } from "react";



export default function PasswordManager(){


const [password,setPassword]=useState("nexusroot");

const [newPass,setNewPass]=useState("");

const [message,setMessage]=useState("");





useEffect(()=>{


const stored =
window.localStorage.getItem("nexus_password");


if(stored){

setPassword(stored);

}


},[]);







function updatePassword(){



if(!newPass.trim()){

return;

}



window.localStorage.setItem(

"nexus_password",

newPass

);



setPassword(newPass);

setNewPass("");

setMessage(
"Password updated successfully"
);



}









return(

<div className="

border
border-red-400/30
rounded-xl
p-5
bg-black/40

">



<p className="
text-red-300
tracking-widest
text-sm
">

SECURITY CONFIGURATION

</p>





<p className="
mt-5
text-gray-400
text-sm
">

Current Password

</p>



<p>

{"*".repeat(password.length)}

</p>







<input

type="password"

value={newPass}

placeholder="New root password"

onChange={(e)=>setNewPass(e.target.value)}

className="

mt-5
w-full
bg-black
border
border-red-400/30
rounded
p-3

"

/>







<button

onClick={updatePassword}

className="

mt-4
border
border-red-400
px-4
py-2
rounded

"

>

UPDATE PASSWORD

</button>






<p className="
mt-3
text-green-400
text-sm
">

{message}

</p>




</div>

)


}