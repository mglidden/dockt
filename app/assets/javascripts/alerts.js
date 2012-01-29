alerts = {};

alerts.init = function() {};

alerts.showWarning = function(message) {
  var al = alerts.createNew(message);
  al.css('display', 'none')
  $('#content').prepend(al);
  al.slideToggle('fast')
};

alerts.createNew = function(message) {
  var al = $('<div></div>');
  al.html(message);
  al.attr('class', 'error-box');
  var closeButton = $('<img></img>');
  closeButton.attr('src', '/assets/close.png');
  closeButton.attr('class', 'closeButton error-close');
  closeButton.attr('onclick', 'alerts.close()');
  al.append(closeButton);
  return al;
};


alerts.close = function() {
  $(window.event.target.parentElement).slideToggle('fast');
};
