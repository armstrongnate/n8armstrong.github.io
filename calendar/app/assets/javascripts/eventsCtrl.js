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

  function showQuickViewWithEvent(event, $event) {
    var quickView = $scope.month.quickView;
    $scope.event = event;
    quickView.visible = true;
    quickView.location = {x: $event.pageX, y: $event.pageY};
    $event.stopPropagation();
  }

  function clickedDate(date) {
    return new Date($scope.month.year, $scope.month.monthNum, (date - $scope.selectedDate.monthStartsOn()) + 1);
  }

  $scope.events = [];
  $scope.selectedDate = new Date();
  $http.get('/events.json').success(function(r) {
    $scope.events = r;
  });

  $scope.weeks = makeWeeks();
  $scope.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  $scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  $scope.display = 'month';
  $scope.selectedDay = {};
  $scope.event = null;
  $scope.month = {
    monthNum: new Date().getMonth(),
    year: new Date().getFullYear(),
    selectedDay: null,
    quickView: {
      visible: false,
      location: {
        x: 0,
        y: 0
      },
      size: {
        width: 400,
        height: 170
      },
      editMode: true
    },
    clickDay: function(n, $event) {
      var event = {
        starts_at: $filter('date')(clickedDate(n), 'yyyy-MM-dd HH:mm:ss')
      }
      this.quickView.visible = true;
      showQuickViewWithEvent(event, $event);
      this.quickView.editMode = true;
      this.selectedDay = clickedDate(n);
    },
    clickEvent: function(event, $event) {
      $scope.month.quickView.editMode = false;
      showQuickViewWithEvent(event, $event);
    }
  }

  $scope.eventsForDay = function(day) {
    return $filter('onDay')($scope.events, ((day - $scope.selectedDate.monthStartsOn()) + 1), $scope.selectedDate);
  }

  $scope.nToDate = function(n) {
    return $filter('toDate')((n - $scope.selectedDate.monthStartsOn()) + 1, $scope.selectedDate);
  }

  function makeWeeks() {
    var weeks = $filter('range')([], $scope.selectedDate.daysCount() + $scope.selectedDate.monthStartsOn());
    return weeks = $filter('inGroupsOf')(weeks, 7);
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
    makeWeeks();
  }

  $scope.saveEvent = function(event) {
    console.log(event);
    return;
    params = {event: event, _method: 'PUT'};
    $http.post('/events.json', params).success(function(data) {
      console.log(data);
    });
  }

}])
.directive('quickView', function($timeout) {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.location, function (newValue) {
        if (newValue) {
          $timeout(function() {
            element.css('top', (newValue.y - element.outerHeight()) - 25);
            element.css('left', newValue.x - (element.outerWidth() / 2));
          })
        }
      }, true);
    }
  }
});
