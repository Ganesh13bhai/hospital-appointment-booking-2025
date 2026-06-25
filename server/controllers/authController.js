const db = require('../database/connection');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');



exports.register = async (req, res) => {

    try {

        const {

            username,

            password,

            role

        } = req.body;



        if (!username || !password) {

            return res.status(400)

                .json({

                    message: 'Missing fields'

                });

        }



        const hashedPassword = await bcrypt.hash(

            password,

            10

        );



        db.run(

            `

INSERT INTO users(

username,

password,

role

)

VALUES(

?,

?,

?

)

`,

            [

                username,

                hashedPassword,

                role || 'admin'

            ],

            function (err) {



                if (err) {

                    return res

                        .status(500)

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



    }

    catch (err) {


        res.status(500)

            .json({

                error: err.message

            });


    }


};




exports.login = (req, res) => {


    const {

        username,

        password

    } = req.body;




    db.get(

        `

SELECT *

FROM users

WHERE username=?

`,

        [

            username

        ],

        async (err, user) => {



            if (err) {


                return res

                    .status(500)

                    .json({

                        error: err.message

                    });


            }



            if (!user) {


                return res

                    .status(401)

                    .json({

                        message: 'User not found'

                    });


            }




            const validPassword =

                await bcrypt.compare(

                    password,

                    user.password

                );



            if (!validPassword) {


                return res

                    .status(401)

                    .json({

                        message: 'Wrong password'

                    });


            }



            const token = jwt.sign(

                {

                    id: user.id,

                    role: user.role

                },

                'secretkey',

                {

                    expiresIn: '24h'

                }

            );



            res.json({


                token,


                username: user.username,


                role: user.role


            });



        }

    );


};