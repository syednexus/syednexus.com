"use client";


import { useState } from "react";



export default function PasswordManager(){


const [currentPassword,setCurrentPassword]=useState("");

const [newPassword,setNewPassword]=useState("");

const [confirm,setConfirm]=useState("");

const [message,setMessage]=useState("");

const [loading,setLoading]=useState(false);






async function updatePassword(){



if(

!currentPassword ||

!newPassword ||

!confirm

){


setMessage("Complete all password fields");

return;


}




if(newPassword.length < 8){


setMessage("Password requires minimum 8 characters");

return;


}





if(newPassword!==confirm){


setMessage("Passwords do not match");

return;


}







setLoading(true);







const res =
await fetch(

"/api/admin/password",

{

method:"POST",

credentials:"include",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

currentPassword,

newPassword

})


}

);







const data =
await res.json();






if(res.ok){



setMessage(

"Password updated successfully"

);



setCurrentPassword("");

setNewPassword("");

setConfirm("");



}



else{


setMessage(

data.error ||

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
Authentication: DATABASE
</p>

<p>
Storage: BCRYPT HASH
</p>

<p>
Session: HMAC SIGNED TOKEN
</p>


</div>










<input

type="password"

value={currentPassword}

placeholder="Current password"

onChange={e=>setCurrentPassword(e.target.value)}

className="admin-input"

/>









<input

type="password"

value={newPassword}

placeholder="New password"

onChange={e=>setNewPassword(e.target.value)}

className="admin-input"

/>










<input

type="password"

value={confirm}

placeholder="Confirm new password"

onChange={e=>setConfirm(e.target.value)}

className="admin-input"

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

hover:bg-red-400/10

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