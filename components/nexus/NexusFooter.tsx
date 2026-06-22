"use client";


import Link from "next/link";



export default function NexusFooter(){



const year =
new Date().getFullYear();





return (

<footer

className="

border-t
border-green-900/40

bg-black

font-mono

"

>



<div

className="

max-w-7xl

mx-auto

px-6

py-6



flex

flex-col

md:flex-row



items-center

justify-between



gap-4

"

>





<div>


<p

className="

text-green-400

tracking-widest

text-sm

"

>

SYED NEXUS

</p>




<p

className="

text-gray-500

text-xs

mt-1

"

>

© {year} Syed Nexus. All rights reserved.


</p>


</div>








<div

className="

flex

gap-5



text-xs

text-gray-400

"

>



<Link

href="/nexus"

className="hover:text-green-400"

>

Nexus OS

</Link>




<Link

href="/security"

className="hover:text-green-400"

>

Security

</Link>





<Link

href="/privacy"

className="hover:text-green-400"

>

Privacy

</Link>





<Link

href="/"

className="hover:text-green-400"

>

Gateway

</Link>




</div>





</div>


</footer>

);



}