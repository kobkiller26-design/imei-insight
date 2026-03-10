let users=[]
let history=[]
let payments=[]
let imeiChecks=[]

export function createUser(user){

users.push({
email:user.email,
password:user.password,
credits:0,
disabled:false,
is_admin:user.is_admin||false
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
export function addIMEICheck(check){
imeiChecks.push({
id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),
user_id:check.user_id||null,
imei:check.imei,
result_json:check.result||null,
created_at:check.created_at||new Date().toISOString()
})
}

export function getIMEIChecks(userId){
if(!userId) return imeiChecks
return imeiChecks.filter(c=>c.user_id===userId)
}

export function getAllIMEIChecks(){
return imeiChecks
}
