module.exports = function (ziggy) {

  var https = require("https");

  var ghOptions = {
    host: 'api.github.com',
    headers: {
      'user-agent': 'ziggy'
      //auth: 'user:password' //uncomment this line and enter your github user/pass for increased request limit
    }, //we need a user-agent to use the GitHub api.
    
  }

  var ghResult = {};

  ziggy.on("message", function (user, channel, text) {
    var bits = text.split(' '),
      command = bits.shift()

      if ((command !== '!gh') || (!bits.length)) {
        return;
      }
    var ghUser = bits[0];
    if (bits.length === 1) {
      lookupGitHub(ghUser, null, sayInfo) //pass the user and sayInfo (the function)
    }
    if (bits.length === 2) {
      var ghRepo = bits[1]
      lookupGitHub(ghUser, ghRepo, sayInfo)
    }

    function sayInfo(err, user, data) {
      if (err) {
        switch (err) {
        case "dataUser":
          return ziggy.say(channel, "No GitHub account for " + user);
          break;
        case "dataRepo" :
          return ziggy.say(channel, "Repo not found. ");
          break;
        default:
          return ziggy.say(channel, "Try again later...");
          break;
        }
      }
      console.log("following IS: " + data.following)
      if (data.following) { //must be dataUser
          ziggy.say(channel,
          "GitHub page at: " + data.html_url + " " +
          "Public Repos: " + data.public_repos + " and " + data.public_gists +
          " Gists. " +
          user + " has " + data.followers +
          " followers and is following " + data.following + " other users.")
      }
      else {
          ziggy.say(channel,
          "Repo at: " + data.html_url + " " + "Last update: " +
          data.updated_at + " repo has " + data.watchers + " star(s). " +
          "Clone with: " + data.ssh_url)      
        }
    } //end say user
  });

  function lookupGitHub(user, repo, callback) { //takes a user and (in this case) sayInfo as a 'callback'
    var searchuser = user.toLowerCase();
    ghOptions.path = "/users/" + searchuser;

    if (repo) {
      var searchrepo = repo.toLowerCase();
      ghOptions.path = "/repos/" + searchuser + "/" + searchrepo;
    }

    console.log("USER: " + user)
    console.log("REPO: " + repo)
    console.log("PATH: " + ghOptions.path)

    https.get(ghOptions, function (res) {
      var chunks = []; //this will hold the 'data chunks'

      res.setEncoding('utf8');

      res.on("data", function (chunk) {
        chunks.push(chunk); //incrementally add the chunk data
      });

      res.on("end", function () {
        ghResult = JSON.parse(chunks.join("")); //join and parse the data when the request is finished.
        console.log("Status code is: " + res.statusCode);
        if (res.statusCode === 200) {
            return callback(null, user, ghResult) //null is for no error, send ghResult as 'data'
        }


        if (!repo) {
          return callback("dataUser", user) //in this case, throw an error
        }
        return callback("dataRepo")
      });

      res.on('error', function (e) {
        console.error(e);
      });

    }); //end of https.get
  }
}