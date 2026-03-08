import {verifyToken} from "../lib/auth.js"
import {getCredits} from "../lib/db.js"

export default function handler(req,res){

const token=req.headers.authorization

const user=verifyToken(token)

if(!user){
return res.status(401)
}

res.json({
credits:getCredits(user.email)
})

}