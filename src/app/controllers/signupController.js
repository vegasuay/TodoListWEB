'use strict';
app.controller('signupController', ['$scope', '$location', '$timeout', 'authService',
    function ($scope, $location, $timeout, authService) {
        $scope.saveSuccessfully = false;
        $scope.message = "";

        $scope.registration = {
            userName : "",
            password: "", 
            confirmPassword : ""
        };

        $scope.signUp = function () {

            authService.saveRegistration(
                $scope.registration
            ).then(
                //registration successfully
                function (response) {
                    $scope.saveSuccessfully = true;
                    $scope.message = "user has been registered succesfully, redicted to login in 2 seconds.";
                    startTimer();
                },
                //registration error
                function (response) {
                    var errors = [];
                    for (var key in response.data.modelState) {
                        for (var i = 0; i < response.data.modelState[key].length; i++) {
                            errors.push(response.data.modelState[key][i]);
                        }
                    }

                    $scope.message = "failed to register user due to:" + errors.join(' ');
                }
            );
        };

        //wait 2 seconds and redirect to login path
        var startTimer = function () {
            var timer = $timeout(function () {
                $timeout.cancel(timer);
                $location.path('/login');
            }, 200);
        }
    }
]);