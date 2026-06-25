const express=require('express');

const bodyParser=require('body-parser');

const cors=require('cors');

const path=require('path');

const fs=require('fs');

const db=require('./database/connection');



const authRoutes=

require('./routes/auth');

const doctorRoutes=

require('./routes/doctors');

const appointmentRoutes=

require('./routes/appointments');

const dashboardRoutes=

require('./routes/dashboard');



const app=express();

const PORT=3000;



app.use(cors());

app.use(express.json());

app.use(

bodyParser.urlencoded({

extended:true

})

);



app.use(

'/uploads',

express.static(

path.join(

__dirname,

'uploads'

)

)

);



app.use(

express.static(

path.join(

__dirname,

'../client/public'

)

)

);



app.get(

'/',

(req,res)=>{


res.sendFile(

path.join(

__dirname,

'../client/public/index.html'

)

);


}

);



app.use(

'/auth',

authRoutes

);



app.use(

'/doctors',

doctorRoutes

);



app.use(

'/appointments',

appointmentRoutes

);



app.use(

'/dashboard',

dashboardRoutes

);



db.serialize(()=>{

db.run(

`

INSERT OR IGNORE INTO users(

id,

username,

password,

role

)

VALUES(

1,

'admin',

'$2a$10$Kx7dQ4r3GXrR6Dly9M3M8u3wQn4r2w6KJ3g5M6J8wK8Y3w1KxJf8e',

'admin'

)

`

);

});



app.listen(

PORT,

()=>{


console.log(

`Server running at

http://localhost:${PORT}`

);


}

);