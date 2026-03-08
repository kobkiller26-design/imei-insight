import {getAllHistory} from "../lib/db.js"

export default function handler(req,res){

const key=req.headers["x-admin"]

if(key!=="ADMIN_SECRET"){
return res.status(403).json({error:"Forbidden"})
}

res.json(getAllHistory())

}