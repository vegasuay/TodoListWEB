'use strict';
app.controller('indexController', ['$scope', '$location', 'authService',
    function ($scope, $location, authService) {

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.logOut = function () {
            authService.logOut();
            $location.path('/home');
        }

        $scope.authentication = authService.authentication;
    }
]);