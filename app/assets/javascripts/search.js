search = {};
search.ID = {};
search.ID.box = '#search';

search.init = function() {
  $(search.ID.box).bind('focus', search.removeText);
  $(search.ID.box).bind('blur', search.addText);
};

search.removeText = function() {
  util.removeText(search.ID.box, 'Search');
};

search.addText = function() {
  util.addText(search.ID.box, 'Search');
}
