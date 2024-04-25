import express from 'express'
import { lithium } from '../controllers/lithiumController.js'
const router=express.Router()
router.post('/date',lithium.dateFilter)
router.post('/driver',lithium.driversRides)
router.get('/ordersbycity',lithium.citywise)
router.get('/:id',lithium.driverid)
router.post('/filterbydate',lithium.datefiltergetrevenue)
router.post('/totalrides',lithium.totalRideType)
router.post('/revbycarnumber/:id',lithium.revnbycarnumber)
router.post('/timezonebyhour',lithium.timezone)
router.get('/timezonebylimit',lithium.timezonebylimit)
export default router