import Stripe from "stripe"

const stripe=new Stripe(process.env.STRIPE_SECRET)

export default async function handler(req,res){

const {email}=req.body

const session=await stripe.checkout.sessions.create({

payment_method_types:["card"],

line_items:[{
price_data:{
currency:"usd",
product_data:{name:"IMEI Credits (10 checks)"},
unit_amount:1000
},
quantity:1
}],

mode:"payment",

success_url:`/dashboard.html?deposit=true&email=${email}`,
cancel_url:"/dashboard.html"

})

res.json({url:session.url})

}