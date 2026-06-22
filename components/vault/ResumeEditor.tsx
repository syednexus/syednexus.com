"use client";

import { useState } from "react";



export default function ResumeEditor(){


const [file,setFile]=useState<File|null>(null);

const [status,setStatus]=useState("");





async function upload(){


if(!file){

setStatus("Select PDF first");

return;

}



setStatus("Uploading...");



const formData =
new FormData();



formData.append(
"resume",
file
);




try{


const res =
await fetch(
"/api/upload/resume",
{
method:"POST",
body:formData
}
);



const data =
await res.json();



if(res.ok){

setStatus(
"Resume updated successfully"
);

}

else{

setStatus(
data.error ||
"Upload failed"
);

}


}

catch{


setStatus(
"Upload error"
);


}



}








return(

<div

className="
mt-10

border
border-green-800

rounded-xl

p-6

space-y-8
"

>



<div>


<p className="text-gray-500">

Current Resume

</p>



<a

href="/uploads/resume.pdf"

target="_blank"

className="
underline
text-green-400
"

>

Open Resume

</a>


</div>








<input

type="file"

accept="application/pdf"


onChange={(e)=>

setFile(

e.target.files?.[0] || null

)

}


className="
block
"

/>







<button

onClick={upload}


className="
border
border-green-600

px-6
py-3

hover:bg-green-950
"

>

UPLOAD RESUME

</button>





<p>

{status}

</p>




</div>

);


}