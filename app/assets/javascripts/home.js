function addTableHover(table_name, request_fn) {
  $.each($(table_name+" tr"), function(index, row) {
    if (index != 0) {
      $(row).hover(function() {
        $(row).addClass("hovered");
      }, function() {
        $(row).removeClass("hovered");
      });
    }
  });
}

function addTableClick(table_name, request_fn) {
  $.each($(table_name+' tr'), function(index, row) {
    if (index != 0) {
      $(row).click(function() {
        if (request_fn) {
          request_fn($(this).children()[0].innerText);
        }
      });
    }
  });
}

function clearTable(table_name) {
  $.each($(table_name + " tr"), function(index, row) {
    if (index != 0) {
      $(row).remove();
    }
  });
}

function populateTableFunction(table_name, getCols, request_fn) {
  return function(data) {
    clearTable(table_name)
    items = [];

    $.each(data, function(index, item) {
      var cols = getCols(item);
      $(table_name).append('<tr><td>' + getCols(item).join('</td><td>') +
                             '</td></tr>');
    });
    addTableHover(table_name);
    addTableClick(table_name, request_fn)
  }
}

var selectedGroup;
function requestDocuments(groupId) {
  var response_fn = populateTableFunction('#docs-table', function(item) {
    return [item['id'], item['title'], item['url']]; }, requestComments);
  $.getJSON("/groups/"+groupId+"/documents.json", response_fn);
  // hack, find a better way to keep track of current groupid
  selectedGroup = groupId;
}

function requestComments(docId) {
  var response_fn = populateTableFunction('#comments-table', function(item) {
    return [item['id'], item['commenter'], item['body']]; }, null);
  $.getJSON('/groups/'+selectedGroup+'/documents/'+docId+'/comments.json',
      response_fn);
}

$(document).ready(function() {
  $.getJSON('/groups.json', populateTableFunction('#classes-table', function(item) {
    return [item['id'], item['name'], item['updated_at']];
  }, requestDocuments));
});
