
import { client } from "../db.js";
class movieController{
    static async getAllMovies(req,res){
        try {
            const data=await client.query(`select * from movies`)
            res.status(201).json({status:201,success:true,movies:data.rows})
        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
    static async addNewMovie(req,res){
        const {title,release_date,length_minutes}=req.body
        try {
            const query = 'INSERT INTO movies (title, release_date, runtime) VALUES ($1, $2, $3)';
            const values = [title, release_date, length_minutes];
            await client.query(query, values);
            res.status(201).json({status:201,success:true,message:"new movie added sucessfully"})
        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
    static async getMovieById(req,res){
        try {
            const {id}=req.params
            const query = 'SELECT * FROM movies WHERE movie_id = ${}';
            const values = [id];
            const result = await client.query(query, values);
            if(result.rows.length==0){
                res.status(302).json({status:302,success:false,message:"incorrect movie Id"})
            }
            res.status(201).json({status:201,success:true,data:result.rows[0]})
        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
    static async updateMovie(req,res){
        try {
            const {id}=req.params
            const {title,release_date,length_minutes}=req.body
            const data = await client.query('UPDATE movies SET title = COALESCE($2, title), release_date = COALESCE($3, release_date), runtime = COALESCE($4, runtime)  WHERE movie_id = $1 RETURNING *', [id, title, release_date,length_minutes]);
            res.status(201).json({status:201,success:true,data:data.rows[0]})
        } catch (error) {
            console.log(error)
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
    static async deleteMovie(req,res){
        try {
            const {id}=req.params
            const query=await client.query('delete from movies where movie_id = $1 RETURNING *',[id])
            if(query.rows.length==0){
                res.status(302).json({status:302,success:false,message:"incorrect movie Id no movie deleted"})//
            }
            res.status(201).json({status:201,success:true,message:"new movie added sucessfully",query})
        } catch (error) {
            res.status(500).json({status:500,success:false,message:error.message})
        }
    }
    
}
export {movieController}