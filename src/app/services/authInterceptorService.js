'use strict';
app.factory('authInterceptorService', ['$q', '$location', 'localStorageService',
    function ($q, $location, localStorageService) {
        var authInterceptorServiceFactory = {};

        // the method “_request” will be fired before $http sends the 
        // request to the back- end API, so this is the right place to 
        // read the token from local storage and set it into “Authorization” 
        // header with each request.Note that I’m checking if the local storage object 
        // is nothing so in this case this means the user is anonymous and there is no 
        // need to set the token with each XHR request.
        var _request = function (config) {
            config.headers = config.headers || {};

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }

            return config;
        }

        // the method “_responseError” will be hit after the we receive a 
        // response from the Back- end API and only if there is failure status returned.
        // So we need to check the status code, in case it was 401 we’ll redirect 
        // the user to the log-in page where he’ll be able to authenticate again
        var _responseError = function (rejection) {
            if (rejection.status === 401) {
                $location.path('/login');
            }

            return $q.reject(rejection);
        }

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }
]);