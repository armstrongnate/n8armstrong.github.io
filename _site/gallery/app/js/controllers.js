var flickrFetcher = {
  latestGeoReferencedPhotosUrl: 'http://api.flickr.com/services/rest/?method=flickr.photos.search&per_page=500&license=1,2,4,7&has_geo=1&extras=original_format,tags,description,geo,date_upload,owner_name,place_url,url_t,url_m,url_sq,url_o&format=json&nojsoncallback=1&api_key=79f73d19494d6cf8b4ad4255b2d9dbdb'
}

var galleryApp = angular.module('galleryApp', []);

galleryApp.controller('ImageListCtrl', ['$scope', '$http', '$timeout', '$filter', function ImageListCtrl($scope, $http, $timeout, $filter) {
  $http.get(flickrFetcher.latestGeoReferencedPhotosUrl).success(function(data) {
    var photos = data.photos.photo;
    $scope.photos = photos;
    tags = {};
    for (var i=0; i<photos.length; i++) {
      if (photos[i].tags && photos[i].tags.length) {
        for(var j=0; j<photos[i].tags.split(' ').length; j++) {
          var tag = photos[i].tags.split(' ')[j]
          if (tag.indexOf(':') < 0) {
            if (!tags[tag]) {
              tags[tag] = 1;
            } else {
              tags[tag] += 1;
            }
          }
        }
      }
    }

    $scope.tags = tags;

    $scope.search = {};

    $scope.onSlide = 0;

    $scope.delay = 4;

    var slide = function() {
      $scope.state = 'playing';
      $scope.slideTimeout = $timeout(function() {
        if ($scope.onSlide >= $filter('filter')($scope.photos, $scope.search).length - 1) {
          $scope.onSlide = 0;
        } else {
          $scope.onSlide += 1;
        }
        slide();
      }, $scope.delay * 1000);
    }

    slide();

    $scope.$watch('search.tags', function(oldValue, newValue) {
      $scope.onSlide = 0;
    })

    $scope.$watch('delay', function() {
      $timeout.cancel($scope.slideTimeout);
      if ($scope.state == 'playing') slide();
    })

    $scope.setTag = function(tag) {
      if ($scope.search.tags === tag) {
        $scope.search = {};
      } else {
        $scope.search.tags = tag;
      }
      $timeout.cancel($scope.slideTimeout);
      if ($scope.state == 'playing') slide();
    }

    $scope.thumbClick = function(index) {
      $scope.onSlide = index;
      $timeout.cancel($scope.slideTimeout);
      if ($scope.state == 'playing') slide();
    }

    $scope.pause = function() {
      $timeout.cancel($scope.slideTimeout);
      $scope.state = 'paused';
    }

    $scope.play = function() {
      slide();
    }

    $scope.reset = function() {
      $scope.onSlide = 0;
    }

    $scope.next = function() {
      $timeout.cancel($scope.slideTimeout);
      if ($scope.onSlide >= $filter('filter')($scope.photos, $scope.search).length - 1) {
        $scope.onSlide = 0;
      } else {
        $scope.onSlide += 1;
      }
      if ($scope.state == 'playing') slide();
    }

    $scope.prev = function() {
      $timeout.cancel($scope.slideTimeout);
      if ($scope.onSlide <= 0) {
        $scope.onSlide =  $filter('filter')($scope.photos, $scope.search).length - 1;
      } else {
        $scope.onSlide -= 1;
      }
      if ($scope.state == 'playing') slide();
    }
  });
}]);
