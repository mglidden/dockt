cm = {};
cm.selectedId = null;
cm.selectedComment = null;

cm.init = function (){};

cm.addMarker = function(comment, animate) {
  var yPos = util.getCommentPos(comment);
  var id = comment.id + '-marker';
  var a = $('<div></div>');
  a.attr('class', 'comment-marker');
  a.css('top', (yPos-25) + 'px');
  a.attr('id', id);
  a.bind('click', function(event) { cm.markerSelected(event, id, comment.id)});
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

cm.markerSelected = function(event, id, commentId) {
  if (cm.selectedId) {
    $('#'+cm.selectedId).removeClass('comment-marker-selected');
    $('#'+cm.selectedComment + ' li').removeClass('comment-selected');
  }
  $('#'+id).addClass('comment-marker-selected');
  cm.selectedId = id;

  $('#'+commentId + ' li').addClass('comment-selected');
  cm.selectedComment = commentId;

  if (event) {
    event.originalEvent.stopPropagation();
  }
};
