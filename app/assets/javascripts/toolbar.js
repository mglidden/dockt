toolbar = {}
toolbar.animationTime = 100;
toolbar.fadeTime = 300;
toolbar.lastAction = '';
toolbar.lastId = null;

toolbar.hideMembers = function() {
  $('#members').fadeOut(toolbar.animationTime);
};

toolbar.showMembers = function() {
  $('#members').fadeIn(toolbar.animationTime);
};

toolbar.hideAdd = function() {
  $('#add').fadeOut(toolbar.animationTime);
};

toolbar.showAdd = function() {
  $('#add').fadeIn(toolbar.animationTime);
};

toolbar.hideDelete = function() {
  $('#delete').fadeOut(toolbar.animationTime);
};

toolbar.showDelete = function() {
  $('#delete').fadeIn(toolbar.animationTime);
};

toolbar.setupButtons = function(card) {
  if (card == 0) {
    toolbar.showMembers();
    toolbar.showAdd();
    toolbar.showDelete();
  } else if (card == 1) {
    toolbar.hideMembers();
    toolbar.showAdd();
    toolbar.showDelete();
  } else {
    toolbar.hideMembers();
    toolbar.hideAdd();
    toolbar.hideDelete();
  }
};

toolbar.addOverlay = function() {
  $('#overlay').css('display', 'block');
  $('#overlay').animate({opacity:0.5}, toolbar.fadeTime/3, null);
};

toolbar.addTableRow = function(event, response) {
  var element = $(response.responseText);
  element.css('display', 'none');
  if (slider.currCenter == 0) {
    element.insertAfter($('#classes-table :first :first'));
    slider.addTableClickRow(element, slider.requestDocuments);
  } else if (slider.currCenter == 1) {
    element.insertAfter($('#docs-table :first :first'));
    slider.addTableClickRow(element, slider.requestComments);
  } else {
    element.insertAfter($('#comments-table :first :first'));
    slider.addTableClickRow(element, slider.moveDoc);
  }
  element.fadeToggle();
};

toolbar.removeTableRow = function(event, response) {
  $(response.responseText).fadeToggle();
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
    $.ajax({url: 'new', success: function(data) {toolbar.open(data, event.target.id, event.offsetY)}});
  }
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
  toolbar.lastAction = 'add';
  window.event.stopPropagation();
}
