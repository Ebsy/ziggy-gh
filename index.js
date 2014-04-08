module.exports = function(ziggy) {
 
  var https = require("https");
 
  var ghOptions = {
    host: 'api.github.com',
    headers: {'user-agent': 'ziggy'}, //we need a user-agent to use the GitHub api.
    //auth: 'user:password' //uncomment this line and enter your github user/pass for incresed request limit
  }
 
  var ghResult = {};
 
  ziggy.on("message", function(user, channel, text){
    var bits = text.split(' ')
    , command = bits.shift()
 
    if ((command !== '!gh') || (!bits.length)){
      return;
    }
 
    var ghUser = bits[0];
    lookupGitHub(ghUser, sayInfo)
 
    function sayInfo(err, data) {
      if (err) {
        return ziggy.say(channel, "No GitHub account for " + user);
      }
      ziggy.say(channel, 
       "GitHub page at: " + data.html_url + " " +
       "Public Repos: " + data.public_repos + " and " + data.public_gists + " Gists. " +
       user + " has " + data.followers + 
       " followers and is following " + data.following + " other users.")
    }
 
  });
 
  function lookupGitHub(user, callback){
    var searchuser = user.toLowerCase();
    ghOptions.path = "/users/" + searchuser;
 
    https.get(ghOptions, function(result) {
      var reponseParts = []; //this will hold the 'stream'
 
      result.setEncoding('utf8');
      
      result.on("data", function(chunk) {
        reponseParts.push(chunk); //incrementally add the chunk data
      });
 
      result.on("end", function() {
        ghResult = JSON.parse(reponseParts.join("")); //join and parse the data when the request is finished.
        
        if (result.statusCode === 200) {
          return callback(null, ghResult)
        }
 
        return callback(result.statusCode)
      });
 
      result.on('error', function(e) {
        console.error(e);
      });
 
    }); //end of https.get
  }
}