toolbar = {}
toolbar.animationTime = 100;

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
