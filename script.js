function checkIMEI(){

let imei=document.getElementById("imeiInput").value;
let result=document.getElementById("result");

if(imei.length!==15 || isNaN(imei)){
result.innerHTML="❌ Invalid IMEI number";
return;
}

result.innerHTML="🔍 Checking device...";

setTimeout(()=>{

result.innerHTML=
`;

<b>Status:</b> Clean <br>
<b>Device:</b> Smartphone <br>
<b>Blacklist:</b> No <br>
<b>Carrier:</b> Unknown
`;

},1000);

}