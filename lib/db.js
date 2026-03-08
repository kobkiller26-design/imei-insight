let users=[]
let history=[]
let payments=[]

export function createUser(user){

users.push({
email:user.email,
password:user.password,
credits:0,
disabled:false
})

}

export function findUser(email){
return users.find(u=>u.email===email)
}

export function disableUser(email){

const user=users.find(u=>u.email===email)

if(user){
user.disabled=true
}

}

export function addCredits(email,amount){

const user=users.find(u=>u.email===email)

if(user){
user.credits+=amount
}

}

export function getCredits(email){

const user=users.find(u=>u.email===email)

return user?user.credits:0

}

export function useCredit(email){

const user=users.find(u=>u.email===email)

if(!user) return false

if(user.disabled) return false

if(user.credits<=0) return false

user.credits--

return true

}

export function addHistory(item){
history.push(item)
}

export function getHistory(email){
return history.filter(h=>h.user===email)
}

export function getAllHistory(){
return history
}

export function addPayment(p){
payments.push(p)
}

export function getPayments(){
return payments
}

export function getUsers(){
return users
}