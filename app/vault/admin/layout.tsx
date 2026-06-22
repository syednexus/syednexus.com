"use client";


import Link from "next/link";



export default function AdminLayout({

children

}:{

children:React.ReactNode

}){



return(

<>


<div className="
pt-28
px-10
flex
gap-4
">


<Link

href="/vault"

className="
border
border-green-500
text-green-400
px-4
py-2
rounded
"

>

← Vault

</Link>



<Link

href="/vault/admin"

className="
border
border-blue-500
text-blue-400
px-4
py-2
rounded
"

>

Admin Home

</Link>


</div>



{children}


</>


);


}