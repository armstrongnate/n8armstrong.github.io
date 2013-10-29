var calendar = angular.module('calendar', []);

$(document).on('page:load', function() {
  angular.bootstrap(document.body, ['calendar']);
});

calendar.config([
  "$httpProvider", function($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
  }
]);

calendar.controller('NewRepairOrderCtrl', ['$scope', '$http', '$filter', '$timeout', function NewRepairOrderCtrl($scope, $http, $filter, $timeout) {
  $scope.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
  d = new Date();
  $scope.now = {
    day: d.getDay(),
    month: d.getMonth() + 1,
    year: d.getFullYear()
  }
}]);
