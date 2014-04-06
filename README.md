ziggy-gh
=========

ziggy-gh is a [GitHub API] plugin for the [ziggy] IRC bot, written in node.js

Install
----
Add the plugin to your ziggy code.
```
var Ziggy = require('ziggy').Ziggy
, ziggyGh = require('ziggy-gh')
  , ziggy = new Ziggy({
        server: 'irc.freenode.net'
      , nickname: 'ziggy'
      , plugins: [{name: 'ziggy-gh', setup: ziggyGh}]
      , channels: ['#learnjavascript']
    })
ziggy.start();
```

Usage
----
When ziggy detects a !gh [username] command in the channel, a request is made to GitHub via the API and the public details for that user are returned.

example
```
!gh Ebsy
```
will return
```
GitHub page at: https://github.com/Ebsy Public Repos: 12 and 0 Gists. Ebsy has 4 followers and is following 4 other users.
```

More information available at the [GitHub API].

License
----

MIT

[ziggy]:https://github.com/jarofghosts/ziggy
[GitHub API]:https://developer.github.com/