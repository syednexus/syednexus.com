export default function ContactSection(){


const contacts=[

{
name:"Email",
value:"syed@syednexus.com"
},

{
name:"GitHub",
value:"github.com/syednexus"
},

{
name:"LinkedIn",
value:"linkedin.com/in/syedmohiuddin7"
}

];



return(

<section
id="contact"

className="
px-6
sm:px-10
md:px-24
lg:px-40
py-20
"
>


<h2 className="
text-4xl
font-bold
">

Connect

</h2>



<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-8
mt-12
">


{contacts.map(item=>(


<div

key={item.name}

className="
border
border-slate-700
rounded-xl
p-8
bg-slate-900/40
hover:border-cyan-400
transition
min-h-36
"


>


<h3 className="
text-2xl
">

{item.name}

</h3>


<p className="
text-slate-400
mt-5
break-all
">

{item.value}

</p>



</div>


))}


</div>


</section>


)


}