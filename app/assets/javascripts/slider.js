var slider = {};
slider.selectedGroup;
slider.selectedDocument;
slider.selectedComment;
slider.currCenter = 0;
slider.firstPop = true;

slider.CARD_WIDTH = 800;
slider.ID = {};
slider.ID.SLIDER = 'slider';

slider.addTableHover = function(table_name) {
  $.each($(table_name+' tr'), function(index, row) {
    if (index != 0) {
      $(row).hover(function() {
        $(row).addClass('hovered');
      }, function() {
        $(row).removeClass('hovered');
      });
    }
  });
};

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

slider.populateTableFunction = function (table_name, getCols, request_fn) {
  return function(data) {
    slider.clearTable(table_name);
    items = [];

    $.each(data, function(index, item) {
      var cols = getCols(item);
      $(table_name).append('<tr><td class=idCol>' + 
          getCols(item).join('</td><td>').replace('<td>', '<td class=leftCol>') +
          '</td></tr>');
    });
    slider.addTableHover(table_name);
    slider.addTableClick(table_name, request_fn)
  }
};

slider.requestGroups = function() {
  $.getJSON('/groups.json', slider.populateTableFunction('#classes-table', 
      function(item) { return [item['id'], item['name'], item['updated_at']]; },
      slider.requestDocuments));
};

slider.requestDocuments = function(groupId) {
  var response_fn = slider.populateTableFunction('#docs-table', function(item) {
    return [item['id'], item['title'], item['url']]; }, slider.requestComments);
  $.getJSON('/groups/'+groupId+'/documents.json', response_fn);
  slider.selectedGroup = groupId;
  slider.currCenter = 1;
  slider.centerOn(slider.currCenter, true)
  window.history.pushState({center:slider.currCenter}, '', groupId + '/documents/');
};

slider.requestComments = function(docId) {
  var response_fn = slider.populateTableFunction('#comments-table', function(item) {
    return [item['id'], item['commenter'], item['body']]; },
        function(commentId) { slider.selectedComment = commentId; });
  $.getJSON('/groups/'+slider.selectedGroup+'/documents/'+docId+'/comments.json',
      response_fn);
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
  slider.addTableHover('#classes-table');
  slider.addTableClick('#classes-table', slider.requestDocuments)
  if (window.location.pathname.indexOf('comments') != -1) {
    slider.addTableHover('#comments-table');
    slider.addTableClick('#comments-table', null);
    slider.addTableHover('#docs-table');
    slider.addTableClick('#docs-table', slider.requestComments)
    slider.centerOn(2, false);
    slider.selectedGroup = util.getGroupNum();
  } else if (window.location.pathname.indexOf('documents') != -1) {
    slider.addTableHover('#docs-table');
    slider.addTableClick('#docs-table', slider.requestComments)
    slider.centerOn(1, false);
    slider.selectedGroup = util.getGroupNum();
  }
  window.onpopstate = slider.popstate;
};
