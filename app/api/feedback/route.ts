import { NextResponse } from "next/server";





export async function POST(req:Request){


try{


const body =
await req.json();




const message =
String(body.message || "")
.trim();




const email =
String(body.email || "")
.trim();





if(

message.length < 5 ||

message.length > 1000

){


return NextResponse.json(

{
error:"Invalid feedback"
},

{
status:400
}

);


}





/*

Future:

Send email:

feedback@syednexus.com


No database storage.

*/





console.log(

"Feedback received"

);






return NextResponse.json({

success:true

});






}

catch{


return NextResponse.json(

{
error:"Failed"
},

{
status:500
}

);


}



}