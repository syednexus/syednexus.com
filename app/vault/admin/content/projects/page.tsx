import ProjectsEditor from "@/components/vault/ProjectsEditor";

export default function ProjectsManager(){


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

root@nexus:/content/projects#

</p>



<h1 className="
text-5xl
font-bold
mt-5
">

PROJECT MANAGER

</h1>


<p className="mt-5 text-gray-400">

Create, update and remove Nexus projects.

</p>



<ProjectsEditor />


</section>


</main>

);


}