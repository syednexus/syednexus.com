import SkillsEditor from "@/components/vault/SkillsEditor";



export default function SkillsPage(){


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

root@nexus:/content/skills#

</p>



<h1 className="
text-5xl
font-bold
mt-5
">

SKILLS MANAGER

</h1>



<p className="mt-5 text-gray-400">

Manage Nexus cybersecurity skills database.

</p>




<SkillsEditor />


</section>


</main>


);


}