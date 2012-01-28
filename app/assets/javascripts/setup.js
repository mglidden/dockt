namespaces = {};

$(document).ready(function() {
  bc.init();
  slider.init();
  toolbar.init();
  search.init();
  p.init();

  namespaces.bc = bc;
  namespaces.slider = slider;
  namespaces.toolbar = toolbar;
  namespaces.search = search;
  namespaces.p = p;

  $('#scroll-cap').scroll(function() {$('#doc-view').scrollTop(this.scrollTop)});
});
