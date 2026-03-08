import Stripe from "stripe"

const stripe=new Stripe(process.env.STRIPE_SECRET)

export default async function handler(req,res){

const session=await stripe.checkout.sessions.create({

payment_method_types:["card"],

line_items:[{
price_data:{
currency:"usd",
product_data:{name:"IMEI Check"},
unit_amount:200
},
quantity:1
}],

mode:"payment",

success_url:"/index.html?paid=true",
cancel_url:"/index.html"

})

res.json({url:session.url})

}