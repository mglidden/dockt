ts = {};

ts.init = function() {
  ts.setupGroupSort();
  ts.setupDocSort();
};

ts.setupGroupSort = function() {
  $('#classes-table').tablesorter();
};

ts.setupDocSort = function() {
  window.console.log('here');
  $('#docs-table').tablesorter();
};
