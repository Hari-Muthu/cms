const UserModel = require('../models/user-model');
const MenuModel = require("../models/menu-model");
const OrderModel = require("../models/order-model");



getMenu = (req,res) => {
    MenuModel.find({},(err,menuItems) => {
        if(err){
            return res.status(400).json({success:false, error:err})
        }
        else if(!menuItems){
            return res.status(404).json({
                success: false,
                error: "No items found"
            })
        }
        else{
            return res.status(200).json({
                success: true,
                data: menuItems.filter((item)=> item.stock!=0)
            })
        }
    })
    // .catch(err => console.log(err))
}

placeOrder = (req,res) => {
    
    const {email,orderedItems} = req.body;
    
    
    // const name = orderedItems.map((item)=>return {name:item.itemName,quantity:item.quantity});
    // console.log(name);
    // const quantity = orderedItems.map((item)=> item.quantity);
    // console.log(quantity);
    
    // console.log(email)

    var currentOrderItem  = []

    
     orderedItems.forEach((item)=>{

        
        MenuModel.findOne({name:item.itemName},(err,menuItems)=>{
            if(err){
                return res.status(400).json({success:false, error:err})
            }
            else if(!menuItems){
                return res.status(404).json({success: false,error: "Item not found"})
            }
            else{
                // console.log(menuItems);
                const newStock = menuItems.stock - item.quantity;
                if (newStock > 0 ){
                // menuItems.save();
                }

                // console.log("In else statement")
                const price = menuItems.price*item.quantity;

                const obj={
                    name: menuItems.name,
                    quantity: item.quantity,
                    price: price
                }
                currentOrderItem.push(obj);
                // console.log(currentOrderItem);

            }
        })
    })

    const newOrder = new OrderModel({
        email,
        currentOrderItem
    })

    newOrder.save((err,order)=>{
        if(err){
            return res.status(400).json({success:false, error:err})
        }
        else{
            return res.status(200).json({success: true,data: order})
        }
    })
}

login = (req,res) => {
    const {email,password} = req.body;
    UserModel.findOne({email},(err,user) => {
        if(err){
            return res.status(400).json({success:false, error:err})
        }
        else if(!user){
            return res.status(404).json({success: false,error: "User not found"})
        }
        else if(user.password !== password){
            return res.status(404).json({success: false,error: "Password incorrect"})
        }
        return res.status(200).json({success: true,data: user})
})}
// .catch(err => console.log(err))}

register = (req,res) => {
    const {name,email,phoneno,password} = req.body;
    UserModel.findOne({email},(err,user) => {
        if(err){
            return res.status(400).json({success:false, error:err})
        }
        else if(user){
            return res.status(404).json({success: false,error: "User already exists"})
        }
        else{
            const user = new UserModel({name,email,phoneno,password})
            user.save((err,user) => {
                if(err){
                    return res.status(400).json({success:false, error:err})
                }
                else{
                    return res.status(200).json({success: true,data: user})
                }
            })
        }
    }
)}

module.exports = {
    getMenu,
    placeOrder,
    login,
    register
};