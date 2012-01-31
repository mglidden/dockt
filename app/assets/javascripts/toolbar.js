toolbar = {}
toolbar.animationTime = 100;
toolbar.fadeTime = 300;
toolbar.lastAction = '';
toolbar.lastId = null;
toolbar.commentMessag = null;

toolbar.hideAdd = function() {
  $('#add').css('display', 'none');
};

toolbar.showAdd = function() {
  $('#add').css('display', 'inline');
};

toolbar.setupButtons = function(card) {
  var title = '';
  if (util.urlHasComments()) {
    title = 'Create a new comment';
    toolbar.showAdd();
  } else if (util.urlHasDocuments()) {
    title = 'Create a new document';
    toolbar.showAdd();
  } else if (util.urlHasGroups()) {
    title = 'Create a new group';
    toolbar.showAdd();
  } else {
    toolbar.hideAdd();
  }
  $('#add').attr('title', title);
};

toolbar.addOverlay = function() {
  $('#overlay').css('display', 'block');
  $('#overlay').animate({opacity:0.5}, toolbar.fadeTime/3, null);
};

toolbar.addDocRowIfVisible = function(groupId, row) {
  if (slider.selectedGroup == groupId) {
    toolbar.addTableRowHelper('docs', row);
    ts.setupDocSort();
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
  var sortingFunction = null;
  element.css('display', 'none');
  if (table == 'classes') {
    element.insertAfter($('#classes-table :first :first'));
    slider.addTableClickRow(element, slider.requestDocuments);
    sortingFunction = ts.setupGroupSort;
  } else if (table == 'docs') {
    element.insertAfter($('#docs-table :first :first'));
    slider.addTableClickRow(element, slider.requestComments);
    sortingFunction = ts.setupDocSort;
  } else if (table == 'comments') {
    element.insertAfter($('#comments-table :first :first'));
    slider.addTableClickRow(element, function(id) {slider.moveDoc(id, true)});
    cm.addMarker(element[0], true);
  }
  element.fadeToggle(sortingFunction);
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
      if (toolbar.commentMessage != null) {
        $('#comment-message').text(toolbar.commentMessage);
      }
    }
  } else if (toolbar.lastAction == 'delete') {
    $('#deleteForm').bind('ajax:complete', toolbar.removeTableRow);
    $('#delete-id').children(0).val(parseInt(toolbar.lastId));
  } else if (toolbar.lastAction == 'members') {
    $('#members-id').children(0).val(parseInt(toolbar.lastId));
    $('#members-login').autocomplete({
      source: '/users/index',
    });
  } else if (toolbar.lastAction == 'login') {
    $('#loginForm').bind('ajax:complete', toolbar.loginResp);
  } else if (toolbar.lastAction == 'signup') {
    $('#signupForm').bind('ajax:complete', toolbar.signupResp);
  }
  return false;
}

toolbar.init = function() {
  toolbar.setupButtons();
  $('#doc-pages').bind('click', toolbar.add);
}

toolbar.add = function(event) {
  if (slider.currCenter == 0) {
    $.ajax({url: '/groups/new', success: toolbar.open});
  } else if (slider.currCenter == 1) {
    $.ajax({url: 'new', success: toolbar.open});
  } else {
    window.console.log('here');
    pagenum = 0;
    if (event) {
      var offset = document.getElementById(event.target.id).offsetTop + event.offsetY;
      toolbar.commentMessage = null;
    } else {
      var offset = document.getElementById('doc-pages').scrollTop + 60;
      toolbar.commentMessage = 'You can also insert a comment by directly clicking on the document.';
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

toolbar.members = function(id) {
  $.ajax({url: '/groups/members/'+id, success: toolbar.open});
  toolbar.lastId = window.event.target.parentElement.parentElement.children[0].innerText;
  toolbar.lastAction = 'members';
  window.event.stopPropagation();
}

toolbar.login = function() {
  $.ajax({url: '/login', success:toolbar.open});
  toolbar.lastAction = 'login';
  window.event.stopPropagation();
};

toolbar.loginResp = function(event, resp) {
  if (resp.responseText == 'failed') {
    alerts.showWarning('Your username or password was incorrect. Please try again.');
  } else {
    $('#content').fadeToggle('fast', function() { $('#content').html(resp.responseText); namespaces.init(); $('#content').fadeToggle('fast')});
    toolbar.rerenderUserBar();
    window.history.replaceState({center:0}, '', '/groups/');
  }
}

toolbar.rerenderUserBar = function() {
  $.ajax({url: '/user_bar', success: function(data) {
    $('#user-info').html(data);}});
}

toolbar.signup = function() {
  $.ajax({url: '/signup', success: toolbar.open});
  toolbar.lastAction = 'signup';
  window.event.stopPropagation();
}

toolbar.signupResp = function(event, resp) {
  alerts.showWarning(resp.responseText);
}

toolbar.logout = function() {
  $.ajax({url: '/logout', success: toolbar.logoutResp});
};

toolbar.logoutResp = function(resp) {
  $('#content').fadeToggle('fast', function() {
    $('#content').html(resp);
    $('#content').fadeToggle('fast')
    window.history.replaceState({}, '', '/');
    toolbar.rerenderUserBar();
    namespaces.init();
    $(document.getElementById('breadcrumbs').children[0]).html('');
  });
};
