const express = require('express')
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
const {GoogleAuth} = require('google-auth-library');
const env = require('dotenv').config();
const app = express()
const port = 80

var CLIENT_ID = "551192543790-mfvprfq42601offfjn2vi4da00fg27i5.apps.googleusercontent.com";

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('../frontend'));

var user = mongoose.model('User', new mongoose.Schema({ id: String, gameState: String }));

app.post('/api/user/post', (req, res) => {
    console.log(req.body);
    verify(req.body.token).then((foundId) => {
        var id = foundId;
        user.findOne({id: id}).then((u) => {
            if(u) {
                u.gameState = req.body.gameState;
                u.save();
                res.status(200);
                res.send();
            } else {
                user.create({id: id, gameState: req.gameState}).then(() => {
                    res.status(200);
                    res.send();
                })
            }
        }).catch((err) => {
	    console.log(err);
            res.status(400);
            res.send();
        })
    }).catch((err) => {
	console.log(err);
        res.status(400);
        res.send();
    });
})

app.post('/api/user/get', (req, res) => {
    console.log(req.body);
    verify(req.body.token).then((foundId) => {
        var id = foundId;
        user.findOne({id: id}).then((u) => {
            if(u) {
		console.log("sending state: " + u.gameState);
                res.status(200);
                res.send(u.gameState);
            } else {
                res.status(400);
                res.send();
            }
        }).catch((err) => {
	    console.log(err);
            res.status(400);
            res.send();
        })
    }).catch((err) => {
	console.log(err);
        res.status(400);
        res.send();
    });
})

mongoose.connect(process.env.MONGO_HOST, { useNewUrlParser: true }).then(() => {
    app.listen(port, () => console.log(`App listening on port ${port}!`));
}).catch((err) => {
    console.log(err)
})

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  console.log(userid);
  return userid;
}
