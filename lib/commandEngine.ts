import { vault } from "@/data/vault";


export function executeCommand(cmd:string){


const command = cmd.trim().toLowerCase();



const commands = {


help:`

NEXUS COMMAND LIST

Navigation:
 ls
 dir
 tree
 pwd

Recon:
 scan
 nmap nexus.local

Files:
 cat profile.enc
 cat skills.enc
 cat projects.enc
 cat certs.enc

Decrypt:
 decrypt profile.enc
 decrypt skills.enc
 decrypt projects.enc
 decrypt certs.enc

Privilege:
 sudo su

System:
 whoami
 clear

`,



ls:`

drwx identity/
drwx skills/
drwx projects/
drwx certifications/

-r-- profile.enc
-r-- skills.enc
-r-- projects.enc
-r-- certs.enc

`,



dir:`

profile.enc
skills.enc
projects.enc
certs.enc

`,




tree:`

/nexus

├── identity
│   └── profile.enc
│
├── skills
│   └── skills.enc
│
├── projects
│   └── projects.enc
│
└── certifications
    └── certs.enc

`,




pwd:`

/home/guest/nexus

`,



whoami:`

USER:
guest

ROLE:
Security Investigation Session

ACCESS:
Restricted

OBJECTIVE:
Restore Nexus archives

`

};






if(command in commands){


return{

output:
commands[command as keyof typeof commands],

unlock:null

};


}








if(command==="scan" || command==="nmap nexus.local"){


return{

output:`

Scanning nexus.local...


PORT      SERVICE

22/tcp    secure-shell

80/tcp    public-interface

443/tcp   encrypted-vault


Encrypted archives located.

Run:

ls

`,

unlock:null

};


}








if(command.startsWith("cat")){


return{

output:`

Encrypted archive detected


Encryption:
AES-256


Status:
LOCKED


Required:

decrypt filename.enc

`,

unlock:null

};


}









if(command==="decrypt profile.enc"){


return{

output:vault.profile,

unlock:"IDENTITY"

};


}




if(command==="decrypt skills.enc"){


return{

output:vault.skills,

unlock:"SKILLS"

};


}





if(command==="decrypt projects.enc"){


return{

output:vault.projects,

unlock:"PROJECTS"

};


}






if(command==="decrypt certs.enc"){


return{

output:vault.certifications,

unlock:"CERTS"

};


}










// ROOT ACCESS


if(command==="sudo su" || command==="sudo -i"){


return{

output:`

Checking privileges...


Vault integrity verified.

Identity confirmed.


Privilege escalation successful.


WELCOME ROOT


New commands unlocked:

open profile
open projects
open skills


`,

unlock:"ROOT"

};


}









if(command==="open profile"){


return{

output:`

====================
SYED NEXUS PROFILE
====================


Name:
Syed Mohiuddin


Background:

Bachelor of Pharmacy

Master of Cyber Security


Focus:

Security Operations
Network Security
Infrastructure


Status:

Profile restored ✓

`,

unlock:null


};


}








if(command==="open projects"){


return{

output:`

PROJECT DATABASE


01 Nexus Portfolio

Stack:
Next.js
TypeScript
API Routes


02 Cyber Labs

Linux
Networking
Security tools


03 Infrastructure

Self hosting
Monitoring


`,

unlock:null

};


}








if(command==="open skills"){


return{

output:`

SECURITY MATRIX


Blue Team:

SOC fundamentals
Monitoring concepts


Technical:

Linux
Networking
Python basics


Learning:

Penetration testing
Cloud security


`,

unlock:null


};


}










return{

output:`

Command not found:

${command}


Run:

help

`,

unlock:null

};


}