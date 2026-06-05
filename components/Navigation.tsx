export default function Navigation(){

const links=[
["About","#about"],
["Journey","#journey"],
["Skills","#skills"],
["Certs","#certifications"],
["Projects","#projects"],
["Lab","#lab"],
["Contact","#contact"],
];


return(

<nav className="
fixed top-0 left-0 w-full
flex justify-between items-center
px-8 md:px-24 lg:px-40
py-5
bg-[#08111f]/80
backdrop-blur
border-b border-slate-800
z-50
">


<h1 className="font-bold text-xl">
Syed Nexus
</h1>



<div className="hidden md:flex gap-6 text-gray-400 text-sm">


{links.map((link)=>(

<a
key={link[0]}
href={link[1]}
className="hover:text-blue-400 transition"
>

{link[0]}

</a>

))}


</div>


</nav>


);

}