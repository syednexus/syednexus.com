import EducationEditor from "@/components/vault/EducationEditor";



export default function EducationPage(){


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

root@nexus:/content/education#

</p>



<h1 className="
text-5xl
font-bold
mt-5
">

EDUCATION MANAGER

</h1>



<p className="
mt-5
text-gray-400
">

Manage academic timeline and qualifications.

</p>



<EducationEditor />


</section>


</main>


);


}