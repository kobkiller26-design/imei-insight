let users=[]

export default function handler(req,res){

if(req.method!=="POST"){
return res.status(405).json({error:"Method not allowed"})
}

const {email,password}=req.body

const user=users.find(u=>u.email===email&&u.password===password)

if(!user){
return res.status(401).json({error:"Invalid login"})
}

res.status(200).json({success:true})

}