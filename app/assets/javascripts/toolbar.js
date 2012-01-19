toolbar = {}

toolbar.hideMembers = function() {
  $('#members').css('display', 'none')
};

toolbar.showMembers = function() {
  $('#members').css('display', 'inline')
};

toolbar.hideAdd = function() {
  $('#add').css('display', 'none')
};

toolbar.showAdd = function() {
  $('#add').css('display', 'inline')
};

toolbar.hideDelete = function() {
  $('#delete').css('display', 'none')
};

toolbar.showDelete = function() {
  $('#delete').css('display', 'inline')
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
