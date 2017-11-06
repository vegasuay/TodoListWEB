var app = angular.module('AngularAuthApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar',
    'angularModalService', 'ngTagsInput', 'ngAnimate']);

app.config(function ($routeProvider) {
    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html"
    });

    $routeProvider.when("/mylist", {
        controller: "mylistController",
        templateUrl: "/app/views/mylist.html"
    });

    $routeProvider.otherwise({ redirecTo: "/home" });
});

//any service executes XHR requests will use this interceptor
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

//confirm 
app.directive('ngReallyClick', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);