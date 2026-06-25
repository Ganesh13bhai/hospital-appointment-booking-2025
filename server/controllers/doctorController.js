const db = require('../database/connection');


/* =================================

Get All Doctors

================================= */

exports.getDoctors = (req, res) => {

    db.all(

        `SELECT * FROM doctors`,

        [],

        (err, rows) => {

            if (err) {

                return res.status(500)

                    .json({

                        error: err.message

                    });

            }

            res.json(rows);

        }

    );

};



/* =================================

Get Doctor By ID

================================= */

exports.getDoctor = (req, res) => {

    db.get(

        `SELECT * FROM doctors WHERE id=?`,

        [

            req.params.id

        ],

        (err, row) => {

            if (err) {

                return res.status(500)

                    .json({

                        error: err.message

                    });

            }

            res.json(row);

        }

    );

};



/* =================================

Add Doctor

================================= */

exports.addDoctor = (req, res) => {

    const {

        name,

        specialization,

        experience,

        fees,

        availability

    } = req.body;



    db.run(

        `

INSERT INTO doctors(

name,

specialization,

experience,

fees,

availability

)

VALUES(

?,

?,

?,

?,

?

)

`,

        [

            name,

            specialization,

            experience,

            fees,

            availability

        ],

        function (err) {

            if (err) {

                return res.status(500)

                    .json({

                        error: err.message

                    });

            }



            res.json({

                success: true,

                id: this.lastID

            });

        }

    );

};



/* =================================

Update Doctor

================================= */

exports.updateDoctor = (req, res) => {


    const {

        name,

        specialization,

        experience,

        fees,

        availability

    } = req.body;



    db.run(

        `

UPDATE doctors

SET


name=?,


specialization=?,


experience=?,


fees=?,


availability=?


WHERE id=?


`,

        [

            name,

            specialization,

            experience,

            fees,

            availability,

            req.params.id

        ],

        err => {


            if (err) {


                return res.status(500)

                    .json({

                        error: err.message

                    });

            }


            res.json({

                success: true

            });

        }

    );

};



/* =================================

Delete Doctor

================================= */

exports.deleteDoctor = (req, res) => {


    db.run(

        `DELETE FROM doctors WHERE id=?`,

        [

            req.params.id

        ],

        err => {


            if (err) {


                return res.status(500)

                    .json({

                        error: err.message

                    });

            }


            res.json({

                success: true

            });


        }

    );


};



/* =================================

Search Doctors

================================= */

exports.searchDoctor = (req, res) => {


    const search =

        `%${req.query.q}%`;



    db.all(

        `

SELECT *

FROM doctors

WHERE specialization

LIKE ?

`,

        [

            search

        ],

        (err, rows) => {


            if (err) {


                return res.status(500)

                    .json({

                        error: err.message

                    });

            }



            res.json(rows);


        }

    );


};