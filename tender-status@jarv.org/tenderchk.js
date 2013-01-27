const Soup = imports.gi.Soup;
const Json = imports.gi.Json;
const Mainloop = imports.mainloop;
const Lang = imports.lang;

function TenderChk(params) {
  this.callbacks=params.callbacks;
  this.label = params.label;
  this.poll_interval = params.poll_interval;
  this.updateTimer();
  this.timer_id = 0;
  this.api_key = params.api_key;
  this.chk_url = 'https://api.tenderapp.com/' + params.chk_url;
  this.count = 0;
  this.notify = false;
  this.httpSession = new Soup.SessionAsync();
}


TenderChk.prototype.updateTimer = function() {
  if (this.timer_id) {
    Mainloop.source_remove(this.timer_id);
    this.timer_id = 0;
  }
  if ( this.poll_interval > 0 ) {
    this.timer_id = Mainloop.timeout_add(
        this.poll_interval, Lang.bind(this, this.chkTimer));
  }
};


TenderChk.prototype.chkTimer = function() {
  var this_ = this;

  let message = Soup.Message.new('GET', this.chk_url);
  message.request_headers.append('Accept','application/vnd.tender-v1+json');
  message.request_headers.append('X-Tender-Auth', this.api_key);
  this.httpSession.queue_message(message,
      function(session, message) {
        this_.onResponse(session, message);
      }
  );

  this.updateTimer();
};


TenderChk.prototype.onResponse = function(session, message) {
  if (message.status_code!=200) {
    return;
  }

  try {
    let data=message.response_body.data;
    let jp = new Json.Parser();
    jp.load_from_data(message.response_body.data, -1);
    let count = jp.get_root().get_object().get_int_member('total');
    let latest_discussion = jp.get_root().get_object().get_array_member('discussions').get_object_element(0);
    let html_href = latest_discussion.get_string_member('html_href');
    let author_name = latest_discussion.get_string_member('author_name');
    let title = latest_discussion.get_string_member('title');

    if (count > this.count) {
      // new desktop notification
      this.notify = true;
    } else {
      this.notify = false;
    }

    if (count != this.count) {
      this.count = count;
      this.callbacks.updateTenderStats({
        'count': this.count,
        'label': this.label,
        'html_href': html_href,
        'author_name': author_name,
        'title': title,
        'notify': this.notify
      }); 
    }
  } catch(e) {
    // error callback
  }

};

