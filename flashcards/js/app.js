var flashcards = angular.module('flashcards', ['ngRoute']);

flashcards.config([
  "$httpProvider", function($httpProvider) {
    // $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
  }
])
.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'welcome.html',
  })
  .when('/decks', {
    templateUrl: 'decks/index.html',
    controller: 'DecksCtrl as deckCtrl'
  })
  .when('/decks/:deckId', {
    templateUrl: 'decks/index.html',
    controller: 'DecksCtrl as deckCtrl'
  });
});
