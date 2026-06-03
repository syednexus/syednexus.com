export default function Navigation(){

return (

<nav className="
fixed top-0 left-0 w-full
flex justify-between items-center
px-8 md:px-24 lg:px-40
py-5
bg-[#050B14]/80
backdrop-blur
border-b border-gray-900
z-50
">


<h1 className="font-bold text-xl">
Syed Nexus
</h1>


<div className="hidden md:flex gap-6 text-gray-400">


<a className="hover:text-blue-400 transition" href="#about">
About
</a>

<a className="hover:text-blue-400 transition" href="#journey">
Journey
</a>

<a className="hover:text-blue-400 transition" href="#skills">
Skills
</a>

<a className="hover:text-blue-400 transition" href="#lab">
Lab
</a>

<a className="hover:text-blue-400 transition" href="#contact">
Contact
</a>


</div>


</nav>

);

}