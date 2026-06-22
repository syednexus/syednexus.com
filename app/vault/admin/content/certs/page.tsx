import CertificationEditor from "@/components/vault/CertificationEditor";



export default function CertPage(){


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

root@nexus:/content/certs#

</p>



<h1 className="
text-5xl
font-bold
mt-5
">

CERTIFICATION MANAGER

</h1>



<p className="mt-5 text-gray-400">

Manage Nexus achievements and certifications.

</p>



<CertificationEditor />


</section>


</main>

);


}