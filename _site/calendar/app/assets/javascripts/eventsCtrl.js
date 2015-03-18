var calendar = angular.module('calendar', []);

$(document).on('page:load', function() {
  angular.bootstrap(document.body, ['calendar']);
});

calendar.config([
  "$httpProvider", function($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
  }
]);

calendar.controller('EventsCtrl', ['$scope', '$http', '$filter', '$timeout', function EventsCtrl($scope, $http, $filter, $timeout) {

  function showQuickViewWithEvent(event, $event) {
    var quickView = $scope.month.quickView;
    $scope.event = event;
    quickView.visible = true;
    quickView.location = {x: $event.pageX, y: $event.pageY};
    $event.stopPropagation();
  }

  var days = $scope.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

  function clickedDate(date, month) {
    return new Date(month.year, month.monthNum, (date - month.startsOn()) + 1);
  }

  $scope.events = [];
  $scope.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  $scope.display = 'month';
  $scope.event = null;
  $scope.month = {
    monthNum: new Date().getMonth(),
    year: new Date().getFullYear(),
    days: [],
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
      editMode: true,
      moveUp: false,
      setEditMode: function(newValue) {
        this.moveUp = true;
        this.editMode = newValue;
      }
    },
    daysCount: function() {
      d = new Date();
      d.setFullYear(this.year);
      d.setMonth(this.monthNum);
      return d.daysCount();
    },
    startsOn: function() {
      d = new Date();
      d.setFullYear(this.year);
      d.setMonth(this.monthNum);
      return d.monthStartsOn();
    },
    firstDay: function() {
      d = new Date();
      d.setFullYear(this.year);
      d.setMonth(this.monthNum);
      return d;
    },
    clickDay: function(day, $event) {
      var ends_at = day.date;
      ends_at.setHours(12);
      var event = {
        starts_at: day.date,
        ends_at: ends_at,
        starts_at_date: $filter('date')(day.date, 'shortDate'),
        starts_at_time: $filter('date')(day.date, 'shortTime'),
        all_day: 'YES',
      }
      this.quickView.visible = true;
      showQuickViewWithEvent(event, $event);
      this.quickView.editMode = true;
      this.selectedDay = day;
    },
    clickEvent: function(event, day, $event) {
      this.quickView.editMode = false;
      showQuickViewWithEvent(event, $event);
      this.selectedDay = day;
    }
  }

  $scope.eventsForDay = function(n, month) {
    return $filter('onDay')($scope.events, n - month.startsOn() + 1, month.firstDay());
  }

  $scope.nToDate = function(n) {
    return $filter('toDate')((n - $scope.month.firstDay().monthStartsOn()) + 1, $scope.month.firstDay());
  }

  function setDays(month) {
    $scope.month.days = [];
    var totalDays = month.daysCount() + month.startsOn();
    totalDays = Math.ceil(totalDays/7.0) * 7;
    var i;
    for (i=0; i<totalDays; i++) {
      var day = {};
      day.date = clickedDate(i, month);
      day.dateNumber = $scope.nToDate(i);
      day.events = $scope.eventsForDay(i, month);
      $scope.month.days.push(day);
    }
  }

  $scope.setMonth = function(newMonth) {
    if (newMonth > 11) {
      newMonth = 0;
      $scope.month.year = $scope.month.year + 1
    }
    if (newMonth < 0) {
      newMonth = 11;
      $scope.month.year -= 1;
    }
    $scope.month.monthNum = newMonth;
    setDays($scope.month);
  }

  $scope.clickEditEvent = function(event) {
    $scope.event = event;
    $scope.month.quickView.visible = false;
    $scope.display = 'editEvent';
  }

  $scope.saveEvent = function(event) {
    console.log(event);
    event.starts_at = new Date(event.starts_at_date + ' ' + event.starts_at_time);
    if (event.ends_at_date && event.ends_at_time) {
      event.ends_at = new Date(event.ends_at_date + ' ' + event.ends_at_time);
    } else {
      ends_at = event.starts_at;
      ends_at.setHours(12);
      event.ends_at = ends_at;
    }
    var params, url;
    params = {event: event};
    if (event.id) { // update
      url = '/events/' + event.id + '.json';
      params['_method'] = 'put';
      method = 'put';
      $http.put(url, params).success(function(data) {
        $scope.month.quickView.visible = false;
      });
    } else { // create
      url = '/events.json';
      method = 'post';
      $http.post(url, params).success(function(data) {
        event = data;
        $scope.events.push(event);
        $scope.month.quickView.visible = false;
        setDays($scope.month);
      });
    }
    $scope.display = 'month';
  }

  $scope.deleteEvent = function(event) {
    $http.delete('/events/' + event.id + '.json').success(function(data) {
      $scope.events.splice($scope.events.indexOf(event), 1);
      $scope.month.selectedDay.events.splice($scope.month.selectedDay.events.indexOf(event), 1);
      $scope.month.quickView.visible = false;
      setDays($scope.month);
    });
  }

  $scope.goToToday = function() {
    $scope.month.monthNum = new Date().getMonth();
    $scope.month.year = new Date().getFullYear();
    setDays($scope.month);
  }

  $scope.dayIsToday = function(date) {
    var today = new Date();
    return today.getMonth() == date.getMonth() && today.getDate() == date.getDate() && today.getYear() == date.getYear();
  }

  $scope.$watch('display', function(newValue) {
    $scope.month.quickView.visible = false;
  });

  $http.get('/events.json').success(function(r) {
    $scope.events = r;
    setDays($scope.month);
  });

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
      scope.$watch(attrs.moveUp, function (newValue) {
        if (newValue) {
          $timeout(function() {
            var top = Number(element.css('top').slice(0, -2));
            element.css('top', (top - 26) + 'px');
          })
        }
      }, true);
    }
  }
})
.directive('eventLink', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.color, function(newValue) {
        element.css('background-color', newValue || '#428bca');
      })
    }
  }
});

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
      start.setHours(0,0,0,0);
      start.setMinutes(0);
      start.setSeconds(0);
      end = new Date(events[i].ends_at);
      end.setHours(23,59,59,999);
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
})
.filter('atLeastOne', function() {
  return function(list, children) {
    var newList = [];
    for (var i=0; i<list.length; i++) {
      if (list[i][children].length > 0) newList.push(list[i]);
    }
    return newList;
  }
})
.filter('startingAt', function() {
  return function(list, at) {
    return list.slice(at);
  }
})
