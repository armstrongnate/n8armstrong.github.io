minutedockr = angular.module('minutedockr', [])

NUM_FRAMES = 4

featuresCtrl = ($scope, $timeout) ->
  $scope.frame = 0
  $scope.subFrame = 0
  subFrame = ->
    $timeout ->
      $scope.subFrame += 1
      subFrame()
    , 2000
  subFrame()

  $scope.next = -> $scope.frame = ($scope.frame + 1) % NUM_FRAMES
  $scope.prev = ->
    $scope.frame -= 1
    $scope.frame = NUM_FRAMES - 1 if $scope.frame < 0

minutedockr.controller 'featuresCtrl', ['$scope', '$timeout', featuresCtrl]
