const express = require('express');

const router = express.Router();

const auth =

require(

'../middleware/auth'

);



const doctorController =

require(

'../controllers/doctorController'

);



/* ==============================

Get All Doctors

============================== */

router.get(

'/',

doctorController.getDoctors

);



/* ==============================

Get Doctor By ID

============================== */

router.get(

'/:id',

doctorController.getDoctor

);



/* ==============================

Search Doctors

============================== */

router.get(

'/search/query',

doctorController.searchDoctor

);



/* ==============================

Add Doctor

(Admin Only)

============================== */

router.post(

'/',

auth,

doctorController.addDoctor

);



/* ==============================

Update Doctor

============================== */

router.put(

'/:id',

auth,

doctorController.updateDoctor

);



/* ==============================

Delete Doctor

============================== */

router.delete(

'/:id',

auth,

doctorController.deleteDoctor

);



module.exports = router;