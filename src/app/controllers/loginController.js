'use strict';
app.controller('loginController', ['$scope', '$location', 'authService',
    function ($scope, $location, authService) {

        $scope.loginData = {
            userName: "",
            password: ""
        };

        $scope.message = "";
        
        $scope.login = function () {
            authService.login(
                $scope.loginData
            ).then(
                // login correcto
                function (response) {
                    $location.path('/mylist');
                    $scope.message = "";
                },
                // login error
                function (err) {
                    $scope.message = err.error_description;
            });
        };
    }
]);