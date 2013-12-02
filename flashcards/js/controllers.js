flashcards.controller('DecksCtrl', ['$scope', '$http', '$filter', '$timeout', '$routeParams', function DecksCtrl($scope, $http, $filter, $timeout, $routeParams) {
  $scope.currentDeck = {}
  $scope.decks = [
    {
      title: 'IT Acronyms',
      cards: [
        {front: 'OSI', back: 'Open Systems Interconnection'},
        {front: 'STP', back: 'Shielded Twisted Pair'}
      ]
    }
  ]

  this.resetDeck = function() {
    $scope.currentDeck.deck = {
      title: 'New Deck',
      cards: []
    }
    addBlankCardsToDeck();
  }
  this.resetDeck();

  this.selectDeck = function(deck) {
    $scope.currentDeck.deck = angular.copy(deck);
    addBlankCardsToDeck();
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

}]);

flashcards.controller('WelcomeCtrl', ['$scope', '$http', '$filter', '$timeout', function WelcomeCtrl($scope, $http, $filter, $timeout) {
}]);
