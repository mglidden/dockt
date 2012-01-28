p = {}
p.userId = null;

p.init = function() {
  if (document.getElementById('user-login')) {
    p.pusher = new Pusher('ab37b6148d60ea118769');
    p.userId = $('#user-login').text();
    p.channel = p.pusher.subscribe('private-updates-'+p.userId);
    p.channel.bind('private-updates-'+p.userId, p.gotMessage);
  }
};

p.gotMessage = function(update) {
  window.console.log(update)
  namespaces[update.namespace][update.method](update.parm1, update.parm2);
};
