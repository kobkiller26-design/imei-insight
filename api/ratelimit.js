let requests={}

export function limit(user){

const now=Date.now()

if(!requests[user]){
requests[user]=[]
}

requests[user]=requests[user].filter(t=>now-t<60000)

if(requests[user].length>10){
return false
}

requests[user].push(now)

return true
}