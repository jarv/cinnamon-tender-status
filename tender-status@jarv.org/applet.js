imports.searchPath.push(
    imports.ui.appletManager.appletMeta["tender-status@jarv.org"].path );

const Lang = imports.lang;
const Applet = imports.ui.applet;
const GLib = imports.gi.GLib;
const Gettext = imports.gettext.domain('cinnamon-applets');
const _ = Gettext.gettext;
const Mainloop = imports.mainloop;
const Settings = imports.tendercfg;
const TenderChk = imports.tenderchk;
const Util = imports.misc.util;

function MyApplet(orientation) {
    this._init(orientation);
}

MyApplet.prototype = {

  __proto__: Applet.TextApplet.prototype,

  _init: function(orientation) {

    Applet.TextApplet.prototype._init.call(this, orientation);
    this_ = this;
    try {

      this.set_applet_tooltip(_("Tender tickets"));
      this.set_applet_label("T:[loading]");
      this.stats = [];  // keep track of the count stats for each
                        // ticket type

      this.tenderchk_objs = [];

      for (var cnt=0; cnt<Settings.tenderchks.length; cnt++) {

        this.stats.push({
          'label': Settings.tenderchks[cnt].label,
          'count': 0
        });

        this.tenderchk_objs.push(new TenderChk.TenderChk({
          'label': Settings.tenderchks[cnt].label,
          'chk_url': Settings.tenderchks[cnt].url,
          'poll_interval': Settings.poll_interval,
          'api_key': Settings.api_key,
          'callbacks':{
              'onError': function(msg) {
                  this_.onError(msg);
              },
              'updateTenderStats': function(new_stat) {
                  this_.updateTenderStats(new_stat);
              }
          }
        }));
      }
    } catch (e) {
        global.logError(e);
    }
  },

  updateTenderStats: function(new_stat) {
    if (new_stat.notify && new_stat.label == Settings.notify_label) {
      let title = 'Tender Ticket [' + new_stat.author_name + '] : ' + new_stat.title + "\n";
      let msg = new_stat.html_href;
      title = title.replace(/"/g, "&quot;");
      msg = msg.replace(/"/g, "&quot;");
      let path = imports.ui.appletManager.appletMeta["tender-status@jarv.org"].path;
      let icon = path + '/tender.png';
      let cmd = "notify-send --urgency=low --expire-time=5000 --icon="   + icon + " \""+title+"\" \""+msg+"\"";
      Util.spawnCommandLine(cmd);

    }
    // update the status bar
    let status_line = [];
    for (var i=0; i<this.stats.length; i++) { 
      if (this.stats[i].label == new_stat.label) {
        this.stats[i].count = new_stat.count;
      }
      status_line.push(this.stats[i].label + ':' + this.stats[i].count);
    }
    this.set_applet_label(status_line.join('/'));

  },

  onError: function(msg) {
    // placeholder for reporting an error
  },

  on_applet_clicked: function(event) {
    Util.spawnCommandLine("xdg-open " + Settings.click_url);
  }
};

function main(metadata, orientation) {
    var myApplet = new MyApplet(orientation);
    return myApplet;
}
