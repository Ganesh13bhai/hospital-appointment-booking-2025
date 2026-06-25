const db=require('../database/connection');

exports.getAppointments=(req,res)=>{

db.all(

`SELECT appointments.*,

doctors.name as doctor_name

FROM appointments

LEFT JOIN doctors

ON doctors.id=appointments.doctor_id

ORDER BY appointment_time DESC`,

[],

(err,rows)=>{

if(err){

return res.status(500).json({

error:err.message

});

}

res.json(rows);

}

);

};



exports.getAppointment=(req,res)=>{

db.get(

`SELECT *

FROM appointments

WHERE id=?`,

[req.params.id],

(err,row)=>{

if(err){

return res.status(500)

.json({

error:err.message

});

}

res.json(row);

}

);

};



exports.bookAppointment=(req,res)=>{


const {

patient_name,

email,

phone,

doctor_id,

symptoms,

appointment_time

}=req.body;



const report_path=

req.file

?

req.file.path

:

'';



db.run(

`

INSERT INTO appointments(

patient_name,

email,

phone,

doctor_id,

symptoms,

appointment_time,

status,

report_path

)

VALUES(

?,

?,

?,

?,

?,

?,

?,

?

)

`,

[

patient_name,

email,

phone,

doctor_id,

symptoms,

appointment_time,

'Pending',

report_path

],

function(err){


if(err){


return res

.status(500)

.json({

error:err.message

});


}



res.json({


success:true,


appointmentId:

this.lastID


});


}


);


};





exports.updateAppointment=(req,res)=>{


const {


status,


appointment_time


}=req.body;



db.run(

`

UPDATE appointments


SET


status=?,


appointment_time=?


WHERE id=?


`,

[


status,


appointment_time,


req.params.id


],

err=>{


if(err){


return res

.status(500)

.json({

error:err.message

});


}



res.json({


success:true


});


}


);


};






exports.deleteAppointment=(req,res)=>{


db.run(

`

DELETE FROM appointments

WHERE id=?

`,

[

req.params.id

],

err=>{


if(err){


return res

.status(500)

.json({

error:err.message

});


}



res.json({


success:true


});


}


);


};






exports.searchAppointment=(req,res)=>{


const q=

`%${req.query.q}%`;



db.all(

`

SELECT *

FROM appointments

WHERE patient_name

LIKE ?

OR email

LIKE ?

`,

[

q,

q

],

(err,rows)=>{


if(err){


return res

.status(500)

.json({

error:err.message

});


}



res.json(rows);


}


);


};






exports.filterStatus=(req,res)=>{


db.all(

`

SELECT *

FROM appointments

WHERE status=?

`,

[

req.params.status

],

(err,rows)=>{


if(err){


return res

.status(500)

.json({

error:err.message

});


}



res.json(rows);


}


);


};