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
    bc.removeBCs(newCard);
  }
};

bc.removeBCs = function(newHighest) {
  var toAnimate = $('#'+bc.ID['BC'+(1+newHighest)]);
  toAnimate.animate({marginLeft:'+=800'}, 'fast', function() {
    for (var i = bc.card; i > newHighest; i--) {
      bc.getBar().removeChild(document.getElementById(bc.ID['BC'+i]))
    }
    bc.card = newHighest;
  });
};


bc.createBC = function(id, text) {
  el = document.createElement('a');
  el.innerText = text;
  el.id = id;
  el.className = bc.CLASS.CRUMB;
  el.onclick = bc.clicked;
  return el;
};

bc.clicked = function(event) {
  var target = parseInt(event.target.id.charAt(2));
  if (target != bc.card) {
    window.history.pushState({center:target}, '', bc.constructModifiedUrl(target));
    slider.centerOn(target, true);
    //bc.card = target;
  }
};

bc.constructModifiedUrl = function(card) {
  if (card == 2) {
    return window.location.pathname;
  } else if (card == 1) {
    return window.location.pathname.match(/\/groups\/.d*\/documents\//);
  } else {
    return '/groups/';
  }
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
