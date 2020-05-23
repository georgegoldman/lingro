const express = require('express')
const app = express();
const upload = require('./uploadMiddleware')
const Resize = require('./Resize')
const path = require('path')
const PORT = process.env.PORT || 5000
const isProduction = process.env.NODE_ENV === 'production'

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
const salt = bcrypt.genSaltSync()

app.engine('.hbs', exphbs({
    extname: '.hbs'
}))
app.set('view engine', '.hbs');
app.use(express.static(__dirname + '/public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.use(express.urlencoded());
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
        res.redirect('/cropbank');
    } else {
        next()
    }
}
app.get('/', csrfProtection, sessionChecker, function(req, res) {
    res.redirect('/signin');
})
app.route('/signup')
    .get(sessionChecker, csrfProtection, function(req, res) {
        res.render('signup', {
            layout: 'home',
            csrfToken: req.csrfToken(),
            countryList: countryList,
        })
    })
    .post(function(req, res) {
        db.User.findOne({
            where: {
                email: req.body.email
            }
        }).then(function(user) {
            if (user) {
                res.redirect('/signin');
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
                        res.redirect('/')
                    })
            }
        })
    })
app.route('/signin')
    .get(csrfProtection, function(req, res) {
        res.render('signin', {
            layout: 'home',
            csrfToken: req.csrfToken()
        })
    })
    .post(function(req, res) {

        var email = req.body.email,
            password = req.body.password;
        db.User.findOne({
            where: {
                email: email
            },
            include: [db.ProfilePix, db.Farm],
        }).then(function(user) {
            if (!user) {
                res.redirect('/signin');
            } else if (!user) {
                res.redirect('/signin')
            } else {
                req.session.user = user.dataValues
                console.info(user)
                res.redirect('/cropbank')
            }
        })
    })
app.get('/cropbank', function(req, res) {
    if (req.session.user && req.cookies.user_sid) {
        res.render('cropbank', {
            layout: 'main',
            user: req.session.user
        })
    } else {
        res.redirect('/signin')
    }
})
app.route('/updateProfile')
    .get(csrfProtection, function(req, res) {
        if (req.session.user && req.cookies.user_sid) {
            console.info(req.session.user)
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
            res.status(401).json({ error: 'please provide an image' })
        }
        const filename = await fileUpload.save(req.file.buffer)
        console.log(req.session.user.ProfilePixes[0].id)
        db.ProfilePix.update({
                pix: filename
            }, {
                where: { UserId: req.session.user.id },
                returning: true,
            })
            .then(req.session.user.ProfilePixes[0].pix = filename)
        console.info(typeof(req.session.user.id))
        res.redirect('/updateProfile')
        res.status(401).json({ error: req.session.user.id })
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
        app.listen(PORT, function() {
            console.log(`runnig server on port http://localhost:${PORT}/`)
        });
    })