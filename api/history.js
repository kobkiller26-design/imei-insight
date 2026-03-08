import {verifyToken} from "../lib/auth.js"
import {getHistory} from "../lib/db.js"

export default function handler(req,res){

const token=req.headers.authorization

const user=verifyToken(token)

if(!user){
return res.status(401).json({error:"Login required"})
}

const data=getHistory(user.email)

res.json(data)

}