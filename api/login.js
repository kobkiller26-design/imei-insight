import {findUser} from "../lib/db.js"
import {createToken} from "../lib/auth.js"

export default async function handler(req,res){

const {email,password}=req.body

const user=findUser(email)

if(!user){
return res.status(401).json({error:"Invalid login"})
}

if(user.password!==password){
return res.status(401).json({error:"Invalid login"})
}

const token=createToken(user)

res.json({token})

}