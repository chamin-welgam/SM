const  express = require('express');
const  session = require('express-session')
const  bodyParser = require('body-parser')
const  path = require('path');
const  cors = require('cors');

const  app = express();

var __validUsers = ['chaminda.welgamage@gmail.com'];
var __validUsersID = [99];
var __currentUserID=-1;

app.use(session({
  secret: 'Taffy the keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 }
}))

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: false })); // to support URL-encoded bodies
app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors());
//  email address
var authenticateEmail = function (email) {
    for (var i = __validUsers.length - 1; i >= 0; i--) {
        if(__validUsers[i]== email){
            return __validUsersID[i] ; // user id
        }
    };
    return -1; //invalid
}

// Define authentication middleware BEFORE your routes
var authenticate = function (req, res, next) {
  //  validation current user
  var _isAuthenticated = false;
  console.log ('debug:: session user ' +req.session.user);
  if (req.session.user!= null)  {
    //validate user id and session expiry  with database
    _isAuthenticated=__currentUserID == req.session.user;
    //todo
  }  else  {
    req.session.user=0;
  }   

  if (_isAuthenticated) {
    next();
  }  else {
    res.sendFile(__dirname +'/src/public/login.html');
  }
}

app.set('port', process.env.PORT || 8000);

app.get('/', authenticate, function(req, res){
    console.log('debug:: home page hit');
    res.sendFile(__dirname+'/dist/index.html');
});

app.get('/about',authenticate, function(req, res){
    var xMessage = 'development stage';
    res.sendFile(__dirname +'/src/public/about.html');
});

app.get('/auth', function(req, res){
 res.send('auth'+ req.boby);
});

app.get('/token', function(req, res){
    var _tokenID= req.query.tokenid;
    console.log('debug:: '+ _tokenID);
    if (!_tokenID){
        // no tokenid, then redirect to home
        res.redirect('/');
        return;
    }

    //calling google web API to validate the token
    const _https = require('https');
    const _URL = require('url');
    const _options =  _URL.parse('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+_tokenID);
    const _req = _https.request(_options, (_res) => {
        if (_res.statusCode ==200){
            console.log('status OK');
            _res.on('data', (_data) => {
                var _userData= JSON.parse(_data);
                if (_userData.email_verified){
                    console.log('user : ' +_userData.email);
                    var _userID= authenticateEmail(_userData.email);
                    if( _userID>0){
                        __currentUserID= _userID;
                        req.session.user= _userID;
                        console.log('redirect');
                        res.redirect('/');         
                    }else{
                        console.log('invalid user');
                        res.status(401);
                        res.send('invalid user');
                    }
                }else{
                    console.log('email is not verified');
                    res.status(401)    ;
                    res.send('email is not verified')   ;
                }
            })
        }else{
            res.status(200)    ;
            res.send('verification failed. please retry')   ;
        }
    });

    _req.on('error', (_e) => {
        console.error(_e);
        res.status(200)    ;
        res.send('Verification error. please retry')   ;
    });
    _req.end();
});

//api
//api/function
app.get('/api/function', function(req, res){
    var _APIClass  = require('./src/framework/SM-functions.js');
    var _API = new _APIClass(req, res);
    _API.executeFunction();
});


//get a list
app.get('/api/getList', function(req, res){
    var _mdClass  = require('./src/app/master-data/master-data.js');
    var _md = new _mdClass(req, res);
    _md.getAccountsList();
});

//get a record
app.get('/api/getARecord', function(req, res){
    var _accTrnClass  = require('./src/app/accounting/accountTransactions.js');
    var _accTrn = new _accTrnClass(req, res);
    _accTrn.getTransactions();
});

//get a single value
app.get('/api/getAValue', function(req, res){
    var _cIHClass = require ('./src/app/accounting/accountTransactions.js');
    var _cIH =  new _cIHClass(req,res); 
    _cIH.getChequesInHand();
});

// add  a record
app.get('/api/addRec', function(req, res){
    var _APIClass  = require('./src/app/framework/records.js');
    var _API = new _APIClass(req, res);
    _API.addARecord();
});

// Update a record
app.get('/api/updRec', function(req, res){
    var _frameworkAPI  = require('./src/app/framework/frameworkAPI.js');
    var _API = new _frameworkAPI(req, res);
    _API.getNextPurchaseVoucherNo();
});

// delete a record
app.get('/api/delRec', function(req, res){
    var _APIClass  = require('./src/app/framework/accountTransactions.js');
    var _API = new _APIClass(req, res);
    _API.addPurchaseVoucher();
});


//designer

//designer/api

//newForm
app.get('/designer/api/newForm', function(req, res){
    var _APIClass  = require('./src/designer/newForm.js');
    var _API = new _APIClass(req, res);
    _API.newForm();
});

// create form
app.get('/designer/api/createForm', function(req, res){
    var _APIClass  = require('./src/designer/form.js');
    var _API = new _APIClass(req, res);
    _API.create();
});
//create formBackend
app.get('/designer/api/createFormBackend', function(req, res){
    var _APIClass  = require('./src/designer/form.js');
    var _API = new _APIClass(req, res);
    _API.createForm();
});


// custom 404 page
app.use(function(req, res){
    //res.type('text/plain');
    res.status(404);
    //res.send('404 - Not Found');
    res.sendFile(__dirname+'/src/public/404.html');
});

// custom 500 page
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    //        res.send('500 - Server Error');
    res.sendFile(__dirname +'/scr/public/500.html');
});

/*
// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendFile(__dirname +'/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
*/

app.listen(app.get('port'), function(){
  console.log( 'Software Machines started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
