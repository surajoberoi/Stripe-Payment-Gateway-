require('dotenv').config()

const cors = require("cors")
const express = require("express")
//use secret key in Stripe on requiring it
const stripe = require("stripe")(process.env.SecretKey)
//const { v4:uuidv4 } = require("uuid")
var uuid = require('uuid');
const app = express();



//middleware
app.use(express.json())
app.use(cors())


//routes
app.get("/",(req,res) =>{
    res.send("WOrkings")
})

app.post("/payment",(req,res)=>{

    const {product,token} = req.body;
    console.log("Product",product)
    console.log("Price",product.price)
    //this is unique key is created only once when this route is hit,
    //this makes sure that the user is not charged twice for the same product 
    const idempotencyKey = uuid.v4()

    //create a customer
        return stripe.customers.create({
            email: token.email,     // retrieving customer email and source(id)
            source: token.id
        }).then(customer =>{        // if customer is created succesfully
            stripe.charges.create({
                amount:product.price * 100,
                currency:"usd",
                customer:customer.id,
                receipt_email: token.email,
                description: `Purchase of product.name`,
                shipping: {
                    name:token.card.name,
                    address:{
                        country:token.card.address_country
                    }
                }
            },{idempotencyKey})
        })
.then(result=>res.status(200).json(result))
.catch(err=>console.log(err))
})

//listen
app.listen(8282, ()=> console.log("Listening to port 8282"))