let users=[]
let history=[]

export function createUser(user){

users.push({
email:user.email,
password:user.password,
credits:0
})

}

export function findUser(email){
return users.find(u=>u.email===email)
}

export function addCredits(email,amount){

const user=users.find(u=>u.email===email)

if(user){
user.credits+=amount
}

}

export function useCredit(email){

const user=users.find(u=>u.email===email)

if(!user) return false

if(user.credits<=0) return false

user.credits--

return true

}

export function addHistory(item){
history.push(item)
}

export function getHistory(user){
return history.filter(h=>h.user===user)
}

export function getCredits(email){

const user=users.find(u=>u.email===email)

return user ? user.credits : 0

}