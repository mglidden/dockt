search = {};
search.ID = {};
search.ID.box = '#search';
search.terms = [];

search.init = function() {
  $(search.ID.box).bind('focus', search.removeText);
  $(search.ID.box).bind('blur', search.addText);
  $('#search').autocomplete({source:search.terms});
  $.getJSON('/terms.json',
            function(data) {
              search.terms = data;
              $('#search').autocomplete({
                source:search.terms,
                position: { my : "right bottom", at: "right top" },
                select: function(event, ui) {search.selected(ui.item.value)},
                autoFocus: true,
                open: function() {$(this).autocomplete('widget').css('z-index', 4);}
              });
            });
};

search.removeText = function() {
  util.removeText(search.ID.box, 'Search');
};

search.addText = function() {
  util.addText(search.ID.box, 'Search');
};

search.selected = function(val) {
  $.getJSON('/search/'+val, search.searchReturned);
};

search.searchReturned = function(data) {
  window.history.pushState({center:data['center']}, '', data['url']);
  $('#slider').fadeToggle();
  $('#slider').html(data['slider']);
  slider.centerOn(data['center'], true);
  slider.setupGroupsTable();
  if (data['center'] >= 1) {
    slider.setupDocsTable();
  }
  if (data['center'] >= 2) {
    slider.setupCommentsTable();
  }
  $('#slider').fadeToggle();
}
