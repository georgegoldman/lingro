const express = require('express')
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const upload = require('./uploadMiddleware')
const Resize = require('./Resize')
const path = require('path')
const PORT = process.env.PORT || 5000
const isProduction = process.env.NODE_ENV === 'production'
const bodyParser = require('body-parser')



const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const session = require('express-session')
// const morgan = require('morgan')
const csrf = require('csurf')
const csrfProtection = csrf({
    cookie: true
})

const countryList = require('./country')
const db = require('./models')
const bcrypt = require('bcrypt');
const {
    privateEncrypt
} = require('crypto');
const {
    title
} = require('process');
const salt = bcrypt.genSaltSync()


app.engine('.hbs', exphbs({
    extname: '.hbs'
}))

app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/public'))
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
// app.use(favicon(__dirname + '/public/icon/favicon.ico'))

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser())
app.use(session({
    key: 'user_sid',
    secret: '2432mpfm2fii@@P~~~~##',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000,
    }
}))
app.use(function(req, res, next) {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid')
    }
    next()
})

var sessionChecker = function(req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/ling');
    } else {
        next()
    }
}
app.get('/', csrfProtection, sessionChecker, function(req, res) {
    res.render('startup', {
        layout: null,

    });
})
app.route('/signup')
    .get(sessionChecker, csrfProtection, function(req, res) {
        console.log(req.query.accountsDontExist)
        res.render('signup', {
            layout: null,
            csrfToken: req.csrfToken(),
            countryList: countryList,
            accountExist: req.query.accountExist
        })
    })
    .post(function(req, res) {
        db.User.findOne({
            where: {
                email: req.body.email
            }
        }).then(function(user) {
            if (user) {
                // res.send('seen')
                res.redirect('/signup?accountExist=haveAccount');
            }
            if (!user) {
                db.User.create({
                        name: req.body.name,
                        email: req.body.email,
                        tell: req.body.tell,
                        country: req.body.country,
                        password: bcrypt.hashSync(req.body.password, salt)
                    })
                    .then(function(user) {
                        // req.session.user = user.dataValues;
                        db.ProfilePix.create({
                            pix: 'default.png',
                            UserId: user.dataValues.id
                        })
                        if (req.body.acountType == 'Farmer') {
                            db.UserType.create({
                                farmer: true,
                                UserId: user.dataValues.id
                            })
                        } else if (req.body.acountType == 'Agro company') {
                            db.UserType.create({
                                agroCompany: true,
                                UserId: user.dataValues.id
                            })
                        } else {
                            next()
                        }
                        res.redirect('/signin')
                    })
            }
        })
    })
app.route('/signin')
    .get(csrfProtection, function(req, res) {
        // res.send('app in progress')
        console.log()
        res.render('signin', {
            layout: null,
            csrfToken: req.csrfToken(),
            accountExist: req.query.noAccount
        })
    })
    .post(function(req, res) {

        var email = req.body.email,
            password = req.body.password;
        db.User.findOne({
            where: {
                email: email
            },
            include: [db.ProfilePix, db.Farm, db.ChatHistory],
        }).then(function(user) {
            if (!user) {
                // res.redirect('/signin');
                res.redirect('/signin?noAccount=haveNoAccount')
            } else if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user.dataValues
                // console.info(user)
                res.redirect('/lingro')
            } else {
                res.redirect('/signin?noAccount=haveNoAccount')

            }
        })
    })
app.get('/lingro', function(req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.render('lingro', {
            layout: 'main',
            user: req.session.user,
        })

    } else {
        res.redirect('/signin')
    }
})
app.route('/updateProfile')
    .get(csrfProtection, function(req, res) {
        if (req.session.user && req.cookies.user_sid) {
            // console.info(req.session.user)
            res.render('update_profile', {
                layout: 'main',
                csrfToken: req.csrfToken(),
                user: req.session.user
            })
        }
    })
    .post(upload.single('pix'), async function(req, res) {
        const imagePath = path.join(__dirname, '/public/img')
        const fileUpload = new Resize(imagePath)
        if (!req.file) {
            res.status(401).json({
                error: 'please provide an image'
            })
        }
        const filename = await fileUpload.save(req.file.buffer)
        // console.log(req.session.user.ProfilePixes[0].id)
        db.ProfilePix.update({
                pix: filename
            }, {
                where: {
                    UserId: req.session.user.id
                },
                returning: true,
            })
            .then(req.session.user.ProfilePixes[0].pix = filename)
        // console.info(typeof(req.session.user.id))
        res.redirect('/updateProfile')
        res.status(401).json({
            error: req.session.user.id
        })
    })



app.route('/farm')
    .get(csrfProtection, function(req, res) {
        if (req.session.user && req.cookies.user_sid) {
            res.render('farm', {
                csrfToken: req.csrfToken(),
                user: req.session.user,
                layout: 'main',
            })
        }
    })
    .post(function(req, res) {
        db.Farm.create({
                name: req.body.name,
                type: req.body.type,
                produce: req.body.produce,
                UserId: req.session.user.id

            })
            .then(function() {
                res.redirect('/farm')
            })
    })

app.route('/chatRoom')
    .get(csrfProtection, function(req, res) {
        if (req.session.user && req.cookies.user_sid) {
            db.ChatHistory.findAll({
                    where: {
                        UserId: req.session.user.id,
                        receiver: 2,
                    }
                })
                .then(function(chat) {
                    const msgList = []
                    try {

                        for (i = 0; i <= chat.length; i++) {
                            console.log(chat[i].message)
                            msgList.push(chat[i].message)
                        }

                    } catch (TypeError) {
                        console.error('error fixed')
                    }
                    console.log(msgList)
                    console.log(chat.length)
                    // res.send(chat)
                    res.render('chatrooms', {
                        csrfToken: req.csrfToken(),
                        user: req.session.user,
                        chat: msgList,
                    })
                })

        }
    })
app.route('/ling')
    .post(function(req, res) {
        res.send({
            success: true,
            ling: req.body.ling
        })
    })
// app.get('/testFetch', function(req, res) {
//     db.UpVote.findAll({
//             attributes: {}
//         })
//         .then(likes => {
//             res.json({
//                 like: likes,
//                 user: req.session.user
//             })
//         })

// })
app.route('/trends')
    .get(function(req, res) {
        if (req.session.user && req.cookies.user_sid) {
            res.render('trends', {
                layout: 'main'
            })
        }
    })

app.route('/notification')
    .get(function(req, res) {
        if (req.session.user && req.cookies.user_sid) {
            res.render('notifications', {
                layout: 'main'
            })
        }
    })

app.get('/settings', function(req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.render('settings', {
            layout: 'main',
            user: req.session.user
        })
    }
})

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        if (data.msg == '') {
            console.log('no message sent')
            io.emit('message', (data.msg))
        } else {
            db.ChatHistory.create({
                message: data.msg,
                receiver: data.receiver,
                UserId: data.sender
            }).then(function() {
                io.emit('message', (data))
                console.log('message: ' + data.msg)
            })
        }
    })
    // db.UpVote.findAll({
    //         attributes: {}
    //     })
    //     .then(like => {
    //         io.emit('like', (like))
    //         // console.log(like)
    //     })
})


io.on('connection', (socket) => {
    // io.emit('message', 'data base data apears here')
    // console.log('\n user connected \n ')
    // socket.on('disconnect', () => {
    //     console.log(' \n user disconnected \n ')
    // })
})

app.get('/logout', function(req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/')
    } else {
        res.redirect('/signin')
    }
})
app.use(function(req, res, next) {
    res.status(404).send("sorry can't find that!")
})


db.sequelize.sync({
        // force: true
    })
    .then(function() {
        server.listen(PORT, function() {

        });
    })