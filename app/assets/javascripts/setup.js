namespaces = {};

namespaces.init = function() {
  bc.init();
  slider.init();
  toolbar.init();
  search.init();
  p.init();
  alerts.init();
  cm.init();
  ts.init();

  namespaces.bc = bc;
  namespaces.slider = slider;
  namespaces.toolbar = toolbar;
  namespaces.search = search;
  namespaces.p = p;
  namespaces.alerts = alerts;
  namespaces.cm = cm;
  namespaces.ts = ts;

  $('#scroll-cap').scroll(function() {$('#doc-view').scrollTop(this.scrollTop)});
};

$(document).ready(namespaces.init);
