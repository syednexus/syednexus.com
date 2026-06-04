export default function LanguagesSection(){

return(

<section
id="languages"
className="px-8 md:px-24 lg:px-40 py-10"
>


<h2 className="text-4xl font-bold">

Languages

</h2>


<div className="grid md:grid-cols-2 gap-6 mt-10">


<div className="border border-gray-800 rounded-xl p-6">

<h3 className="text-xl">

Spoken Languages

</h3>


<ul className="mt-5 space-y-2 text-gray-400">

<li>English</li>

<li>Hindi</li>

<li>Urdu</li>

</ul>


</div>





<div className="border border-gray-800 rounded-xl p-6">

<h3 className="text-xl">

Programming Exposure

</h3>


<ul className="mt-5 space-y-2 text-gray-400">

<li>Python basics</li>

<li>HTML & CSS</li>

<li>JavaScript / TypeScript basics</li>

<li>Ruby basics</li>

</ul>


</div>



</div>


</section>


);

}