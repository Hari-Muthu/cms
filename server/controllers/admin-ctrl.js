const adminModel = require("../models/admin-model")
const orderModel = require("../models/order-model")
const menuModel = require("../models/menu-model")

login = (req,res) => {
    const {email,password} = req.body;
    adminModel.findOne({email},(err,user) => {
        if(err){
            return res.status(400).json({success:false, error:err})
        }
        else if(!user){
            return res.status(404).json({success: false,error: "Admin not found"})
        }
        else if(user.password !== password){
            return res.status(404).json({success: false,error: "Password incorrect"})
        }
        return res.status(200).json({success: true,data: user})
}).catch(err => console.log(err))
}

getOrders = (req,res) => {
    orderModel.find({isActive:true},(err,activeOrder)=>{
        if(err){
            res.status(400).json({
                success:false,
                error:err
            })
        }
        else if(activeOrder.length==0){
            res.status(404).json({
                success:false,
                message:"No active orders"
            })
        }
        else{
            console.log(activeOrder);
            res.status(200).json({
                success:true,
                activeOrders:activeOrder
            })
        }
    })
}
 
updateMenu = (req,res) => {
    const body = req.body;
    const id=req.params.id;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Nothing found',
        })
    }
    const newStock=body.stock;
    menuModel.findByIdAndUpdate(id,{"stock": newStock},{new: true},(err,menu) => {
        if(err){
            return res.status(400).json({success:false, error:err})
        }
        res.status(200).json({
            success: true,
            message: 'Stock updated',
            data: menu
        })
    }).catch(err => console.log(err));
    // .catch(err => {
    //     return res.status(404).json({
    //         success: false,
    //         id: id,
    //         error: err,
    //         message: 'Stock not updated'
    //     })
    // }
    // );

    // menuModel.findOne({ _id: req.params.id }, (err, menuItem) => {
    //     if (err) {
    //         return res.status(404).json({
    //             err,
    //             message: 'Item not found!',
    //         })
    //     }
    //     // menuItem.name = body.name
    //     // menuItem.price = body.price
    //     menuItem.stock = body.stock
    //     menuItem
    //         .save()
    //         .then(() => {
    //             return res.status(200).json({
    //                 success: true,
    //                 id: movie._id,
    //                 message: 'Movie updated!',
    //             })
    //         })
    //         .catch(error => {
    //             return res.status(404).json({
    //                 error,
    //                 message: 'Movie not updated!',
    //             })
    //         })
    // })



}



module.exports = {
    login,
    getOrders,
    updateMenu
};