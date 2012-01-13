bc = {}
bc.card = 0;
bc.MOVE_DIST = 800;

bc.ID = {}
bc.ID.BC0 = 'bc0';
bc.ID.BC1 = 'bc1';
bc.ID.BC2 = 'bc2';

bc.CLASS = {};
bc.CLASS.CRUMB = 'breadcrumb';

bc.init = function() {
  bcBar = bc.getBar();
  if (util.urlHasGroups()) {
    bcBar.appendChild(bc.createBC(bc.ID.BC0, 'classes > '));
  }
  if (util.urlHasDocuments()) {
    bcBar.appendChild(bc.createBC(bc.ID.BC1, 'documents > '))
    bc.card = 1;
  }
  if (util.urlHasComments()) {
    bcBar.appendChild(bc.createBC(bc.ID.BC2, 'comments'));
    bc.card = 2;
  }
};

bc.changeCard = function(newCard) {
  window.console.log('called ' + newCard + ' ' + bc.card);
  if (newCard > bc.card) {
    var firstBC;
    for (var i = bc.card + 1; i <= newCard; i++) {
      var toAdd = bc.createBC(bc.ID['BC'+i], bc.determineName(i));
      if (i == bc.card + 1) {
        firstBC = toAdd;
        $(toAdd).css('margin-left', '800px');
      }
      bc.getBar().appendChild(toAdd);
    }
    $(firstBC).animate({marginLeft:'-=800'}, 'fast', null);
    bc.card = newCard;
  } else if (newCard < bc.card) {
    var toAnimate = $('#'+bc.ID['BC'+(1+newCard)]);
    toAnimate.animate({marginLeft:'+=800'}, 'fast', function() {
      for (var i = bc.card; i > newCard; i--) {
        bc.getBar().removeChild(document.getElementById(bc.ID['BC'+i]))
      }
      bc.card = newCard;
    });
  }
};

bc.createBC = function(id, text) {
  el = document.createElement('div');
  el.innerText = text;
  el.id = id;
  el.className = bc.CLASS.CRUMB;
  return el;
};

bc.getBar = function() {
  return document.getElementById('breadcrumbs').children[0];
};

bc.moveBCDist = function(id, pixels) {
  $('#'+id).css('margin-left', util.parseProperty(id, 'margin-left')+pixels+'px');
}

bc.determineName = function(cardNum) {
  if (cardNum == 0) {
    return 'groups > ';
  }
  if (cardNum == 1) {
    return 'documents > ';
  }
  if (cardNum == 2) {
    return 'comments';
  }
};
