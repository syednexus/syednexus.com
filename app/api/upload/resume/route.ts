import { NextResponse } from "next/server";

import { writeFile,mkdir } from "fs/promises";

import path from "path";

import { requireAdmin } from "@/lib/adminGuard";






export async function POST(req:Request){


try{



if(!(await requireAdmin())){


return NextResponse.json(

{
error:"Unauthorized"
},

{
status:401
}

);


}







const data =

await req.formData();




const file =

data.get("resume") as File | null;






if(!file){


return NextResponse.json(

{
error:"No file uploaded"
},

{
status:400
}

);


}








if(file.type !== "application/pdf"){



return NextResponse.json(

{
error:"Only PDF allowed"
},

{
status:400
}

);



}









if(file.size > 2 * 1024 * 1024){



return NextResponse.json(

{
error:"Maximum file size is 2MB"
},

{
status:400
}

);



}









const bytes =

await file.arrayBuffer();




const buffer =

Buffer.from(bytes);







// PDF signature validation

const signature =

buffer

.subarray(0,4)

.toString();




if(signature !== "%PDF"){



return NextResponse.json(

{
error:"Invalid PDF file"
},

{
status:400
}

);



}









const uploadDir =

path.join(

process.cwd(),

"public",

"uploads"

);





await mkdir(

uploadDir,

{
recursive:true
}

);








const filePath =

path.join(

uploadDir,

"resume.pdf"

);






await writeFile(

filePath,

buffer

);









return NextResponse.json({

success:true,

path:"/uploads/resume.pdf"

});








}



catch(error){



console.error(

"RESUME UPLOAD ERROR",

error

);




return NextResponse.json(

{
error:"Resume upload failed"
},

{
status:500
}

);



}



}