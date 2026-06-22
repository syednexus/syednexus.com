import ExperienceEditor from "@/components/vault/ExperienceEditor";



export default function ExperiencePage(){


return(

<main className="
min-h-screen
bg-black
text-green-400
p-10
font-mono
">


<section className="max-w-6xl mx-auto">


<p className="text-xs text-gray-500">

root@nexus:/content/experience#

</p>



<h1 className="
text-5xl
font-bold
mt-5
">

EXPERIENCE MANAGER

</h1>



<p className="mt-5 text-gray-400">

Manage career timeline and professional history.

</p>



<ExperienceEditor />


</section>


</main>

);


}