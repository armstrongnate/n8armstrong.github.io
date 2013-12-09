var flashcards = angular.module('flashcards', ['ngRoute', 'ngResource', 'ngTouch']);

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
  .when('/decks/:deckId/edit', {
    templateUrl: 'decks/index.html',
    controller: 'DecksCtrl as deckCtrl'
  })
  .when('/decks/study', {
    templateUrl: 'decks/study.html',
    controller: 'StudyCtrl as studyCtrl'
  })
  .when('/decks/:deckId/study', {
    templateUrl: 'decks/study.html',
    controller: 'StudyCtrl as studyCtrl'
  })
});

flashcards.factory('Deck', ['$resource', function($resource) {
  return $resource('http://flashcardsapi.192.168.0.2.xip.io/decks/:deckId', {deckId: '@id'}, {
    put: {method: 'PUT', params: { '_method': 'PUT'}}
  });
}])
.directive('usSpinner', ['$window', function ($window) {
  return {
    scope: true,
    link: function (scope, element, attr) {
      scope.spinner = null;

      function stopSpinner() {
        if (scope.spinner) {
          scope.spinner.stop();
          scope.spinner = null;
        }
      }

      scope.$watch(attr.usSpinner, function (options) {
        stopSpinner();
        scope.spinner = new $window.Spinner(options);
        scope.spinner.spin(element[0]);
      }, true);

      scope.$on('$destroy', function () {
        stopSpinner();
      });
    }
  };
}]);
