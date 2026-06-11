"use client";


import {useState} from "react";



export default function AdminLogin({

success

}:{

success:()=>void

}){


const [password,setPassword]=useState("");

const [recoveryKey,setRecoveryKey]=useState("");

const [newPassword,setNewPassword]=useState("");


const [recover,setRecover]=useState(false);


const [message,setMessage]=useState("");






async function login(){



const res=

await fetch("/api/auth/login",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

password

})

});






if(res.ok){

success();

}

else{

setMessage("ACCESS DENIED");

}


}









async function recoverPassword(){



const res=

await fetch("/api/auth/recover",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

recoveryKey,

newPassword

})

});






const data=

await res.json();





if(data.success){


setMessage("Password recovered successfully");


setRecover(false);


}


else{


setMessage(

data.error ||

"Recovery failed"

);


}



}









return(

<div className="
min-h-screen
flex
items-center
justify-center
bg-black
font-mono
">


<div className="
border
border-red-400/30
rounded-xl
p-10
w-96
">


<h1 className="
text-red-400
text-xl
mb-5
">

NEXUS ROOT LOGIN

</h1>








{!recover ? (

<>


<input

type="password"

value={password}

onChange={e=>setPassword(e.target.value)}

className="
w-full
bg-black
border
border-red-400
p-3
"

placeholder="Root Password"

/>






<button

onClick={login}

className="
block
mt-5
border
border-green-400
px-5
py-2
"

>

ACCESS

</button>








<button

onClick={()=>setRecover(true)}

className="
mt-5
text-sm
text-purple-300
hover:underline
"

>

Forgot password?

</button>



</>


)

:

(

<>


<p className="
text-purple-300
text-sm
mb-4
">

RECOVERY MODE

</p>





<input

value={recoveryKey}

onChange={e=>setRecoveryKey(e.target.value)}

placeholder="Recovery Key"

className="
w-full
bg-black
border
border-purple-400
p-3
mb-3
"

/>







<input

type="password"

value={newPassword}

onChange={e=>setNewPassword(e.target.value)}

placeholder="New Password"

className="
w-full
bg-black
border
border-purple-400
p-3
"

/>







<button

onClick={recoverPassword}

className="
mt-5
border
border-green-400
px-5
py-2
"

>

RESET PASSWORD

</button>







<button

onClick={()=>setRecover(false)}

className="
block
mt-5
text-gray-400
text-sm
"

>

← Back to login

</button>




</>

)

}








<p className="
text-red-400
mt-5
text-sm
">

{message}

</p>



</div>


</div>

);


}