"use client";


import Link from "next/link";

import { useNexusSound } from "./NexusSound";

import NexusFeedback from "./NexusFeedback";


import {

signIn,

signOut,

useSession

} from "next-auth/react";








export default function NexusHeader(){



const {

data:session,

status

}=useSession();




const {

enabled,

toggleSound

}=useNexusSound();









return (

<header

className="

fixed
top-0
left-0
right-0

z-50

bg-black/80

backdrop-blur

border-b
border-green-900/40

"

>


<div

className="

max-w-7xl

mx-auto

px-6

py-4


flex

items-center

justify-between

"

>





{/* LOGO */}


<Link

href="/"

className="

text-green-400

font-bold

tracking-widest

"

>

SYED NEXUS

</Link>










{/* NAVIGATION */}


<nav

className="

hidden

md:flex

gap-6

text-sm

text-gray-400

"

>


<Link

href="/"

className="hover:text-green-400 transition"

>

Home

</Link>





<Link

href="/portfolio"

className="hover:text-green-400 transition"

>

Portfolio

</Link>






<Link

href="/soc"

className="hover:text-green-400 transition"

>

SOC

</Link>






<Link

href="/lab"

className="hover:text-green-400 transition"

>

Lab

</Link>






<Link

href="/games"

className="hover:text-green-400 transition"

>

Games

</Link>






<Link

href="/blogs"

className="hover:text-green-400 transition"

>

Blog

</Link>



</nav>









{/* ACTIONS */}


<div

className="

flex

items-center

gap-3

"

>



<NexusFeedback />







<button

onClick={toggleSound}


className="

border

border-green-700


px-3

py-1


rounded


text-xs

text-green-400


hover:bg-green-950


transition

"

>


{

enabled

?

"SOUND ON"

:

"SOUND OFF"

}


</button>









{/* AUTH AREA */}



{

status==="loading"

?

(

<span

className="

text-green-400

text-xs

"

>

...

</span>

)



:

!session

?

(

<button


onClick={()=>signIn("google")}


className="

border

border-green-700


px-4

py-1


rounded


text-green-400


hover:bg-green-950


transition

"

>

Login

</button>

)



:

(

<div

className="

flex

items-center

gap-3

text-green-400

"

>



<span

className="text-sm"

>


{

session.user?.name ??

"User"

}


</span>









{

session.user?.role==="OWNER"

&&

<Link


href="/vault"


className="

border

border-yellow-500


px-3

py-1


rounded


text-yellow-400

"

>

Control

</Link>

}








<button


onClick={()=>signOut()}


className="

border

border-red-700


px-3

py-1


rounded


text-red-400

"

>

Logout

</button>





</div>

)

}



</div>





</div>


</header>

);



}