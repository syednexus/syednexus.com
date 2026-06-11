import crypto from "crypto";



const secret =
process.env.NEXUS_SECRET;



if(!secret){

throw new Error(
"NEXUS_SECRET missing from environment"
);

}



const key = crypto
.createHash("sha256")
.update(secret)
.digest();






export function encrypt(text:string){


const iv =
crypto.randomBytes(16);



const cipher =
crypto.createCipheriv(

"aes-256-cbc",

key,

iv

);





let encrypted =
cipher.update(

text,

"utf8",

"hex"

);



encrypted +=
cipher.final("hex");





return (

iv.toString("hex")

+

":"

+

encrypted

);


}










export function decrypt(payload:string){



const [
ivHex,
data
] = payload.split(":");




const decipher =
crypto.createDecipheriv(

"aes-256-cbc",

key,

Buffer.from(ivHex,"hex")

);





let decrypted =
decipher.update(

data,

"hex",

"utf8"

);



decrypted +=
decipher.final("utf8");




return decrypted;


}