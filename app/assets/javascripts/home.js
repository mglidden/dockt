var slider = {};
slider.selectedGroup;
slider.selectedDocument;
slider.selectedComment;

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
};

slider.requestComments = function(docId) {
  var response_fn = slider.populateTableFunction('#comments-table', function(item) {
    return [item['id'], item['commenter'], item['body']]; },
        function(commentId) { slider.selectedComment = commentId; });
  $.getJSON('/groups/'+slider.selectedGroup+'/documents/'+docId+'/comments.json',
      response_fn);
  slider.selectedDocument = docId;
};

$(document).ready(function() {
  slider.requestGroups();
});
