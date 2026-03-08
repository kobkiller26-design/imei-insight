let users=[]

export default function handler(req,res){

if(req.method!=="POST"){
return res.status(405).json({error:"Method not allowed"})
}

const {email,password}=req.body

if(!email||!password){
return res.status(400).json({error:"Missing fields"})
}

const exists=users.find(u=>u.email===email)

if(exists){
return res.status(400).json({error:"User exists"})
}

users.push({email,password})

res.status(200).json({success:true})

}