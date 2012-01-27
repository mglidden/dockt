search = {};
search.ID = {};
search.ID.box = '#search';

search.init = function() {
  $(search.ID.box).bind('focus', search.removeText);
  $(search.ID.box).bind('blur', search.addText);
};

search.removeText = function() {
  if ($(search.ID.box).val() == 'Search') {
    $(search.ID.box).val('');
  }
};

search.addText = function() {
  if ($(search.ID.box).val() == '') {
    $(search.ID.box).val('Search');
  }
}
