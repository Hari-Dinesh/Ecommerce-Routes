import express from 'express';
import { movieController } from "../controllers/movieController.js";
import { adminverify } from '../middlewares/verifyauth.js';
const router = express.Router();
router.get('/allmovies',movieController.getAllMovies)
router.post('/addNewMovie',adminverify,movieController.addNewMovie)
router.get('/getMovie/:id',movieController.getMovieById)
router.put('/updateMovie/:id',adminverify,movieController.updateMovie)
router.delete('/deleteMovie/:id',adminverify,movieController.deleteMovie)
export default router