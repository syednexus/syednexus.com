"use client";


import { useState } from "react";



export default function PasswordManager(){


const [password,setPassword]=useState("");

const [confirm,setConfirm]=useState("");

const [message,setMessage]=useState("");

const [loading,setLoading]=useState(false);






async function updatePassword(){


if(!password || !confirm){


setMessage("Enter password fields");

return;


}



if(password!==confirm){


setMessage("Passwords do not match");

return;


}




setLoading(true);




const res =
await fetch(

"/api/admin/password",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

password

})

}

);






if(res.ok){


setMessage(
"Password updated successfully"
);


setPassword("");

setConfirm("");


}


else{


setMessage(
"Password update failed"
);


}



setLoading(false);


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





<div className="
mt-5
text-sm
space-y-2
text-green-400
">

<p>
Authentication:DATABASE
</p>

<p>
Password Source:PRISMA HASH
</p>

<p>
Encryption:BCRYPT
</p>

</div>









<input

type="password"

value={password}

placeholder="New password"

onChange={e=>setPassword(e.target.value)}

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







<input

type="password"

value={confirm}

placeholder="Confirm password"

onChange={e=>setConfirm(e.target.value)}

className="

mt-3
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

disabled={loading}

className="

mt-4
border
border-red-400
px-4
py-2
rounded

"

>


{

loading

?

"UPDATING..."

:

"UPDATE PASSWORD"

}


</button>






<p className="
mt-3
text-green-400
text-sm
">

{message}

</p>



</div>

);

}