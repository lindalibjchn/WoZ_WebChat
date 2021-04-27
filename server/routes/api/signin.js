
const User = require('../../models/UserLib');
const UserSession = require('../../models/UserSession');

module.exports = (app) =>{

    //sign up
    app.post('/api/account/signup', (req,res,next) => {
        const {body} = req;
        const {
            nickName,
            password,
            agegroup,
            gender,
            agree
        } = body;

        let {email} = body;

        if (!nickName) {
            return res.send({
                success: false,
                message: 'Error: Nick name cannot be blank'
            });
        }

        if (!agegroup) {
            return res.send({
                success: false,
                message: 'Error: Age group cannot be blank'
            });
        }

        if (!gender) {
            return res.send({
                success: false,
                message: 'Error: Gender cannot be blank'
            });
        }

        if (!email) {
            return res.send({
                success: false,
                message: 'Error: email name cannot be blank'
            });
        }

        if (!password) {
            return res.send({
                success: false,
                message: 'Error: password cannot be blank'
            });
        }
        email = email.toLowerCase();

        //steps:
        //1. verify email exist
        //2. save
        User.find({
            email: email

        }, (err, perviousUsers) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error:Server error'
                });
            } else if (perviousUsers.length > 0) {
                return res.send({
                    success: false,
                    message: 'Error: Account already exist.'
                });
            }

            //save the new user
            const newUser = new User();
            newUser.email = email;
            newUser.nickName = nickName,
            newUser.agegroup = agegroup;
            newUser.agree = agree;
            newUser.gender = gender;

            newUser.password = newUser.generateHash(password);

            newUser.save((err, user) => {
                if (err) {
                    return res.send({
                        success: false,
                        message: 'Error:server error'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Signed up'
                });
            });
        });
    });

    //sign in
    app.post('/api/account/signin', (req,res,next) => {
        const {body} = req;
        const {
            password
        } = body;

        let {
            email
        } = body;

        if (!email) {
            return res.send({
                success: false,
                message: 'Error: email name cannot be blank'
            });
        };
        if (!password) {
            return res.send({
                success: false,
                message: 'Error: password cannot be blank'
            });
        }

        email = email.toLowerCase();
        //find user exist and check password
        User.find({
            email:email
        }, (err, users)=>{
            if(err){
                return res.send({
                    success: false,
                    message:'Error: server error in finding email'
                });
            }

            if(users.length != 1){
                return res.send({
                    success:false,
                    message: 'Error: Invalid'
                });
            }

            const user = users[0];  //users is a collection in mongodb (RT_Chat)
            if(!user.validPassword(password)){

                return res.send({
                    success:false,
                    message: 'Error: Invalid password'
                });
            }


            //correct user and put into user session
            const userSession = new UserSession();
            userSession.userId = user._id;
            userSession.save((err, doc) => {
                if(err){
                    return res.send({
                        success: false,
                        message:'Error: server error in usersession'
                    });
                }
                return res.send({
                    success: true,
                    message: "Valid signin",
                    token: doc._id,
                    user_id: doc.userId,
                    nickName: user.nickName
                });
            });
        });
    });

    //verify user
    app.get('/api/account/userverify', (req,res,next) => {
       //get the token
        //verify the token is one of a kind and it is not deleted

        const { query } = req;
        const { token } = query;

        UserSession.find({
            _id: token,
            isDeleted:false
        }, (err, sessions) =>{
            if(err){
                return res.send({
                    success:false,
                    message:'Error: server error (verify)'
                });
            }

            if(sessions.length != 1){
                return res.send({
                    success: false,
                    message: 'Error: invalid session'
                });
            } else {
                return res.send({
                    success: true,
                    message: "login automatically Great!"
                });
            }
        });
    });

    //logout
    app.get('/api/account/logout', (req,res,next) => {

        const { query } = req;
        const { token, userid } = query;
        let user;

        UserSession.findOneAndUpdate({
            _id: token,
            isDeleted:false
        },
            {
                $set:{
                    isDeleted:true
                }
            }, null, (err, sessions) =>
            {

                if(err){
                    console.log(err);
                    return res.send({
                        success:false,
                        message:'Error: server error (logout)'
                    });
                } else {
                    User.find({
                        _id:userid
                    }, (err, users) =>{
                        if(err){
                            return res.send({
                                success: false,
                                message:'Error: server error in finding userid'
                            });
                        }

                        if(users.length != 1){
                            return res.send({
                                success:false,
                                message: 'Error: Invalid'
                            });
                        }

                        user = users[0];
                        return res.send({
                            success: true,
                            nickName: user.nickName,
                            message: "logout automatically Great!"
                        });
                    })
                }
           });
    });
};