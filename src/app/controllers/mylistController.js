'use strict';
app.controller('mylistController', ['$scope', '$rootScope', '$location', 'ModalService', 'mylistService','authService',
    function ($scope, $rootScope, $location, ModalService, mylistService, authService) {

        $rootScope.message = "";
        $scope.lista = [];
        $scope.isEdit = false;
        $scope.mislistas = null;
        $scope.dataLoading = true;

        $scope.sortType = 'product';
        $scope.sortReverse = false;        
        
        $("#success-alert").hide();
        $("#danger-alert").hide();

        /* Obtener la lista del usuario */
        mylistService.getMyList().then(
            function (response) {
                $scope.lista = response.data;
                
                $scope.mislistas = $.unique(response.data.map(function (d) {
                    return d.listaName;
                }));            

                $scope.dataLoading = false;
            },
            // error
            function (err) {
                $rootScope.message = err.error_description;
            }
        );

        /* Sacar producto de la lista */
        $scope.delete = function (_product) {
            var product = $scope.lista.filter(function (item) {
                return item['product'] == _product;
            });

            $scope.lista.pop(product);
        };

        /* Pasar producto seleccionado al div */
        $scope.edit = function (_product) {
            $scope.isEdit = true;

            var product = $scope.lista.filter(function (item) {
                return item['product'] == _product;
            });

            $scope.productreadonly = true;

            $scope.product = product[0].product;
            $scope.count = product[0].count;
            $scope.price = product[0].price;
        };

        /* Guardar producto editado*/
        $scope.editSave = function () {
            var product = $scope.lista.filter(function (item) {
                return item['product'] == $scope.product;
            });

            product[0].count = $scope.count;
            product[0].price = $scope.price;

            $scope.isEdit = false;
            $scope.productreadonly = false;
            $scope.product = '';
            $scope.count = '';
            $scope.price = '';

            $rootScope.message = "El producto se actualizó correctamente.";
            $("#success-alert").fadeTo(2000, 500).slideUp(500,
                function () {
                    $("#success-alert").slideUp(500);
                }
            );
        };

        /* Cancelar producto en ediccion*/
        $scope.editCancel = function () {
            $scope.isEdit = false;
            $scope.productreadonly = false;

            $scope.product = '';
            $scope.count = '';
            $scope.price = '';
        };

        /* Añadir nuevo producto a la lista activa*/
        $scope.addProduct = function () {
            
            var productExist = $scope.lista.filter(function (item) {
                return item['product'].toLowerCase() == $scope.product.toLowerCase();
            }).length;

            // validar duplicados
            if (productExist > 0) {
                $rootScope.message = "El producto ya existe.";
                $("#danger-alert").fadeTo(2000, 500).slideUp(500,
                    function () {
                        $("#danger-alert").slideUp(500);
                    }
                );

                return;
            }

            $scope.lista.push(
                {
                    'count': $scope.count,
                    'id': 0,
                    'listaName': $('#selectLista option:selected').text(),
                    'price': $scope.price,
                    'product': $scope.product,                    
                    'sharedUsers': null,
                    'userName': authService.authentication.userName
                });

            $scope.product = '';
            $scope.count = '';
            $scope.price = '';

            $rootScope.message = "El producto se ha añadido correctamente.";
            $("#success-alert").fadeTo(2000, 500).slideUp(500,
                function () {
                    $("#success-alert").slideUp(500);
                }
            );
        };

        /* abrir modal para nueva lista */
        $scope.addNewList = function () {

            ModalService.showModal({
                templateUrl: './app/views/modals/mdnewlist.html',
                controller: "modalController",
                preClose: (modal) => { modal.element.modal('hide');}
            }).then(function (modal) {                
                modal.element.modal();
                modal.close.then(function (result) {
                    if (result) {
                        $scope.mislistas.push(result.newlist);
                    }
                });
            });
        };

        /**GUARDAR EN BD**/
        $scope.updateList = function () {
            mylistService.updateMyList(                
                $scope.lista
            ).then(
                function (response) {
                    $rootScope.message = "La lista se guardo correctamente.";
                    $("#success-alert").fadeTo(2000, 500).slideUp(500,
                        function () {
                            $("#success-alert").slideUp(500);
                        }
                    );

                    $scope.lista = response.data;
                },
                function (err) {
                    console.log(err.error_description);
                    $rootScope.message = 'Error al guardar la lista';
                    $("#danger-alert").fadeTo(2000, 500).slideUp(500,
                        function () {
                            $("#danger-alert").slideUp(500);
                        }
                    );
                }
            );
        };

        
    }
]);

app.controller('modalController', ['$scope', '$element', 'close',
    function ($scope, $element, close) {
        $scope.newlist = null;

        $scope.close = function () {
            close({
                newlist: $scope.newlist
            }, 500); 
        };

        $scope.cancel = function () {
            $element.modal('hide');

            close({
                newlist: $scope.newlist
            }, 500);
        };
    }
]);

app.controller('commentsController', ['$scope', '$rootScope', '$element', 'mylistService', 'authService', 
    function ($scope, $rootScope, $element, mylistService, authService) {        
        $scope.listComments = [];
        $scope.active = true;
          
        /* Obtener la lista del usuario */
        mylistService.getMyComment().then(
            function (response) {                
                $scope.listComments = response.data;
            },
            // error
            function (err) {
                $rootScope.message = err.error_description;
            }
        );

        $scope.addComment = function () {
            var d = new Date();
            var newComment = {
                'id': 0,
                'listaName': $('#selectLista option:selected').text(),
                'fecha': d,
                'text': $scope.text,
                'userName': authService.authentication.userName
            };            

            mylistService.addComment(
                newComment
            ).then(
                function (response) {
                    $rootScope.message = "Comentario guardado correctamente.";
                    $("#success-alert").fadeTo(2000, 500).slideUp(500,
                        function () {
                            $("#success-alert").slideUp(500);
                        }
                    );

                    $scope.listComments.push(response.data);
                    $scope.text = '';
                },
                function (err) {
                    console.log(err.error_description);
                    $rootScope.message = 'Error al guardar el comentario';
                    $("#danger-alert").fadeTo(2000, 500).slideUp(500,
                        function () {
                            $("#danger-alert").slideUp(500);
                        }
                    );
                }
                );
            
        };
        
    }
]);