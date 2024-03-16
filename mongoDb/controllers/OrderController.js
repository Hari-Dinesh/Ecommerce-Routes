const Order=require('../Models/orderModel')
module.exports.Order=async(req,res)=>{
            const tod = new Date();
            const dd = String(tod.getDate()).padStart(2, '0');
            const mm = String(tod.getMonth() + 1).padStart(2, '0');
            const yyyy = tod.getFullYear();
            const finalDate = `${dd}/${mm}/${yyyy}`;
    try {
        let {data}=req.body.orderdata
          const phonecheck=await Order.findOne({Phone:req.body.Phone})
          if(phonecheck==null){
            try {
                await Order.create({
                    Phone:req.body.Phone,
                    status:req.body.status,
                    Adress:req.body.Adress,
                    Total_price:req.body.Total_Price,
                    Order_date:finalDate,
                    orderdata:[data]
                }).then(()=>{
                    res.send({success:true})
                })
            } catch (error) {
                res.send(error)
            }
          }else{
            try {
                await Order.findOneAndUpdate({Phone:req.body.Phone},
                    {
                      $push:{orderdata:data,
                        status:req.body.status,
                        Adress:req.body.Adress,
                        Total_price:req.body.Total_Price,
                        Order_date:req.body.Order_date,}}).then(()=>{
                        res.json({success:true})
                      })
            } catch (error) {
                res.send(error)
            }
          }
    } catch (error) {
        res.send("message error")
    }
}
function isInCurrentMonth(date) {
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}
function isInCurrentWeek(date) {
    const today = new Date();
    const currentWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const currentWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));

    return date >= currentWeekStart && date <= currentWeekEnd;
}
module.exports.dashboardData=async(req,res)=>{
    //console.log("hi")
    const ThisMonthRevenue=0;
    const MonthNumberOfOrders=0;
    const NumberOfItemsOrderMonth=0;
    const THisWeekRevenue=0;
    const WeekNumberOfOrder=0;
    const NumberOfItemsOrderWeek=0;
    try {
        let data=await Order.find()
        for(let i=0;i<data.length;i++){
            for(let j=0;j<data[i].orderdata.length;j++){
                const [dd, mm, yyyy] = data[i].orderdata[j][0].Order_date.split("/");
                const date = new Date(`${mm}/${dd}/${yyyy}`);
                const isInMonth = isInCurrentMonth(date);
                const isInWeek = isInCurrentWeek(date);
                if(isInMonth){
                    ThisMonthRevenue+=data[i].orderdata[j][0].Total_price;
                    NumberOfItemsOrderMonth+=data[i].orderdata[j].length-1;
                    MonthNumberOfOrders++;
                }
                if(isInWeek){
                    THisWeekRevenue=data[i].orderdata[j][0].Total_Price;
                    NumberOfItemsOrderWeek+=data[i].orderdata[j].length-1;
                    WeekNumberOfOrder++;
                }
            }
        }
        // const responseData = {
        //     ThisMonthRevenue,
        //     MonthNumberOfOrders,
        //     NumberOfItemsOrderMonth,
        //     ThisWeekRevenue,
        //     WeekNumberOfOrders,
        //     NumberOfItemsOrderWeek
        // };
        
        console.log(ThisMonthRevenue)
        res.json(responseData)
    } catch (error) {
        res.send(error)
    }
}