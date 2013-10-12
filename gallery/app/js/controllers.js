var galleryApp = angular.module('galleryApp', []);

galleryApp.controller('ImageListCtrl', ['$scope', '$http', function ImageListCtrl($scope, $http) {
  $http.get('categories/categories.json').success(function(data) {
    $scope.categories = data;
  });
}]);
