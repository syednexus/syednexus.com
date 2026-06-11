"use client";


import { AccessLevel } from "@/types/access";




type Props={

setAccess:(x:AccessLevel)=>void;

};





export default function LogoutButton({

setAccess

}:Props){





async function logout(){



await fetch(

"/api/auth/logout",

{

method:"POST"

}

);




setAccess("visitor");



window.location.reload();



}









return(

<button

onClick={logout}

className="

border
border-red-400
text-red-300
px-4
py-2
rounded-lg
hover:bg-red-500/10

"

>

CLEAR ADMIN SESSION

</button>

);


}