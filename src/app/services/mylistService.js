'use strict';
app.factory('mylistService', ['$http',
    function ($http) {
        var serviceBase = 'https://apitodolistvs.herokuapp.com/';
        var mylistServiceFactory = {};

        /*
        Llamadas a Listas
        */
        var _getMyList = function () {
            return $http.get(
                serviceBase + 'listorders/mylist/'
            ).then(function (response) {
                return response;
            });
        };

        var _updateMyList = function (list) {
            return $http.post(
                serviceBase + 'api/list/add',
                list
            ).then(function (response) {
                return response;
            });
        };

        /*
        Llamadas a Comentarios
        */
        var _getMyComment = function () {
            return $http.get(
                serviceBase + 'api/comment/mycomment'
            ).then(function(response){
                return response;
            });
        };

        var _addComment = function (comment) {
            return $http.post(
                serviceBase + 'api/comment/add',
                comment
            ).then(function (response) {
                return response;
            });
        };

        mylistServiceFactory.getMyList = _getMyList;
        mylistServiceFactory.updateMyList = _updateMyList;

        mylistServiceFactory.getMyComment = _getMyComment;
        mylistServiceFactory.addComment = _addComment;

        return mylistServiceFactory;
    }
]);