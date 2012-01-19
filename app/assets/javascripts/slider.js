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
    if (index != 0) {
      $(row).click(function() {
        if (request_fn) {
          request_fn($(this).children()[0].innerText);
        }
      });
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
};

slider.requestDocuments = function(groupId) {
  $.ajax({url: '/groups/'+groupId,
          success: function(data) { 
            $('#documents').html(data);
            slider.setupDocsTable();}});
  slider.selectedGroup = groupId;
  slider.currCenter = 1;
  slider.centerOn(slider.currCenter, true)
  window.history.pushState({center:slider.currCenter}, '', groupId + '/documents/');
};

slider.setupCommentsTable = function() {
  slider.addTableClick('#docs-table', null);
};

slider.requestComments = function(docId) {
  $.ajax({url: '/groups/'+slider.selectedGroup+'/documents/'+docId+'/',
          success: function(data) { 
            $('#comments').html(data);
            slider.setupCommentsTable();}});

  slider.selectedDocument = docId;
  slider.currCenter = 2;
  slider.centerOn(slider.currCenter, true)
  window.history.pushState({center:slider.currCenter}, '', docId + '/comments/');
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
  if (event['state'] && event['state']['center']) {
    slider.centerOn(event['state']['center'], true);
  } else {
    slider.centerOn(0, true);
  }
};

slider.init = function() {
  slider.addTableClick('#classes-table', slider.requestDocuments)
  if (window.location.pathname.indexOf('comments') != -1) {
    slider.setupCommentsTable();
    slider.setupDocsTable();
    slider.centerOn(2, false);
    slider.selectedGroup = util.getGroupNum();
  } else if (window.location.pathname.indexOf('documents') != -1) {
    slider.setupDocsTable();
    slider.centerOn(1, false);
    slider.selectedGroup = util.getGroupNum();
  }
  window.onpopstate = slider.popstate;
};
