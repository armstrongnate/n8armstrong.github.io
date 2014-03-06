flashcards.controller('DecksCtrl', ['$scope', '$http', '$filter', '$timeout', '$routeParams', '$location', 'Deck', function DecksCtrl($scope, $http, $filter, $timeout, $routeParams, $location, Deck) {
  var _this = this;

  var access_token = 'AIzaSyD-La4vdDIC6bjt9KY5hHGuxQ1uMgGaSnA';
  $scope.currentDeck = {}
  $scope.decksSpinner = {}

  $scope.resetDecks = function() {
    _this.resetDecks();
  }

  this.resetDecks = function() {
    $scope.decksSpinner.spinning = true;
    Deck.query(function(decks) {
      $scope.decks = decks;
      $scope.decksSpinner.spinning = false;
    });
    if ($routeParams.deckId) {
      $scope.currentDeck.deck = Deck.get({deckId: $routeParams.deckId}, function(r) {
        addBlankCardsToDeck();
      });
    } else {
      $scope.currentDeck.deck = new Deck({
        name: 'New Deck',
        cards: []
      });
      addBlankCardsToDeck();
    }
  }
  this.resetDecks();

  this.studyDeck = function(deck) {
    deck.cards = removeBlankCardsFromDeck(deck);
    window.studyDeck = deck;
    $location.path('/decks/' + 'undefined' + '/study')
  }

  this.saveDeck = function() {
    var _this = this;
    var deck = $scope.currentDeck.deck;
    deck.cards_attributes = removeBlankCardsFromDeck(deck);
    if (deck.id) {
      deck.$put(function() {
        _this.resetDecks();
      });
    } else {
      deck.$save(function() {
        _this.resetDecks();
      });
    }
  }

  this.destroyCardAtIndex = function(index) {
    var deck, card;
    var _this = this;
    deck = $scope.currentDeck.deck;
    deck.cards_attributes = removeBlankCardsFromDeck(deck);
    card = deck.cards_attributes[index];
    card['_destroy'] = '1';
    deck.cards_attributes[index] = card;
    deck.$put(function() {
      _this.resetDecks();
    });
  }

  this.destroy = function() {
    var _this = this;
    $scope.currentDeck.deck.$delete(function() {
      $location.path('/decks/')
    });
  }

  // private

  function blankCard() {
    return {};
  }

  function addBlankCardsToDeck() {
    for (var i=0; i<5; i++) {
      $scope.currentDeck.deck.cards.push(blankCard());
    }
  }

  function removeBlankCardsFromDeck(deck) {
    var cards = deck.cards;
    var newCards = [];
    for (var i=0; i<cards.length; i++) {
      if (cards[i].front && cards[i].back && cards[i].front.length > 0 && cards[i].back.length > 0) {
        newCards.push(cards[i])
      }
    }
    return newCards;
  }

}]);

flashcards.controller('WelcomeCtrl', ['$scope', '$http', '$filter', '$timeout', function WelcomeCtrl($scope, $http, $filter, $timeout) {
}]);

flashcards.controller('StudyCtrl', ['$scope', '$http', '$filter', '$timeout', '$routeParams', 'Deck', function StudyCtrl($scope, $http, $filter, $timeout, $routeParams, Deck) {
  if ($routeParams.deckId) {
    $scope.deck = Deck.get({deckId: $routeParams.deckId});
  }
  $scope.currentCardIndex = 0;
  $scope.currentSide = 'front';
  $scope.decksSpinner = {spinning: true};
  Deck.query(function(decks) {
    $scope.decks = decks;
    $scope.decksSpinner.spinning = false;
  });

  this.flipCard = function() {
    $scope.currentSide = $scope.currentSide == 'front' ? 'back' : 'front';
  }

  this.nextCard = function() {
    if ($scope.currentCardIndex >= $scope.deck.cards.length - 1) {
      $scope.currentCardIndex = 0;
    } else {
      $scope.currentCardIndex += 1;
    }
    $scope.currentSide = 'front';
  }

  this.prevCard = function() {
    if ($scope.currentCardIndex <= 0) {
      $scope.currentCardIndex = $scope.deck.cards.length - 1;
    } else {
      $scope.currentCardIndex -= 1;
    }
    $scope.currentSide = 'front';
  }

  var _this = this;
  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 38: // up arrow
        _this.flipCard();
        break;
      case 39: // right arrow
        _this.nextCard();
        break;
      case 37: // left arrow
        _this.prevCard();
        break;
    }
    $scope.$apply();
  }
}]);
