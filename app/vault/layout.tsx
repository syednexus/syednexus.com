import Link from "next/link";

import VaultActivityPing from "@/components/security/VaultActivityPing";

export default function VaultLayout({

children

}:{

children:React.ReactNode

}){



return(

<>

<VaultActivityPing />

<div

className="
fixed
top-24
left-5

z-40

flex
gap-3
"

>



<Link

href="/vault"

className="
border
border-green-600

text-green-400

px-4
py-2

rounded

bg-black

hover:bg-green-950

transition

font-mono

text-sm
"

>

← Vault

</Link>





<Link

href="/vault/security"

className="
border
border-amber-600

text-amber-400

px-4
py-2

rounded

bg-black

hover:bg-amber-950

transition

font-mono

text-sm
"

>

Security

</Link>





<Link

href="/vault/admin"

className="
border
border-blue-600

text-blue-400

px-4
py-2

rounded

bg-black

hover:bg-blue-950

transition

font-mono

text-sm
"

>

Admin

</Link>





<Link

href="/"

className="
border
border-gray-600

text-gray-300

px-4
py-2

rounded

bg-black

hover:bg-gray-900

transition

font-mono

text-sm
"

>

Home

</Link>





</div>





<div

className="
pt-16
"

>

{children}

</div>




</>


);



}