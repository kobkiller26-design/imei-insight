import jwt from "jsonwebtoken"

const SECRET="secret123"

export function createToken(user){
return jwt.sign({email:user.email},SECRET,{expiresIn:"7d"})
}

export function verifyToken(token){
try{
return jwt.verify(token,SECRET)
}catch{
return null
}
}