"use client";


import { useState } from "react";




export default function PhishingAnalyzer(){


const [analysis,setAnalysis]=useState("");





function scan(){


setAnalysis(`
ANALYSIS COMPLETE

Sender:
security-update@paypa1-login.com

Finding:
❌ Domain impersonation detected

URL:
http://paypa1-login.com/reset

Finding:
❌ Suspicious external link

Attachment:
invoice.exe

Finding:
❌ Executable attachment


MITRE:
T1566 Phishing

Risk:
HIGH
`);

}




return(

<div className="
border
border-yellow-700
rounded-xl
p-6
font-mono
bg-black
text-green-400
">


<h2 className="text-3xl">

PHISHING ANALYZER

</h2>



<div className="
mt-8
border
border-gray-700
rounded-xl
p-5
">


<p>
FROM:
security-update@paypa1-login.com
</p>


<p className="mt-3">

SUBJECT:
Urgent Password Reset Required

</p>


<p className="mt-3 text-gray-400">

Your account has been locked.
Open the attachment and verify your details.

</p>



<p className="mt-3">

Attachment:

invoice.exe

</p>


</div>







<button

onClick={scan}

className="
mt-8
border
border-green-500
px-6
py-3
"

>

ANALYZE EMAIL

</button>





<pre className="
mt-8
whitespace-pre-wrap
">

{analysis}

</pre>




</div>

);


}