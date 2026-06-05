export default function MissionPanel(
{
unlocked
}:{
unlocked:string[]
}){


return(

<div className="
border
rounded-xl
p-5
h-full
">


<h2>
MISSIONS
</h2>



{["IDENTITY","SKILLS","PROJECTS","CERTS"].map(x=>(


<p key={x}>

{unlocked.includes(x)?"✅":"⬜"} {x}


</p>


))}


</div>

)

}