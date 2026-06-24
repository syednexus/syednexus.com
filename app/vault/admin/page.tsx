import ContentDashboard from "@/components/vault/ContentDashboard";



export default function ContentManager(){


return(

<main

className="
min-h-screen
bg-black
text-green-400
px-4
py-10
sm:p-10
font-mono
"

>


<section className="max-w-7xl mx-auto">


<p className="text-xs text-gray-500">

root@nexus:/admin/content#

</p>



<h1

className="
text-2xl
sm:text-4xl
lg:text-5xl
font-bold
mt-5
"

>

CONTENT MANAGER

</h1>



<p className="mt-5 text-gray-400">

Live Nexus database control.

</p>



<ContentDashboard />



</section>


</main>


);


}