"use client";


import { useState } from "react";



export default function NexusTerminal(){


const [history,setHistory]=useState<string[]>([

"Nexus Terminal Online",
"Type help"

]);


const [command,setCommand]=useState("");





function runCommand(){


const cmd =
command.trim().toLowerCase();


let output =
"command not found";




const commands:Record<string,string>={


help:
`
Commands:

ls
pwd
whoami
cat auth.log
cat processes.txt
nmap target
clear
`,


whoami:
"nexus-security-analyst",


pwd:
"/home/nexus/investigation",



ls:
`
auth.log
processes.txt
network.scan
`,


"cat auth.log":
`
Jun 20 sshd:
Failed password root from 45.33.21.10

Jun 20 sshd:
Failed password admin from 45.33.21.10

Possible brute force activity.
`,


"cat processes.txt":
`
PID     NAME

443     chrome.exe
991     powershell.exe -EncodedCommand
1220    explorer.exe

Suspicious process detected.
`,



"nmap target":
`
PORT

22/tcp open ssh
80/tcp open http
`

};





if(commands[cmd]){

output=commands[cmd];

}





if(cmd==="clear"){


setHistory([]);

setCommand("");

return;

}






setHistory([

...history,

"root@nexus:~# "+command,

output

]);



setCommand("");


}








return(

<div className="
border
border-green-800
bg-black
rounded-xl
p-5
font-mono
text-green-400
">


<div className="
min-h-87.5
whitespace-pre-wrap
">


{

history.map((x,i)=>(

<p key={i}>{x}</p>

))

}


</div>




<div className="flex gap-3">


<span>

root@nexus:~#

</span>



<input

value={command}

onChange={e=>setCommand(e.target.value)}

onKeyDown={e=>{

if(e.key==="Enter"){

runCommand();

}

}}

className="
bg-black
outline-none
flex-1
"

/>


</div>


</div>

);


}