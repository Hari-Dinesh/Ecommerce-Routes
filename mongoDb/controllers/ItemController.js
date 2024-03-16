const Item=require('../Models/ItemModel')
module.exports.AddItem=(req,res)=>{
    const {Itemname,Price,productDescription}=req.body;
    try {
        const data=new Item({
            Itemname,
            Price,
            productDescription
        })
        data.save().then(()=>{
            res.status(201).send('Item Added successfully');
        }).catch((err)=>{
            res.status(500).send('Error saving Item');
        })
    } catch (error) {
        res.send("Found the Error")
    }
}
module.exports.getItem=async(req,res)=>{
    try {
        const data=await Item.find()
        res.send(data)
    } catch (error) {
        res.send("Found the Error")
    }
}
