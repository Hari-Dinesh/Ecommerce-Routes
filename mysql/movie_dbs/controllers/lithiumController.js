import { client } from "../db.js";
import { validate_date } from "../helpers/lithium_date.js";
class lithium{
    static async dateFilter(req,res){
        try {
            const value=await validate_date.validate(req.body)
            const query='SELECT SUM(pty_your_earnings::NUMERIC) AS TOTAL_SUM FROM trip_report WHERE DATE(trip_request_time) = $1 AND trip_status = $2'
            const values=[value.date,value.trip_status]
            const result=await client.query(query,values)
            res.status(200).json({status:200,success:true,Total_amount:result.rows[0].total_sum})
        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
    static async driversRides(req,res){
        try {
            const { limit,offset } = req.body;
            const query = 'SELECT driver_uuid, COUNT(driver_uuid) AS rides FROM trip_report GROUP BY driver_uuid ORDER BY rides desc LIMIT $1 OFFSET $2';
            const values = [limit, offset];
            const result = await client.query(query, values);
            res.status(200).json({ status: 200, success: true, data: result.rows });

        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
    static async citywise(req,res){
        try {
            const result=await client.query('select city,sum(pty_your_earnings::NUMERIC) from trip_report where city is not null group by city')
            res.status(200).json({ status: 201, success: true, data: result.rows });
        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
    static async driverid(req,res){
        try {
            const {id}=req.params
            const query=client.query('select driver_uuid,sum(trip_distance::numeric) as total_distance,sum(pty_your_earnings::numeric) as total_income from trip_report group by driver_uuid having driver_uuid=$1',[id])
            res.status(200).json({ status: 2010, success: true, data: query.rows });
        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
    static async datefiltergetrevenue(req,res){
        try {
            const {from_date,to_date}=req.body
            const query= await client.query('select count(*)as total_rides,sum(trip_distance::numeric) as total_distance,sum(pty_your_earnings::numeric) from trip_report where date(trip_request_time) between $1 and $2',[from_date,to_date])
            res.status(200).json({ status: 201, success: true, data: query.rows });
        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
    static async totalRideType(req,res){
        try {
            const query= await client.query('select trip_status,count(trip_status) from trip_report group by trip_status')
            res.status(200).json({ status: 201, success: true, data: query.rows });
        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
    static async revnbycarnumber(req,res){
        try {
            const {id}=req.params
            const query=await client.query('select count(*) as number_of_rides from trip_report where vehicle_number=$1',[id])
            res.status(200).json({ status: 201, success: true, data: query.rows })
        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
    static async timezone(req,res){
        try {
            const query=await client.query(' SELECT EXTRACT(HOUR FROM trip_request_time) as Time_hour,count(*) AS rides FROM trip_report group by Time_hour order by rides desc')
            res.status(200).json({ status: 201, success: true, data: query.rows })
        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
    static async timezonebylimit(req,res){
        try {
            const {limit}=req.body
            const query= await client.query('SELECT start_hour,CASE WHEN start_hour + $1 > 24 THEN 24 ELSE start_hour + $1 END AS end_hour,SUM(orders) OVER (ORDER BY start_hour ROWS BETWEEN CURRENT ROW AND $1 FOLLOWING) AS total_orders_in_this_session FROM (SELECT EXTRACT(HOUR FROM trip_request_time) AS start_hour,COUNT(*) AS orders FROM trip_report GROUP BY start_hour) AS HourlyOrders ORDER BY SUM(orders) OVER (ORDER BY start_hour ROWS BETWEEN CURRENT ROW AND $1 FOLLOWING) desc',[limit])
            res.status(200).json({ status: 201, success: true, data: query.rows })
            
        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
            
        }
    }
}
export {lithium}