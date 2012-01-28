toolbar = {}
toolbar.animationTime = 100;
toolbar.fadeTime = 300;
toolbar.lastAction = '';
toolbar.lastId = null;

toolbar.hideAdd = function() {
  $('#add').fadeOut(toolbar.animationTime);
};

toolbar.showAdd = function() {
  $('#add').fadeIn(toolbar.animationTime);
};

toolbar.setupButtons = function(card) {
  toolbar.showAdd();
};

toolbar.addOverlay = function() {
  $('#overlay').css('display', 'block');
  $('#overlay').animate({opacity:0.5}, toolbar.fadeTime/3, null);
};

toolbar.addDocRowIfVisible = function(groupId, row) {
  if (slider.selectedGroup == groupId) {
    toolbar.addTableRowHelper('docs', row);
  }
};

toolbar.addCommentIfVisible = function(docId, row) {
  if (slider.selectedDocument == docId) {
    toolbar.addTableRowHelper('comments', row);
  }
};

toolbar.addTableRow = function(event, response) {
  var table;
  if (slider.currCenter == 0) {
    table = 'classes';
  } else if (slider.currCenter == 1) {
    table = 'docs';
  } else {
    table = 'comments';
  }
  toolbar.addTableRowHelper(table, response.responseText);
};
  
toolbar.addTableRowHelper = function(table, text) {
  if (text.length == 1) {
    text = text[0];
  }
  var element = $(text);
  element.css('display', 'none');
  if (table == 'classes') {
    element.insertAfter($('#classes-table :first :first'));
    slider.addTableClickRow(element, slider.requestDocuments);
  } else if (table == 'docs') {
    element.insertAfter($('#docs-table :first :first'));
    slider.addTableClickRow(element, slider.requestComments);
  } else if (table == 'comments') {
    element.insertAfter($('#comments-table :first :first'));
    slider.addTableClickRow(element, slider.moveDoc);
    cm.addMarker(element[0], true);
  }
  element.fadeToggle();
};

toolbar.removeTableRow = function(event, response) {
  toolbar.removeTableRowHelper(response.responseText);
}

toolbar.removeTableRowHelper = function(id) {
  $(id).fadeToggle();
}

toolbar.close = function() { 
  $('#overlay').animate({opactiy:0.0}, toolbar.fadeTime/3, function() {
    $('#overlay').css('display', 'none')});
  $('#formContainer').animate({opacity:0.0}, toolbar.fadeTime, function() {
    $('#formContainer').css('display', 'none');
  });
};

toolbar.open = function(data, pagenum, offset) {
  $('#newForm').remove();
  toolbar.addOverlay();
  $('#formContainer').css('display', 'block');
  $('#formContainer').html(data);
  $('#formContainer').animate({opacity:1.0}, toolbar.fadeTime, null);
  if (toolbar.lastAction == 'add') {
    $('#newForm').bind('ajax:complete', toolbar.addTableRow);
    if (slider.currCenter == 2) {
      $('#comment-page').children(0).val(pagenum);
      $('#comment-offset').children(0).val(offset);
    }
  } else if (toolbar.lastAction == 'delete') {
    $('#deleteForm').bind('ajax:complete', toolbar.removeTableRow);
    $('#delete-id').children(0).val(parseInt(toolbar.lastId));
  } else if (toolbar.lastAction == 'members') {
    $('#members-id').children(0).val(parseInt(toolbar.lastId));
  }
  return false;
}

toolbar.init = function() {
  $('#doc-pages').bind('click', toolbar.add);
}

toolbar.add = function(event) {
  if (slider.currCenter == 0) {
    $.ajax({url: '/groups/new', success: toolbar.open});
  } else if (slider.currCenter == 1) {
    $.ajax({url: 'new', success: toolbar.open});
  } else {
    if (event) {
      var pagenum = event.target.id;
      var offset = event.offsetY;
    } else {
      var pagenum = 0;
      var offset = document.getElementById('doc-pages').scrollTop + 60;
    }
    $.ajax({url: 'new', success: function(data) {toolbar.open(data, pagenum, offset)}});
  }
  toolbar.lastAction = 'add';
};

toolbar.delete = function() {
  if (slider.currCenter == 0) {
    $.ajax({url: '/groups/delete', success:toolbar.open});
  } else if (slider.currCenter == 1) {
    $.ajax({url: 'delete', success:toolbar.open});
  }
  toolbar.lastId = window.event.target.parentElement.parentElement.children[0].innerText;
  toolbar.lastAction = 'delete';
  window.event.stopPropagation();
}

toolbar.members = function() {
  $.ajax({url: '/groups/members', success: toolbar.open});
  toolbar.lastId = window.event.target.parentElement.parentElement.children[0].innerText;
  toolbar.lastAction = 'members';
  window.event.stopPropagation();
}
