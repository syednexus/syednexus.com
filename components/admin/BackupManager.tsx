"use client";


import { useState } from "react";





export default function BackupManager(){





const [status,setStatus] =
useState("");








function exportBackup(){





const backup={

identity:
localStorage.getItem("nexus_identity"),

education:
localStorage.getItem("nexus_education"),

experience:
localStorage.getItem("nexus_experience"),

skills:
localStorage.getItem("nexus_skills"),

certifications:
localStorage.getItem("nexus_certifications"),

projects:
localStorage.getItem("nexus_projects"),

blogs:
localStorage.getItem("nexus_blogs"),

createdAt:
new Date().toISOString()

};








const file = new Blob(

[

JSON.stringify(

backup,

null,

2

)

],

{

type:"application/json"

}

);








const url =
URL.createObjectURL(file);








const link =
document.createElement("a");



link.href=url;


link.download=

`nexus-backup-${Date.now()}.json`;



link.click();








URL.revokeObjectURL(url);







setStatus(

"Backup exported successfully ✓"

);







}









function importBackup(

event:React.ChangeEvent<HTMLInputElement>

){








const file =
event.target.files?.[0];







if(!file){

return;

}

const isJsonBackup =

file.name.toLowerCase().endsWith(".json")

&&

(file.type==="application/json" || file.type==="");


if(!isJsonBackup){

setStatus(

"Only JSON backup files can be imported"

);

event.target.value="";

return;

}









const reader =
new FileReader();









reader.onload=()=>{








try{









const data =
JSON.parse(

reader.result as string

);









Object.entries(data).forEach(

([key,value])=>{








if(

key!=="createdAt"

&&

value

){







localStorage.setItem(

`nexus_${key}`,

value as string

);








}



}

);









setStatus(

"Backup restored. Refresh Nexus OS ✓"

);










}

catch{









setStatus(

"Invalid backup file"

);








}










};










reader.readAsText(file);








}









function resetSystem(){







if(

confirm(

"Reset Nexus local database?"

)

){








localStorage.clear();








setStatus(

"System reset complete. Refresh page."

);








}








}









return(

<div className="

border

border-yellow-400/30

rounded-xl

p-6

bg-yellow-400/5

font-mono

"

>










<p className="

text-yellow-300

tracking-widest

text-sm

">

💾 NEXUS BACKUP SYSTEM

</p>










<p className="

text-gray-400

text-sm

mt-3

">

Export or restore your complete Nexus configuration.

</p>












<div className="

grid

md:grid-cols-3

gap-5

mt-8

"

>











<button


onClick={exportBackup}


className="

border

border-green-400/30

rounded-xl

p-5

hover:bg-green-400/10

"

>

⬇ EXPORT BACKUP

</button>









<label

className="

border

border-blue-400/30

rounded-xl

p-5

text-center

cursor-pointer

hover:bg-blue-400/10

"

>

⬆ IMPORT BACKUP



<input


type="file"


accept=".json"


hidden


onChange={importBackup}


/>


</label>









<button


onClick={resetSystem}


className="

border

border-red-400/30

rounded-xl

p-5

hover:bg-red-400/10

"

>

⚠ RESET SYSTEM

</button>









</div>









{status && (


<p className="

mt-6

text-green-300

"

>

{status}

</p>


)}










</div>

);



}
