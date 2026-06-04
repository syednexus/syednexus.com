export default function ContactSection(){

return(

<section
id="contact"
className="px-8 md:px-24 lg:px-40 py-20"
>


<h2 className="text-4xl font-bold">

Connect

</h2>



<div className="grid md:grid-cols-3 gap-6 mt-10">


<a
href="mailto:syed@syednexus.com"
className="
border border-gray-800
rounded-xl
p-6
hover:border-blue-500
transition
"
>


<h3 className="text-xl">

Email

</h3>


<p className="text-gray-400 mt-3">

syed@syednexus.com

</p>


</a>




<a
href="https://github.com/syednexus"
target="_blank"
className="
border border-gray-800
rounded-xl
p-6
hover:border-blue-500
transition
"
>


<h3 className="text-xl">

GitHub

</h3>


<p className="text-gray-400 mt-3">

github.com/syednexus

</p>


</a>





<a
href="https://linkedin.com/in/syedmohiuddin7"
target="_blank"
className="
border border-gray-800
rounded-xl
p-6
hover:border-blue-500
transition
"
>


<h3 className="text-xl">

LinkedIn

</h3>


<p className="text-gray-400 mt-3">

linkedin.com/in/syedmohiuddin7

</p>


</a>



</div>


</section>


);

}