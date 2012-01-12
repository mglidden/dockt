var slider = {};
slider.selectedGroup;
slider.selectedDocument;
slider.selectedComment;
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
      $(table_name).append('<tr><td>' + getCols(item).join('</td><td>') +
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
  // hack, find a better way to keep track of current groupid
  slider.selectedGroup = groupId;
  slider.animateSlider(-800);
};

slider.requestComments = function(docId) {
  var response_fn = slider.populateTableFunction('#comments-table', function(item) {
    return [item['id'], item['commenter'], item['body']]; },
        function(commentId) { slider.selectedComment = commentId; });
  $.getJSON('/groups/'+slider.selectedGroup+'/documents/'+docId+'/comments.json',
      response_fn);
  slider.selectedDocument = docId;
  slider.animateSlider(-800);
};

$(document).ready(function() {
  slider.requestGroups();
  if (window.location.pathname.indexOf('comments') != -1) {
    slider.moveSlider(-slider.CARD_WIDTH*2);
  } else if (window.location.pathname.indexOf('documents') != -1) {
    slider.moveSlider(-slider.CARD_WIDTH);
  }
});

slider.moveSlider = function(pixels) {
  $('#slider').css('left', parseInt($('#slider').css('left')) + pixels + 'px');
};

slider.animateSlider = function(pixels) {
  $('#slider').animate({left:'+='+pixels}, 'fast', null);
};
