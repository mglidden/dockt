var slider = {};
slider.selectedGroup;
slider.selectedDocument;
slider.selectedComment;
slider.currCenter = 0;
slider.firstPop = true;

slider.CARD_WIDTH = 800;
slider.ID = {};
slider.ID.SLIDER = 'slider';

slider.addTableClick = function(table_name, request_fn) {
  $.each($(table_name+' tr'), function(index, row) {
    if (index != 0 || table_name == '#comments-table') {
      slider.addTableClickRow(row, request_fn);
    }
  });
};

slider.addTableClickRow = function(row, request_fn) {
  $(row).click(function() {
    if (request_fn) {
      request_fn($(this).children()[0].innerText);
    }
  });
}

slider.clearTable = function(table_name) {
  $.each($(table_name + ' tr'), function(index, row) {
    if (index != 0) {
      $(row).remove();
    }
  });
};

slider.setupDocsTable = function() {
  slider.addTableClick('#docs-table', slider.requestComments);
};

slider.requestDocuments = function(groupId) {
  $.ajax({url: '/groups/'+groupId,
          success: function(data) { 
            $('#documents').html(data);
            slider.setupDocsTable();}});
  slider.selectedGroup = groupId;
  slider.currCenter = 1;
  window.history.pushState({center:slider.currCenter}, '', '/groups/' + groupId + '/documents/');
  slider.centerOn(slider.currCenter, true)
};

slider.setupCommentsTable = function() {
  //setTimeout('slider.addTableClick(\'#comments-table\', slider.moveDoc)', 3000);
  slider.addTableClick('#comments-table', slider.moveDoc);
};

slider.moveDoc = function(commentId) {
  var comment = document.getElementById('comment'+commentId);
  var pagenum = comment.children[2].innerText;
  var offset = comment.children[3].innerText;
  document.getElementById('doc-pages').scrollTop = document.getElementById(pagenum).offsetTop+parseInt(offset);
  window.history.replaceState({center:slider.currCenter}, '', commentId);
}

slider.requestComments = function(docId) {
  $.ajax({url: '/groups/'+slider.selectedGroup+'/documents/'+docId+'/',
          success: function(data) { 
            $('#comments').html(data);
            slider.setupCommentsTable();}});

  slider.selectedDocument = docId;
  slider.currCenter = 2;
  window.history.pushState({center:slider.currCenter}, '', docId + '/comments/');
  slider.centerOn(slider.currCenter, true)
};

slider.moveSlider = function(pixels) {
  $('#slider').css('left', parseInt($('#slider').css('left')) + pixels + 'px');
};

slider.animateSliderDist = function(pixels) {
  $('#slider').animate({left:'+='+pixels}, 'fast', null);
};

slider.animateSliderTo = function(pixels) {
  slider.animateSliderDist(-parseInt($('#slider').css('left')) - pixels);
};

slider.centerOn = function(card, animate) {
  if (animate) {
    slider.animateSliderTo(slider.CARD_WIDTH*card);
  } else {
    slider.moveSlider(-slider.CARD_WIDTH*card);
  }
  slider.currCenter = card;
  bc.changeCard(card);
  toolbar.setupButtons(card);
};

slider.popstate = function(event) {
  // on popstate is fired on first page load, so we only respond if we have
  // already pushed something onto the history stack
  if (slider.firstPop) {
    slider.firstPop = false;
    return;
  }
  slider.centerOn(util.activeCard(), true);
};

slider.setupGroupsTable = function() {
  slider.addTableClick('#classes-table', slider.requestDocuments)
}

slider.init = function() {
  slider.setupGroupsTable();
  if (window.location.pathname.indexOf('comments') != -1) {
    slider.setupCommentsTable();
    slider.setupDocsTable();
    slider.centerOn(2, false);
    slider.selectedGroup = util.getGroupNum();
    if (util.getCommentNum() != null) {
      setTimeout('slider.moveDoc('+util.getCommentNum()+')', 300);
    }
  } else if (window.location.pathname.indexOf('documents') != -1) {
    slider.setupDocsTable();
    slider.centerOn(1, false);
    slider.selectedGroup = util.getGroupNum();
  }
  window.onpopstate = slider.popstate;
};
