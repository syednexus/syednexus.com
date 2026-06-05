import { NextResponse } from "next/server";

import { executeCommand } from "@/lib/commandEngine";


export async function POST(req:Request){


const body = await req.json();


const result =
executeCommand(body.command);



return NextResponse.json(result);


}