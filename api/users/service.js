//load input validation
const validateLogin = require("../helper/utils");
const model = require('./model');
const keys = require("../config/config");
const jwt = require("jsonwebtoken");
const isEmpty = require("is-empty");
const multer = require('multer');

const fileStore = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '../uploads'); //specify destination folder
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname); //specify file name
    }
})

const upload = multer({ storage: fileStore }).single('file');

module.exports = {
    /*
    *this service checks for user authentication basedon username and password.
    *it issues jwt token based on current user profile.
    */
    authentication(req, res) {
        const username = req.body.username;
        const password = parseInt(req.body.password);

        const { errors, isValid } = validateLogin(req.body);

        if (!isValid) return res.status(400).json(errors);//check validation. return error if necesssary

        model.authenticate(username, password)
            .then(result => {

                const parsedResult = JSON.parse(result);
                const payload = {
                    _id: parsedResult[0]._id,
                    id: parsedResult[0].id,
                    name: parsedResult[0].name,
                    role: parsedResult[0].role,
                };

                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: keys.jwtTokenExpireTime
                    },
                    (err, token) => {
                        if (err) throw err;

                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            })
            .catch((err) => {

                res.sendStatus(400);
            });
    },
    /**
     * Function to get user details based on user id.
     */
    getUserDetail(req, res) {
        const userId = req.params.id;

        model.findById(userId).then(result => {
            const parsedResult = JSON.parse(result);
            res.status(200).json(parsedResult.data);
        }).catch(() => {
            res.sendStatus(400);
        });
    },
    /**
     * Function to get user posts based on user id.
     */
    getUserPosts(req, res) {
        const userId = req.params.id;

        model.findUserPosts(userId).then(result => {
            const parsedResult = JSON.parse(result);
            res.status(200).json(parsedResult.data);
        }).catch(() => {
            res.sendStatus(400);
        });

    },
    /**
     * Function to get all user based on user role.
     */
    getUsers(req, res) {
        const parsedResult = JSON.parse(req.user); //user detail returned by passport
        const role = parsedResult.data[0].role;

        if (role !== 'admin') return res.json({ message: 'Unauthorised entry' });

        model.listUser().then(result => {
            const parsedResult = JSON.parse(result);
            res.status(200).json(parsedResult.data);
        }).catch((err) => {
            res.sendStatus(400);
        });

    },
    /**
     * Function to get all posts based on user role.
     */
    async getPosts(req, res) {
        const parsedResult = JSON.parse(req.user); //user detail returned by passport
        const role = parsedResult.data[0].role;

        if (role !== 'admin') return res.json({ message: 'Unauthorised entry' });

        allposts = [];
        try {
            userList = await model.listUser();
            const parsedResult = JSON.parse(userList);
            const count = parsedResult.data.length;

            for (let i = 0; i < 10; i++) {
                userPost = await model.findUserPosts(i + 1);
                const parsedPost = JSON.parse(userPost);
                allposts.push(parsedPost.data);
            }
            res.status(200).json(allposts);
        } catch (err) { res.sendStatus(400); }

    },
    /**
     * Function to logout
     */
    logout(req, res) {
        req.logout();
        res.status(200);
    },
    /**
     * Function to upload user image
     */
    uploadImg(req, res) {
        upload(req, res, function (err) {
            //check for multer error
            if (err instanceof multer.MulterError)
                res.status(500).json({ message: err });
            //check for general error
            else if (err)
                res.status(500).json({ message: err });

            return res.status(200).send(req.file);
        })
    }
}