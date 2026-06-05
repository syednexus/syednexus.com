export default function SystemLog(
{
logs
}:{
logs:string[]
}){


return(

<div className="
bg-black/50
border
rounded-xl
p-5
">


SYSTEM LOG


{logs.map((x,i)=>

<p key={i}>

[+] {x}

</p>

)}


</div>

)

}