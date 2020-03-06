var express = require('express');
var router = express.Router();
const jwt = require('jwt-simple');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const SECRET = 'MY_SECRET_KEY';
const passport = require('passport');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: SECRET
};
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
    if (payload.sub === 'testtest') done(null, true);
    else done(null, false);
});

passport.use(jwtAuth);

const requireJWTAuth = passport.authenticate('jwt', { session: false });

const loginMiddleware = (req, res, next) => {
    if (req.body.username === 'test' && req.body.password === 'test') next();
    else res.send('Wrong username and password');
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('auth');
});

router.post('/', loginMiddleware, function(req, res, next) {
    const payload = {
        sub: req.body.username + req.body.password,
        iat: new Date().getTime()
    };
    res.send({ authKey: jwt.encode(payload, SECRET) });
});

router.get('/test-auth', requireJWTAuth, function(req, res, next) {
    res.send('auth success');
});

module.exports = router;
