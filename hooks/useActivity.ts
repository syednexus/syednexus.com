"use client";


import { useEffect,useState } from "react";





export type Activity={

id:string;

type:string;

message:string;

time:string;

};








export function useActivity(){



const [activity,setActivity]=
useState<Activity[]>([]);








useEffect(()=>{


const saved =
JSON.parse(

localStorage.getItem("nexus_activity") ||

"[]"

);


setActivity(saved);


},[]);









function addActivity(

type:string,

message:string

){



const item:Activity={

id:crypto.randomUUID(),

type,

message,

time:new Date().toLocaleString()

};







const updated=[

item,

...activity

];






setActivity(updated);





localStorage.setItem(

"nexus_activity",

JSON.stringify(updated)

);




}









function clearActivity(){


setActivity([]);


localStorage.removeItem(
"nexus_activity"
);


}









return {

activity,

addActivity,

clearActivity

};



}