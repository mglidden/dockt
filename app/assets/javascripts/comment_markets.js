cm = {};

cm.init = function (){};

cm.addMarker = function(comment, animate) {
  var yPos = util.getCommentPos(comment);
  var a = $('<div></div>');
  a.attr('class', 'comment-marker');
  a.css('top', (yPos-25) + 'px');
  if (animate) {
    a.css('display', 'none');
  }
  $('#doc-pages').append(a);
  if (animate) {
    $(a).fadeToggle();
  }
};

cm.addMarkers = function() {
  $.each($('#comments-table tr'), function(index, row) { if (index != 0) {cm.addMarker(row) }});
};
