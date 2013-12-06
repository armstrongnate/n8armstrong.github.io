flashcards.controller('DecksCtrl', ['$scope', '$http', '$filter', '$timeout', '$routeParams', '$location', 'Deck', function DecksCtrl($scope, $http, $filter, $timeout, $routeParams, $location, Deck) {

  // var newDeck = new Deck({name: 'New Deck'});
  // newDeck.$save();
  // console.log(newDeck);

  $scope.currentDeck = {}

  this.resetDecks = function() {
    Deck.query(function(decks) {
      $scope.decks = decks;
    });
    $scope.currentDeck.deck = new Deck({
      name: 'New Deck',
      cards: []
    })
    addBlankCardsToDeck();
  }
  this.resetDecks();

  this.selectDeck = function(deck) {
    $scope.currentDeck.deck = angular.copy(deck);
    console.log(deck);
    addBlankCardsToDeck();
  }

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
  if ($routeParams.deckId === 'undefined') {
    if (window.studyDeck) {
      $scope.deck = window.studyDeck;
    } else {
      // we didn't find a deck. redirect or so show a message or something
    }
  } else {
    $scope.deck = Deck.get({deckId: $routeParams.deckId});
    console.log($scope.deck);
  }
  $scope.currentCardIndex = 0;
  $scope.currentSide = 'front';

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
}]);
