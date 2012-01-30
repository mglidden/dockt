slider = {};
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
};

slider.clearTable = function(table_name) {
  $.each($(table_name + ' tr'), function(index, row) {
    if (index != 0) {
      $(row).remove();
    }
  });
};

slider.setupDocsTable = function() {
  slider.addTableClick('#docs-table', slider.requestComments);
  ts.setupDocSort();
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
  slider.addTableClick('#comments-table', function(id) {slider.moveDoc(id, true);});
  cm.addMarkers();
};

slider.moveDoc = function(commentId, animate) {
  var comment = document.getElementById('comment'+commentId);
  if (animate) {
    window.console.log('here');
    $('#doc-pages').animate({scrollTop:util.getCommentPos(comment)-350}, 'fast');
  } else {
    document.getElementById('doc-pages').scrollTop = util.getCommentPos(comment)-350;
  }
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
  $('#slider').animate({left:'+='+pixels}, 'fast', slider.hideOtherCards);
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

slider.hideOtherCards = function() {
  if (slider.currCenter < 2) {
    // hide document
    $('#doc-pages').html('');
    $('#comments-bar').html('');
  }
  if (slider.currCenter < 1) {
    // hide document table
    $('#docs-table').html($('#docs-table :first').html())
  }
};

slider.popstate = function(event) {
  // on popstate is fired on first page load, so we only respond if we have
  // already pushed something onto the history stack
  if (slider.firstPop) {
    slider.firstPop = false;
    return;
  }
  var activeCard = util.activeCard();
  if (activeCard < slider.currCenter || activeCard == 0) {
    slider.centerOn(activeCard, true);
  } else {
    setTimeout(function() {
      if (activeCard == 1) {
        $.ajax({url: '/groups/'+util.getGroupNum(),
                success: function(data) { 
                $('#documents').html(data);
                slider.setupDocsTable();}});
        slider.selectedGroup = util.getGroupNum();
      } else if (activeCard == 2) {
        $.ajax({url: '/groups/'+slider.selectedGroup+'/documents/'+util.getDocNum()+'/',
                success: function(data) {
                  $('#comments').html(data);
                  slider.setupCommentsTable();}});
        $.ajax({url: '/groups/'+util.getGroupNum(),
                success: function(data) { 
                $('#documents').html(data);
                slider.setupDocsTable();}});
        slider.selectedGroup = util.getGroupNum();
        slider.selectedDocument = util.getDocNum();
      }
      slider.centerOn(activeCard, true);
      slider.currCenter = activeCard;
    },0);
  }
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
    slider.selectedDocument = util.getDocNum();
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
