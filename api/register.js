import {createUser,findUser} from "../lib/db.js"

export default async function handler(req,res){

const {email,password}=req.body

if(findUser(email)){
return res.status(400).json({error:"User exists"})
}

createUser({email,password})

res.json({success:true})

}