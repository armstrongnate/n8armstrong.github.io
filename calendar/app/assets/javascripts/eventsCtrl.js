var calendar = angular.module('calendar', []);

$(document).on('page:load', function() {
  angular.bootstrap(document.body, ['calendar']);
});

calendar.config([
  "$httpProvider", function($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
  }
]);

calendar.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
})
.filter('greaterThan', function() {
  return function(value, smallest) {
    return value > smallest ? value : '';
  }
})
.filter('onDay', function() {
  return function(events, day, selectedDate) {
    var matches = [];
    for (i=0; i<events.length; i++) {
      var d, start, end;
      d = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      start = new Date(events[i].starts_at);
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);
      end = new Date(events[i].ends_at);
      end.setHours(24);
      if (d >= start && d <= end) {
        matches.push(events[i]);
      }
    }
    return matches;
  }
})
.filter('toDate', function() {
  return function(index, selectedDate) {
    return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), index).getDate();
  }
})
.filter('inGroupsOf', function() {
  return function(list, n) {
    var grouped = [];
    var i = j = 0;
    for (i; i<Math.ceil(list.length / n); i++) {
      grouped.push(list.slice(j, j+n));
      j += n;
    }
    return grouped;
  }
});

calendar.controller('EventsCtrl', ['$scope', '$http', '$filter', '$timeout', function EventsCtrl($scope, $http, $filter, $timeout) {
  $scope.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  $scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  $scope.monthsAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  $scope.display = 'month';
  $scope.list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
  $scope.events = [];

  $http.get('/events.json').success(function(r) {
    $scope.events = r;
    $scope.selectedDate = new Date();
    console.log(r);
  });

  d = new Date();
  $scope.now = {
    day: d.getDay(),
    month: d.getMonth(),
    year: d.getFullYear()
  }

  $scope.daysInMonth = function(year, month) {
    return new Date(year, month+1, 0).getDate();
  }

  $scope.monthStartsOn = function(year, month) {
    return new Date(year, month, 1).getDay()
  }

  $scope.setMonth = function(newMonth) {
    if (newMonth > 11) {
      newMonth = 0;
      $scope.selectedDate.setFullYear($scope.selectedDate.getFullYear() + 1)
    }
    if (newMonth < 0) {
      newMonth = 11;
      $scope.selectedDate.setFullYear($scope.selectedDate.getFullYear() - 1)
    }
    $scope.selectedDate.setMonth(newMonth);
  }

}]);

calendar.directive('day', function() {
  return {
    restrict: 'A',
    link: function(element) {
      console.log('in here');
      angular.element(element).tooltip({container: 'body'});
    }
  }
})
