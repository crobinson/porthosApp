angular.module('starter.controllers', [])

.factory('apiService', function($http) {
    var items = [];
    var categories = [];
    var subcategories = [];
    return {
        getPublicidad: function() {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "http://www.porthospub.com/simpanel/ajax/json.php?action=PUBLICIDAD", false);
            //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send();
            return xmlhttp.responseText;
        },
        getCategorias: function() {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "http://www.porthospub.com/simpanel/ajax/json.php?action=CATEGORIA&IDPADRE=0", false);
            xmlhttp.send();
            return JSON.parse(xmlhttp.responseText);
        },
        getCategoriaById: function(categoriaId) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "http://www.porthospub.com/simpanel/ajax/json.php?action=CATEGORIA&IDCATEGORIA=" + categoriaId, false);
            xmlhttp.send();
            return JSON.parse(xmlhttp.responseText);
        },
        getPlatosbyCat: function(categoriaId) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "http://www.porthospub.com/simpanel/ajax/json.php?action=PLATO&IDCATEGORIA=" + categoriaId, false);
            xmlhttp.send();
            return xmlhttp.responseText;
        },
        getPlatoById: function(platoId) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "http://www.porthospub.com/simpanel/ajax/json.php?action=PLATO&IDPLATO=" + platoId, false);
            xmlhttp.send();
            return JSON.parse(xmlhttp.responseText);
        },
        getSubcats: function(categoriaId) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "http://www.porthospub.com/simpanel/ajax/json.php?action=CATEGORIA&IDPADRE=" + categoriaId, false);
            xmlhttp.send();
            var result = JSON.parse(xmlhttp.responseText);
            categories = result.rows;
            return xmlhttp.responseText;
        },
        getAdiciones: function() {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "http://www.porthospub.com/simpanel/ajax/json.php?action=ADICION", false);
            xmlhttp.send();
            return JSON.parse(xmlhttp.responseText);
        },
        pedir: function(nombre, telefono, email, direccion) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "http://www.porthospub.com/simpanel/ajax/json.php?funcion=pedir", false);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("nombre=" + nombre + "&telefono=" + telefono + "&email=" + email + "&direccion=" + direccion + "&items=" + localStorage.getItem('cart'));
            return JSON.parse(xmlhttp.responseText);
        }
    }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('homeCtrl', function($scope, $ionicSlideBoxDelegate, apiService, $ionicPlatform, $ionicLoading) {
    //localStorage.setItem('cart', null);

    $ionicLoading.show({
        template: '<span style="padding-top:100px;">Cargando</span><br/> <ion-spinner icon="dots"/>',
        hideOnStateChange: true
    });

    var publicidad = apiService.getPublicidad(),
        categorias = apiService.getCategorias(),
        banners = JSON.parse(publicidad),
        adiciones = apiService.getAdiciones();

    localStorage.setItem('categorias', JSON.stringify(categorias));
    localStorage.setItem('adiciones', JSON.stringify(adiciones));

    $ionicPlatform.ready(function() {
        $ionicLoading.hide();
    });




    $scope.banners = banners.rows;
    console.log(banners);
    $ionicSlideBoxDelegate.update();

    $scope.slideHasChanged = function(index) {
        console.log(index);
        $scope.data.slideIndex = index;
    };
})

.controller('categoriasCtrl', function($scope, apiService, $ionicLoading, $timeout, $state) {

    var cats = JSON.parse(localStorage.getItem('categorias'))
    $scope.categorias = cats.rows;
    $scope.goto = function(id) {

        $ionicLoading.show({
            template: '<span style="padding-top:100px;">Cargando</span><br/> <ion-spinner icon="dots"/>',
            hideOnStateChange: true
        });

        $timeout(function() {
            $state.go('app.platos', {
                categoriaId: id
            });
        }, 1000);

    };
})

.controller('PlaylistsCtrl', function($scope) {
    $scope.playlists = [{
        title: 'Reggae',
        id: 1
    }, {
        title: 'Chill',
        id: 2
    }, {
        title: 'Dubstep',
        id: 3
    }, {
        title: 'Indie',
        id: 4
    }, {
        title: 'Rap',
        id: 5
    }, {
        title: 'Cowbell',
        id: 6
    }];
})

.controller('PlatosCtrl', function($scope, $stateParams, apiService, $state) {
        var platosString = apiService.getPlatosbyCat($stateParams.categoriaId);
        var hijosString = apiService.getSubcats($stateParams.categoriaId);
        var hijos = JSON.parse(hijosString);
        $scope.hijoslenght = Object.keys(hijos.rows).length;
        $scope.hijos = hijos.rows;

        if ($scope.hijoslenght > 0) {
            platosString = apiService.getPlatosbyCat(hijos.rows[0].IDCATEGORIA);
        } else {
            var categoriaPadre = apiService.getCategoriaById($stateParams.categoriaId);
            $scope.categoria = categoriaPadre.rows[0];
        }

        var platos = JSON.parse(platosString);
        $scope.platos = platos.rows;

        $scope.showPlatos = function(idcat) {
            platosString = apiService.getPlatosbyCat(idcat);
            platos = JSON.parse(platosString);
            $scope.platos = platos.rows;
        };

        $scope.confirmarpedido = function() {
            $state.go('app.carrito');
        }

    })
    .controller('adicionesCtrl', function($scope, $stateParams, apiService, $ionicHistory, $ionicPopup) {
        $scope.formData = {};
        var carnes, checkedItems = [],
            plato = apiService.getPlatoById($stateParams.platoId),
            adiciones = JSON.parse(localStorage.getItem('adiciones'));
        $scope.data = {};
        $scope.carnes = '';
        $scope.adiciones = adiciones.rows;
        $scope.precio = plato.rows[0].PRECIO;
        console.log(plato);
        if (plato.rows[0].NUMERODECARNES == 'S') {
            var myPopup = $ionicPopup.show({
                template: '<input type="tel" ng-model="data.wifi">',
                title: 'DESEAS ADICIONARLE CARNES A TU HAMBURGUESA?',
                subTitle: '(Cada carne adicional tiene un valor de $6.000)',
                scope: $scope,
                buttons: [{
                    text: 'No gracias'
                }, {
                    text: 'Si',
                    type: 'button-balanced',
                    onTap: function(e) {
                        if (!$scope.data.wifi) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.data.wifi;
                        }
                    }
                }]
            });
            myPopup.then(function(res) {
                console.log('Tapped!', res);
                carnes = res;
            });
        }
        $scope.agregar = function() {
            console.log($scope.formData);
            console.log('Checked items: ', checkedItems);
            var result = JSON.parse(localStorage.getItem('cart'));
            if (result === null)
                result = [];

            result.push({
                'item': plato.rows[0].IDPLATO,
                'carnes': carnes,
                'adiciones': checkedItems,
                'observaciones': $scope.formData.observaciones,
                'plato': plato.rows[0]
            });
            localStorage.setItem('cart', JSON.stringify(result));
            //$ionicNavBarDelegate.back();
            $ionicHistory.goBack();
        }

        $scope.checkItem = function(itemID) {
            position = checkedItems.indexOf(itemID);
            if (~position)
                checkedItems.splice(position, 1);
            else
                checkedItems.push(itemID);

            console.log(checkedItems);
        }

    })

.controller('carritoCtrl', function($scope, $stateParams, apiService, $state) {
    $scope.items = JSON.parse(localStorage.getItem('cart'));
    $scope.subtotal = 0;
    for (var i = 0, len = $scope.items.length; i < len; i++) {
        console.log($scope.items[i]);
        var price = $scope.items[i].plato.PRECIO.replace(/[^0-9\.]+/g, '');
        $scope.subtotal = $scope.subtotal + parseInt(price.replace('.', ''));
    }

    $scope.pagar = function() {
        $state.go('app.checkout');
    }
    $scope.borrarItem = function() {
        localStorage.setItem('cart', JSON.stringify($scope.items));
    }

})

.controller('checkoutCtrl', function($scope, $stateParams, apiService, $state, $ionicPopup, $ionicPopover) {
    $scope.formData = {};
    $scope.data = {};
    $scope.direcciones = JSON.parse(localStorage.getItem('direcciones'));
    if ($scope.direcciones === null)
            $scope.direcciones = [];
    $scope.pedir = function() {
        var results = apiService.pedir($scope.formData.nombre, $scope.formData.telefono, $scope.formData.email, $scope.formData.direccion);
        console.log(results);
        localStorage.setItem('cart', null);
        alert('Pedido enviado con éxito');
    }
            
            var template = '<ion-popover-view style="border:none; background-color:black; color:white;"><ion-item style="border-color:white; background-color:black; color:white;" ng-click="set_pago(1)" class="item item-icon-left"><i class="icon ion-cash"></i> Efectivo</ion-item><ion-item style="border-color:white; background-color:black; color:white;" ng-click="set_pago(2)" class="item item-icon-left"><i class="icon ion-card"></i> Tarjeta Débito</ion-item><ion-item style="border-color:white; background-color:black; color:white;" ng-click="set_pago(3)" class="item item-icon-left"><i class="icon ion-card"></i> Tarjeta Crédito</ion-item><ion-item style="border-color:white; background-color:black; color:white;" ng-click="set_pago(4)" class="item item-icon-left"><i class="icon ion-iphone"></i> Pago Online</ion-item></ion-popover-view>';
            
    $scope.popover = $ionicPopover.fromTemplate(template, {
                                                        scope: $scope
                                                        });
    $scope.showPopover = function() {
           $scope.popover.show($event);
            }
            
    $scope.set_pago = function(id){
            switch(id) {
            case 1:
                $scope.formData.formapago = 'Efectivo';
            break;
            case 2:
                $scope.formData.formapago = 'Tarjeta Débito';
            break;
            case 3:
                $scope.formData.formapago = 'Tarjeta Crédito';
            break;
            case 4:
            $scope.formData.formapago = 'Online';
            break;
            default:
                $scope.formData.formapago = 'Efectivo';
            }
            $scope.popover.hide();
    }
            
    $scope.showPopup = function() {
            var myPopup = $ionicPopup.show({
                                           template: '<input type="text" ng-model="data.wifi">',
                                           title: 'AGREGA UNA NUEVA DIRECCION',
                                           subTitle: '(Recuerda seleccionar la dirección del envío después de agregarla)',
                                           scope: $scope,
                                           buttons: [{
                                                     text: 'Cancelar'
                                                     }, {
                                                     text: 'Agregar',
                                                     type: 'button-balanced',
                                                     onTap: function(e) {
                                                     if (!$scope.data.wifi) {
                                                     //don't allow the user to close unless he enters wifi password
                                                     e.preventDefault();
                                                     } else {
                                                     return $scope.data.wifi;
                                                     }
                                                     }
                                                     }]
                                           });
            myPopup.then(function(res) {
                         console.log('Tapped!', res);
                            if(res){
                                $scope.direcciones.push(res);
                                localStorage.setItem('direcciones', JSON.stringify($scope.direcciones));
                            }
                         
                         });
    }
            
            
})

.controller('PlaylistCtrl', function($scope, $stateParams) {})

.directive('backImg', function() {
    return function(scope, element, attrs) {
        var url = attrs.backImg;
        var content = element.find('a');
        content.css({
            'background-image': 'url(' + url + ')',
            'background-size': 'cover'
        });
    };
});