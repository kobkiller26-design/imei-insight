let users=[]
let history=[]

export function createUser(user){
users.push(user)
}

export function findUser(email){
return users.find(u=>u.email===email)
}

export function addHistory(item){
history.push(item)
}

export function getHistory(user){
return history.filter(h=>h.user===user)
}

export function getAllHistory(){
return history
}