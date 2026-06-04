export default function JourneySection(){

const data=[
["🎓 Pharmacy","Healthcare knowledge, research and problem solving."],
["⚙️ Operations","Experience with processes and operational systems."],
["🔐 Cybersecurity","Learning Linux, networking and security."]
];


return(

<section
id="journey"
className="px-8 md:px-24 lg:px-40 py-10"
>


<h2 className="text-4xl font-bold">

Journey

</h2>


<div className="grid md:grid-cols-3 gap-6 mt-10">


{data.map((item)=>(


<div
key={item[0]}
className="border border-slate-700/60
bg-slate-900/50
rounded-xl
p-6
hover:border-blue-500
transition"
>


<h3 className="text-xl">

{item[0]}

</h3>


<p className="mt-3 text-gray-400">

{item[1]}

</p>


</div>


))}


</div>


</section>

);

}