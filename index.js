module.exports = function(ziggy) {

  var https = require("https");

  var ghOptions = {
    host: 'api.github.com',
    headers: {'user-agent': 'ziggy'}, //we need a user-agent to use the GitHub api.
    //auth: 'user:password' //uncomment this line and enter your github user/pass for incresed request limit
  }

  var ghResult = {};

  ziggy.on("message", function(user, channel, text){
    //var channel = config.channels[0];
    var bits = text.split(' ')
    , command = bits.shift()

    if ((command === '!gh') && (bits.length > 0)){
      var ghUser = bits[0];
      lookupGitHub(ghUser, channel)
    }

  });

  function lookupGitHub(user, channel){
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
           //bot.say(channel, "Link at: " + gitHubReturn.html_url)
           ziggy.say(channel, 
            "GitHub page at: " + ghResult.html_url + " " +
            "Public Repos: " + ghResult.public_repos + " and " + ghResult.public_gists + " Gists. " +
            user + " has " + ghResult.followers + 
            " followers and is following " + ghResult.following + " other users.")
        }
        else {
           ziggy.say(channel, "No GitHub account for " + user);
        }
      });

      result.on('error', function(e) {
        console.error(e);
      });

    }); //end of https.get
  }
}