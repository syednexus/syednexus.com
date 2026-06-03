export default function LabSection() {

return (

<section
id="lab"
className="px-8 md:px-24 lg:px-40 py-10"
>


<h2 className="text-4xl font-bold">

Nexus Lab

</h2>



<p className="mt-6 max-w-3xl text-gray-400 leading-8">

A personal infrastructure project focused on learning servers,
networking, security monitoring, self-hosting and real-world system
administration.

</p>





<div className="grid md:grid-cols-3 gap-6 mt-10">


<div className="border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition">


<h3 className="text-xl">

🖥 Server Infrastructure

</h3>


<p className="mt-4 text-gray-400">

Home server environment, virtualization, storage and service hosting.

</p>


</div>






<div className="border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition">


<h3 className="text-xl">

🌐 Networking

</h3>


<p className="mt-4 text-gray-400">

DNS, firewall rules, secure connectivity and network management.

</p>


</div>






<div className="border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition">


<h3 className="text-xl">

🔐 Security

</h3>


<p className="mt-4 text-gray-400">

Monitoring, security tools, hardening and cybersecurity experiments.

</p>


</div>



</div>



</section>

);

}