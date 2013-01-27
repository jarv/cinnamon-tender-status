// API URL for assigned tickets
// http://help.tenderapp.com/kb/api/discussions
// john@jarv.org
/*

new - Any discussion that has never been responded to by a support user, with no assigned tickets.
open - Any non-resolved discussion that has been responded to by a support user, with no assigned tickets.
assigned - Any non-resolved discussion with at least one assigned ticket.
resolved - Any resolved discussion.
pending - Any discussion where the last comment is made by a non-supporter. This is the same as the inbox queue in the dashboard.
deleted - Any deleted/spam discussions.


https://api.tenderapp.com:443/edxedge/categories/70616/discussions{-opt|/|state}{state}{-opt|?|page,user_email}{-join|&|page,user_email}
*/

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
