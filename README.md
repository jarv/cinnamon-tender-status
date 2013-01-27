# A simple tender status gjs applet for the Cinnamon desktop

## Features


* Number of issues open
* Number of issues pending (issues that have not been responded to by support staff)
* Desktop notification for new issues

![Alt text](https://github.com/jarv/cinnamon-tender-status/blob/master/screenshot.png)

## Installation


* `git clone http://github.com/jarv/cinnamon-tender-status`
* `cp -r cinnamon-tender-status/tender-status@jarv.org  ~/.local/cinnamon/applets/.`
* ALT-F2 "r"
* Add the applet to the panel

## Configuration

* Edit tendercfg.js to add your API key and URLs

```
var tenderchks = [
  {
    'label': 'open',
    'url': 'edxedge/categories/70616/discussions/open'
  },
  {
    'label': 'pend',
    'url': 'edxedge/categories/70616/discussions/pending'
  }

];
var api_key= '***';
// 5 sec
var poll_interval = 10000;

// will only send a desktop notification for this
// label
var notify_label = 'open';

// click url
//

var click_url = 'http://help.edge.edx.org/dashboard';

```

