util = {};

util.urlHasGroups = function() {
  return window.location.pathname.indexOf('groups') != -1;
};

util.urlHasDocuments = function() {
  return window.location.pathname.indexOf('documents') != -1;
};

util.urlHasComments = function() {
  return window.location.pathname.indexOf('comments') != -1;
};

util.showingComments = function() {
  return util.urlHasComments();
}

util.showingDocuments = function() {
  return !util.showingComments() && util.urlHasDocuments();
}

util.showingGroups = function() {
  return !util.showingDocuments() && util.urlHasGroups();
}

util.activeCard = function() {
  if (util.showingComments()) {
    return 2;
  } else if (util.showingDocuments()) {
    return 1;
  } else if (util.showingGroups()) {
    return 0;
  }
}

util.parseProperty = function(id, property) {
  return parseInt($('#'+id).css(property));
}

util.getGroupNum = function() {
  return window.location.pathname.match(/\d+/)[0];
}

util.getDocNum = function() {
  return window.location.pathname.match(/\d+/g)[1];
}

util.getCommentNum = function() {
  var nums = window.location.pathname.match(/\d+/g);
  if (nums.length >= 3) {
    return nums[3];
  }
  return null;
}

util.getCommentPos = function(comment) {
  return document.getElementById(comment.children[2].innerText).offsetTop +
    parseInt(comment.children[3].innerText);
};

util.removeText = function(id, defaultText) {
  if ($(id).val() == defaultText) {
    $(id).val('');
    $(id).removeClass('text-grey');
  }
};

util.addText = function(id, defaultText) {
  if ($(id).val() == '') {
    $(id).val(defaultText);
    $(id).addClass('text-grey');
  }
};
