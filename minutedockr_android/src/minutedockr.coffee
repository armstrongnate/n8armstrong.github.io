minutedockr = angular.module('minutedockr', [])

NUM_FRAMES = 4

featuresCtrl = ($scope) ->
  $scope.frame = 0

  $scope.next = -> $scope.frame = ($scope.frame + 1) % NUM_FRAMES
  $scope.prev = ->
    $scope.frame -= 1
    $scope.frame = NUM_FRAMES - 1 if $scope.frame < 0

minutedockr.controller 'featuresCtrl', ['$scope', featuresCtrl]
