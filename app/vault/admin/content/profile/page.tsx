import ProfileEditor from "@/components/vault/ProfileEditor";



export default function ProfileManager(){


return(

<main

className="
min-h-screen
bg-black
text-green-400
p-10
font-mono
"

>


<section className="max-w-5xl mx-auto">


<p className="text-xs text-gray-500">

root@nexus:/content/profile#

</p>


<h1 className="
text-5xl
font-bold
mt-5
">

PROFILE MANAGER

</h1>


<p className="
mt-5
text-gray-400
">

Update Nexus Identity Core.

</p>


<ProfileEditor />


</section>


</main>

);


}