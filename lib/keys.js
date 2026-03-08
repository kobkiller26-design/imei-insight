let keys={}

export function createKey(user){

const key=Math.random().toString(36).substring(2)

keys[key]={
user:user,
credits:100
}

return key

}

export function getKey(key){
return keys[key]
}

export function useCredit(key){

if(!keys[key]) return false

if(keys[key].credits<=0) return false

keys[key].credits--

return true

}