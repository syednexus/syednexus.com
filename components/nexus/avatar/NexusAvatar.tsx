"use client";

import { useState,useEffect,useRef } from "react";
import { motion } from "framer-motion";
import { useNexus } from "@/context/NexusContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { AVATAR_MODULE_ROUTES } from "@/lib/nexusNavigation";


export default function NexusAvatar(){


const {
avatar,
visitor,
changeSystem,
completeObjective
}=useNexus();


const {data:session}=useSession();

const router=useRouter();

const dragContainerRef = useRef<HTMLDivElement>(null);

const [open,setOpen]=useState(false);
const [command,setCommand]=useState("");

const [ownerMode,setOwnerMode]=useState(false);

const [history,setHistory]=useState<string[]>([]);
const [historyIndex,setHistoryIndex]=useState<number|null>(null);

const [directory,setDirectory]=useState("~");


const bottomRef =
useRef<HTMLDivElement>(null);



const [terminal,setTerminal]=useState<string[]>([

"Booting Syed Nexus OS...",
"Loading security modules...",
"Nexus Kernel ONLINE",
"Type 'help'"

]);





useEffect(()=>{

bottomRef.current?.scrollIntoView({
behavior:"smooth"
});

},[terminal]);






useEffect(()=>{


if(session?.user?.role === "OWNER"){

if(localStorage.getItem("nexus-root")==="true"){

setOwnerMode(true);

setDirectory("/root");

}

return;

}


localStorage.removeItem("nexus-root");

setOwnerMode(false);

setDirectory("~");


},[session]);







function shellPrompt(){


return ownerMode ?

`┌──(root㉿nexus)-[${directory}]
└─# `

:

`┌──(syed㉿nexus)-[${directory}]
└─$ `;

}








async function executeCommand(){


const cmd =
command.toLowerCase().trim();


if(!cmd)return;


setHistory(prev=>[
...prev,
command
]);


let response =
"Command not found";




const files:any={


"about.txt":
`
Syed Nexus Platform

Cybersecurity
Healthcare Security
Research
Development
`,


"projects.txt":
`
Projects:

Syed Nexus OS
SOC Simulator
Cyber Range
MedCore
AI Systems
`,


"skills.txt":
`
Linux
Networking
Python
NextJS
Nmap
Burp Suite
Metasploit
Wireshark
Nessus
`,


"certs.txt":
`
Completed:

TryHackMe Cyber Security 101

Learning:

SOC Analyst
Junior PenTester
Security+
`

};









if(cmd==="help"){


response=
`
FILESYSTEM

ls
ls files
cat <file>
tree
pwd


LINUX

whoami
id
date
history
sudo su
clear


SECURITY

scan
nmap nexus
ifconfig
netstat
ps aux
logs


NEXUS MODULES

nexus
games
soc
attack
lab
forensics
tools
career
ai

NEXUS

profile
projects
medcore
resume

open vault
open ai
open cyber
open soc
open admin

ai <message>


ROOT

ssh vault
exit
`;

}







else if(cmd==="ls"){


response=
`
nexus
games
soc
attack
forensics
tools
career
ai
portfolio
projects
medcore

files:

about.txt
projects.txt
skills.txt
certs.txt
`;

}





else if(cmd==="ls files"){

response=
Object.keys(files).join("\n");

}






else if(cmd.startsWith("cat ")){

const file =
cmd.replace("cat ","");


response =
files[file] ||
`cat: ${file}: No such file`;

}






else if(cmd==="whoami"){

response =
ownerMode ?
"root":
"syed";

}





else if(cmd==="pwd"){

response=directory;

}






else if(cmd==="id"){

response =
ownerMode ?

"uid=0(root)"

:

"uid=1000(syed)";

}







else if(cmd==="tree"){

response=
`
/
├── nexus
├── games
├── soc
├── attack
├── forensics
├── tools
├── career
├── ai-lab
├── medcore
└── vault
`;

}







else if(cmd==="date"){

response=
new Date().toString();

}





else if(cmd==="history"){

response=
history.join("\n");

}
else if(cmd==="scan"){

response=
`
Nexus Security Scanner

[+] Firewall      OK
[+] Authentication OK
[+] Database      OK
[+] API Routes    OK

Threats Found: 0
`;

}








else if(cmd==="nmap nexus"){

response=
`
Starting Nmap 7.95

PORT      STATE     SERVICE

22/tcp    open      ssh
80/tcp    open      http
443/tcp   open      https

Scan completed
`;

}








else if(cmd==="ifconfig"){

response=
`
eth0:

inet 10.0.0.7

status ACTIVE
`;

}








else if(cmd==="netstat"){

response=
`
Active Connections

tcp 22    ssh
tcp 80    http
tcp 443   https
`;

}








else if(cmd==="ps aux"){

response=
`
PID   PROCESS

001   nexus-core
002   auth-service
003   ai-engine
004   vault-daemon
`;

}








else if(cmd==="logs"){

response=
`
[INFO] Nexus boot completed
[INFO] Google OAuth active
[INFO] Vault encrypted
[INFO] Security monitoring online
`;

}









else if(cmd in AVATAR_MODULE_ROUTES){

const path =
AVATAR_MODULE_ROUTES[cmd];

if(cmd === "projects" || cmd === "lab"){
changeSystem("lab");
}

router.push(path);

response =
`Routing to ${path}...`;

}



















else if(cmd==="resume"){

completeObjective("resume");

window.open(
"/resume.pdf",
"_blank"
);


response=
"Opening resume...";

}









else if(cmd==="sudo su"){

if(session?.user?.role==="OWNER"){


setOwnerMode(true);

setDirectory("/root");


localStorage.setItem(
"nexus-root",
"true"
);


response=
`
Privilege escalation successful

root@nexus activated
`;

}


else{


response=
`
Access denied

User not in sudoers file
`;


}


}










else if(cmd==="nexus shadow ascend"){

if(session?.user?.role==="OWNER"){


setOwnerMode(true);

setDirectory("/root");


localStorage.setItem(
"nexus-root",
"true"
);


response=
`
Identity verified

Nexus root shell unlocked
`;

}


else{


response=
"ACCESS DENIED";


}

}









else if(
cmd==="ssh vault" ||
cmd==="open vault"
){


if(ownerMode){


router.push("/vault");


response=
"Connecting to Nexus Vault...";


}

else{


response=
"Permission denied";


}


}









else if(
cmd==="open ai" ||
cmd==="cd ai"
){


if(ownerMode){


router.push("/vault/ai");


response=
"Opening AI Memory Core...";


}

else{

response="Permission denied";

}


}









else if(
cmd==="open cyber" ||
cmd==="cd cyber"
){


if(ownerMode){


router.push("/vault/cyber");


response=
"Opening Cyber Lab...";


}

else{

response="Permission denied";

}


}









else if(
cmd==="open soc" ||
cmd==="cd soc"
){


if(ownerMode){


router.push("/vault/soc");


response=
"SOC Command Center online...";


}

else{

response="Permission denied";

}


}









else if(
cmd==="open admin" ||
cmd==="cd admin"
){


if(ownerMode){


router.push("/vault/admin");


response=
"Opening Admin Control...";


}

else{

response="Permission denied";

}


}







else if(cmd==="ai"){

router.push("/ai-lab");

response=
"Opening AI Security Lab...";

}




else if(cmd.startsWith("ai ")){

const message =
command.trim().slice(3);


if(!message){

response=
"Usage: ai <message>";

}else{

try{


const res =
await fetch("/api/ai",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({message})

});


const data =
await res.json();


response=
data.reply ||
data.error ||
"AI unavailable";


}catch{


response=
"AI connection failed";


}

}


}




else if(cmd==="exit"){

setOwnerMode(false);

setDirectory("~");


localStorage.removeItem(
"nexus-root"
);


response=
"Root session terminated";

}









else if(cmd==="clear"){

setTerminal([]);

setCommand("");

return;

}









setTerminal(prev=>[

...prev,

shellPrompt()+command,

response

]);


setCommand("");

setHistoryIndex(null);


}







return(

<>


{/* TERMINAL LAUNCH BUTTON */}

<motion.button

initial={{opacity:0,scale:.8}}

animate={{opacity:1,scale:1}}

onClick={()=>setOpen(true)}

className="
fixed
left-4
bottom-4
z-50
sm:left-6
sm:bottom-6

w-12
h-12
sm:w-14
sm:h-14

rounded-xl

bg-black

border
border-green-400

text-green-400

font-mono
text-lg
sm:text-xl

shadow-lg
shadow-green-500/40

hover:scale-110

transition
"

>

&gt;_

</motion.button>









{open &&

<>

{/* Viewport constraint layer — keeps panel inside screen on desktop */}
<div
ref={dragContainerRef}
className="pointer-events-none fixed inset-0"
style={{zIndex:49}}
/>

{/* Mobile backdrop overlay */}
<div
className="fixed inset-0 bg-black/60 sm:hidden"
style={{zIndex:59}}
onClick={()=>setOpen(false)}
/>

<motion.div

drag
dragConstraints={dragContainerRef}
dragMomentum={false}
dragElastic={0}

initial={{

opacity:0,

scale:.9

}}

animate={{

opacity:1,

scale:1

}}


className="

fixed

inset-0
sm:inset-auto

sm:left-8

sm:bottom-24

z-[60]


w-full
sm:w-[520px]

h-full
sm:h-[450px]


bg-black/95


border-0
sm:border

border-green-500


sm:rounded-xl


font-mono


overflow-hidden


shadow-2xl

shadow-green-500/20

flex
flex-col

"

>







{/* HEADER BAR */}

<div

className="

h-11

flex

items-center

justify-between


px-4


bg-green-950/30


border-b

border-green-800

cursor-move

"

>


<div>


<p className="text-green-400 text-sm">


{

ownerMode

?

"root㉿nexus"

:

"syed㉿nexus"

}


</p>


<p className="text-xs text-gray-500">


{

ownerMode

?

"ROOT SHELL"

:

"NEXUS TERMINAL"

}


</p>


</div>





<button

onClick={()=>setOpen(false)}

className="

text-red-500

hover:text-red-300

font-bold

text-xl

"

>

×

</button>


</div>









{/* TERMINAL OUTPUT */}

<div

className="

flex-1

p-4


overflow-y-auto


text-green-400

text-sm


space-y-2

"

>


{

terminal.map((line,index)=>(


<p

key={index}

className="whitespace-pre-line"

>

{line}

</p>


))

}



<div ref={bottomRef}/>


</div>










{/* COMMAND INPUT */}

<div

className="

shrink-0


border-t

border-green-900


p-3


flex

gap-2


items-center

"

>


<span

className="text-green-500"

>

{

ownerMode

?

"#"

:

"$"

}

</span>






<input


value={command}


onChange={(e)=>

setCommand(e.target.value)

}



onKeyDown={(e)=>{


if(e.key==="Enter"){

executeCommand();

}




if(e.key==="ArrowUp"){


const index =

historyIndex===null

?

history.length-1

:

Math.max(historyIndex-1,0);



setHistoryIndex(index);


setCommand(history[index] || "");


}







if(e.key==="ArrowDown"){


if(historyIndex!==null){


const index = historyIndex+1;


if(index>=history.length){


setCommand("");

setHistoryIndex(null);


}


else{


setCommand(history[index]);

setHistoryIndex(index);


}


}


}









if(e.key==="Tab"){


e.preventDefault();


[

"help",

"scan",

"skills",

"certs",

"neofetch",

"nmap nexus",

"nexus shadow ascend",

"ssh vault",

"status"

]

.find(item=>{


if(item.startsWith(command)){


setCommand(item);


return true;


}


});


}



}}



className="

flex-1


bg-transparent


outline-none


text-green-400

"

autoFocus


/>


</div>



</motion.div>

</>

}


</>

);

}