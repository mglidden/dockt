toolbar = {}
toolbar.animationTime = 100;
toolbar.fadeTime = 300;

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

toolbar.addOverlay = function() {
  $('#overlay').css('display', 'block');
  $('#overlay').animate({opacity:0.5}, toolbar.fadeTime/3, null);
};

toolbar.close = function() {
  $('#overlay').animate({opactiy:0.0}, toolbar.fadeTime/3, function() {
    $('#overlay').css('display', 'none')});
  $('#formContainer').animate({opacity:0.0}, toolbar.fadeTime, function() {
    $('#formContainer').css('display', 'none');
    $('#newForm').remove();
  });
};

toolbar.add = function() {
  if (slider.currCenter == 0) {
    $.ajax({url: '/groups/new', success: function(data) {
      toolbar.addOverlay();
      $('#formContainer').css('display', 'block');
      $('#formContainer').html(data);
      $('#formContainer').animate({opacity:1.0}, toolbar.fadeTime, null);
    }});
  }
};
