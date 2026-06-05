export default function SkillsSection(){

const skills=[
"Linux",
"Networking",
"Python",
"Security",
"Git",
"Docker",
"Web Security",
"Cloud Basics"
];


return(

<section
id="skills"
className="px-8 md:px-24 lg:px-40 py-10"
>


<h2 className="text-4xl font-bold">

Currently Learning

</h2>


<div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">


{skills.map(skill=>(


<div
key={skill}
className="
border border-slate-700/60
bg-slate-900/50
rounded-xl
p-5
text-center
hover:border-blue-500
transition
"
>

{skill}

</div>


))}


</div>


</section>

);

}