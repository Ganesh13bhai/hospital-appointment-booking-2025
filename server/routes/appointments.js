const express=require('express');

const router=express.Router();

const auth=

require(

'../middleware/auth'

);


const upload=

require(

'../middleware/upload'

);


const appointmentController=

require(

'../controllers/appointmentController'

);



router.get(

'/',

auth,

appointmentController.getAppointments

);



router.get(

'/search',

auth,

appointmentController.searchAppointment

);



router.get(

'/status/:status',

auth,

appointmentController.filterStatus

);



router.get(

'/:id',

auth,

appointmentController.getAppointment

);



router.post(

'/',

upload.single(

'report'

),

appointmentController.bookAppointment

);



router.put(

'/:id',

auth,

appointmentController.updateAppointment

);



router.delete(

'/:id',

auth,

appointmentController.deleteAppointment

);



module.exports=router;