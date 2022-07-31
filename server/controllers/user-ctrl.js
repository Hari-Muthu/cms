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
}

placeOrder = (req,res) => {
    const {email,orderedItems} = req.body
    const currentOrderItems=[];
    let flag=1;
    MenuModel.find({},(err,menuItems)=>{
        if(err){
            return res.status(400).json({success:false,error:err});
        }
        else if(!menuItems){
            return res.status(400).json({success:false,message:"No items found"})
        }
        else{
            orderedItems.forEach((orderItem)=>{
                menuItems.forEach((menuItem)=>{
                    if(menuItem.name === orderItem.itemName)
                    {
                        if(menuItem.stock>=orderItem.quantity)
                        currentOrderItems.push({
                            itemName:orderItem.itemName,
                            quantity:orderItem.quantity,
                            price:orderItem.quantity*menuItem.price
                        })
                        else {
                            flag=0;
                        }
                    }
                })
            })
            if(flag===0)
            {
                return res.status(400).json({success:false,message:"Insufficient stock of some items"})
            }
            
            else
            {
                const newOrder = new OrderModel({
                    email:email,
                    orderedItems:currentOrderItems
                })
                newOrder.save((err,order)=>{
                    if(err)
                        res.status(400).json({success:false,error:err})
                    else
                        res.status(200).json({success:true,data:order})
                })
            }
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
})
}

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
)
}

module.exports = {
    getMenu,
    placeOrder,
    login,
    register
};