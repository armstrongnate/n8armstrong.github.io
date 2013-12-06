var flashcards = angular.module('flashcards', ['ngRoute', 'ngResource']);

flashcards.config(['$httpProvider','$locationProvider', function ($httpProvider, $locationProvider) {
 }])
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
  })
  .when('/decks/:deckId/study', {
    templateUrl: 'decks/study.html',
    controller: 'StudyCtrl as studyCtrl'
  })
});

flashcards.factory('Deck', ['$resource', function($resource) {
  return $resource('http://flashcardsapi.dev/decks/:deckId', {deckId: '@id'}, {
    put: {method: 'PUT', params: { '_method': 'PUT'}}
  });
}])
