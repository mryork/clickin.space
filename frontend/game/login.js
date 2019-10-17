var apiURL = "http://clickin.space/api/user/post";
var getapiURL = "http://clickin.space/api/user/get";
var id_token = "";

var mainGame;

function setGameLogin(game) {
  mainGame = game;
}


function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  id_token = googleUser.getAuthResponse().id_token;
  mainGame();

}

function getProfileInfo () {
  var auth2 = gapi.auth2.getAuthInstance();
  if (auth2.isSignedIn.get()) {
  	var profile = auth2.currentUser.get().getBasicProfile();
  	console.log('ID: ' + profile.getId());
  	console.log('Full Name: ' + profile.getName());
  	console.log('Given Name: ' + profile.getGivenName());
  	console.log('Family Name: ' + profile.getFamilyName());
  	console.log('Image URL: ' + profile.getImageUrl());
  	console.log('Email: ' + profile.getEmail());
  }
}

/*function isUserLoggedin() {
  return new Promise((res, rej) => {
    try {
    var auth2 = gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
      res();
    } } catch {
      rej();
    }
  });
}*/

function getGoogleToken() {
  return id_token;
}

function sendGameState(gameState) {
  var postable = JSON.stringify(gameState);
  postData(apiURL, {token: id_token, gameState: postable});
}

async function getGameState() {
  var gameState = {};
try {
  await postData(getapiURL, {token: id_token}).then(response => response.json())
  .then(json => {
    gameState = json;
  });
  return gameState; } catch {
return undefined;
} 
}

function signOut(gameState) {
  sendGameState(gameState);
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
console.log(response);
  return await response; // parses JSON response into native JavaScript objects
}
