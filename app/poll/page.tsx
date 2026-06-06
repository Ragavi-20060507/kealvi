"use client";

import { useState } from "react";

export default function PollPage() {

const [topic,setTopic]=useState("");

const [loading,setLoading]=useState(false);

const [poll,setPoll]=useState<any>(null);

const [selected,setSelected]=useState("");

async function generatePoll(){

setLoading(true);

setSelected("");

const res = await fetch(
"/api/generate-poll",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
topic
})
}
);

const data = await res.json();

setPoll(data);

setLoading(false);

}

return (

<div className="p-10 max-w-4xl mx-auto">

<h1 className="text-4xl font-bold">

AI Poll Generator

</h1>

<input

className="border p-4 mt-6 w-full rounded"

placeholder="Enter topic"

value={topic}

onChange={(e)=>
setTopic(
e.target.value
)
}

/>

<button

className="bg-black text-white px-6 py-3 mt-5 rounded"

onClick={generatePoll}

>

{loading
?
"Generating..."
:
"Generate Poll"}

</button>

{poll && (

<div className="mt-10">

<h2 className="text-3xl font-semibold mb-6">

{poll.question}

</h2>

<div>

{poll.options.map(
(opt:string,index:number)=>(
<button

key={index}

className={`

border

p-4

mt-3

w-full

text-left

rounded

transition

${
selected===opt
?

"bg-green-200"

:

"hover:bg-gray-100"

}

`}

onClick={()=>
setSelected(opt)
}

>

{opt}

</button>
)
)}

</div>

{selected && (

<div className="mt-6 text-xl font-bold">

You voted for:

{" "}

{selected}

</div>

)}

</div>

)}

</div>

);

}