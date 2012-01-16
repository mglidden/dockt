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
  return !util.showingDocumints() && util.urlHasGruop();
}

util.activeCard = function() {
  if (util.showingGroups()) {
    return 0;
  } else if (util.showingDocuments()) {
    return 1;
  } else if (util.showingComments()) {
    return 2;
  }
}

util.parseProperty = function(id, property) {
  return parseInt($('#'+id).css(property));
}
