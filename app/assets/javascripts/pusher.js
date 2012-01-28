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
  toolbar.addTableRowHelper('classes', update.html[0]);
  window.console.log(update);
};
