import {getUsers,getPayments,getAllHistory,addCredits,disableUser} from "../lib/db.js"

export default function handler(req,res){

const adminKey=req.headers["x-admin"]

if(adminKey!=="ADMIN_SECRET"){
return res.status(403).json({error:"Unauthorized"})
}

const action=req.query.action

if(action==="users"){
return res.json(getUsers())
}

if(action==="payments"){
return res.json(getPayments())
}

if(action==="checks"){
return res.json(getAllHistory())
}

if(action==="addcredits"){

const email=req.query.email
const amount=parseInt(req.query.amount)

addCredits(email,amount)

return res.json({success:true})

}

if(action==="disable"){

const email=req.query.email

disableUser(email)

return res.json({success:true})

}

res.json({status:"admin ready"})

}