"use client";


import {

useEffect,

useState

} from "react";





export default function CookieConsent(){



const [show,setShow] =
useState(false);





useEffect(()=>{


const accepted =
localStorage.getItem(

"nexus_cookie_consent"

);



if(!accepted){

setShow(true);

}


},[]);









function accept(

type:"essential"|"all"

){



localStorage.setItem(

"nexus_cookie_consent",

type

);



localStorage.setItem(

"nexus_cookie_date",

new Date().toISOString()

);



setShow(false);



}








if(!show){

return null;

}









return(

<div

className="

fixed

bottom-6

left-1/2

-translate-x-1/2


z-50


w-[90%]

max-w-xl



bg-black/90

backdrop-blur



border

border-green-500/50


rounded-xl


p-5



shadow-xl

shadow-green-500/20



font-mono

"

>



<h2

className="

text-green-400

text-lg

mb-2

"

>

Nexus Privacy Control

</h2>





<p

className="

text-gray-400

text-sm

"

>


We use essential cookies for security,
authentication and improving the Nexus experience.


</p>






<div

className="

flex

justify-end

gap-3

mt-5

"

>



<button


onClick={()=>accept("essential")}


className="

border

border-gray-600

px-4

py-2

rounded


text-gray-300

"

>


Essential Only


</button>







<button


onClick={()=>accept("all")}


className="

border

border-green-500

px-4

py-2

rounded


text-green-400

"

>


Accept All


</button>





</div>





</div>


);



}