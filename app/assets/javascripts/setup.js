$(document).ready(function() {
  bc.init();
  slider.init();
  toolbar.init();

  $('#scroll-cap').scroll(function() {$('#doc-view').scrollTop(this.scrollTop)});
});
