ts = {};

ts.init = function() {
  ts.setupGroupSort();
  ts.setupDocSort();
};

ts.setupGroupSort = function() {
  $('#classes-table').tablesorter();
};

ts.setupDocSort = function() {
  $('#docs-table').tablesorter();
};
