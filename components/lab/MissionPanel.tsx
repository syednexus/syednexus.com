"use client";


type Props={

unlocked:string[];

};





export default function MissionPanel({

unlocked

}:Props){





const skills=[


{
name:"Linux Operations",
level:80
},


{
name:"Network Security",
level:70
},


{
name:"Web Security",
level:50
},


{
name:"Security Operations",
level:45
}


];








const archives=[

"IDENTITY",

"SKILLS",

"PROJECTS",

"CERTS"

];









return(

<div className="

border
border-cyan-400/30

rounded-2xl

bg-black/40

p-5

font-mono

shadow-lg

shadow-cyan-500/10

">









<p className="

text-cyan-300

tracking-widest

text-sm

">

MISSION CONTROL

</p>











{/* SKILL LEVELS */}


<div className="

mt-6

space-y-5

">







{skills.map(skill=>(




<div

key={skill.name}

className="

rounded-xl

p-2

nexus-hover

"

>






<div className="

flex

justify-between

text-sm

">



<span>

{skill.name}

</span>





<span className="text-cyan-300">

{skill.level}%

</span>






</div>








<div className="

h-2

bg-gray-800

rounded

mt-2

overflow-hidden

">






<div

style={{

width:`${skill.level}%`

}}


className="

h-full

bg-cyan-400

rounded

"

/>






</div>





</div>





))}








</div>













{/* ARCHIVES */}


<div className="

mt-8

border-t

border-cyan-400/20

pt-5

">






<p className="

text-xs

text-gray-400

">

ARCHIVE STATUS

</p>









<div className="

mt-4

space-y-3

">







{archives.map(item=>(





<div

key={item}

className="

flex

justify-between

border

border-cyan-400/10

rounded-xl

p-3

bg-cyan-400/5

nexus-hover

"

>






<span>

{item}

</span>






<span>


{

unlocked.includes(item)

?

"🟢 ONLINE"

:

"🔒 LOCKED"

}


</span>







</div>






))}









</div>





</div>








</div>


);


}