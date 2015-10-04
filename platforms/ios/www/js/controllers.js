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
        pedir: function(formapago, nombre, telefono, telefonofijo, email, direccion, deviceToken) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "http://www.porthospub.com/simpanel/ajax/json.php?funcion=pedir", false);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("formapago=" + formapago + "nombre=" + nombre + "&telefono=" + telefono + "&telefonofijo=" + telefonofijo + "&email=" + email + "&direccion=" + direccion + "&items=" + localStorage.getItem('cart') + "&deviceToken" + deviceToken);
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

.controller('homeCtrl', function($scope, $ionicSlideBoxDelegate, apiService, $ionicPlatform, $ionicLoading, $cordovaGeolocation) {
    //localStorage.setItem('cart', null);
    var posOptions = {
        timeout: 10000,
        enableHighAccuracy: false
    };
    $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function(position) {
            var lat = position.coords.latitude
            var long = position.coords.longitude
        }, function(err) {
            // error
        });

    $scope.callUpdate = function() {
        alert("im in");
    }
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

    $scope.$on('$ionicView.enter', function(e) {
        $scope.items = JSON.parse(localStorage.getItem('cart'));
        if ($scope.items === null)
            $scope.badgenum = null;
        else
            $scope.badgenum = $scope.items.length;
    });

    var cats = JSON.parse(localStorage.getItem('categorias'));
    $scope.categorias = cats.rows;
    $scope.items = JSON.parse(localStorage.getItem('cart'));
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

.controller('MapCtrl', function($scope, $ionicLoading) {
    $scope.showMapa = function() {
        window.open('https://www.google.com/maps/d/edit?mid=zkwPdFQxgRNw.kFBDyjyeKaA8&usp=sharing', '_blank', 'location=no,closebuttoncaption=Cerrar Mapa');
    }

})

.controller('PlatosCtrl', function($scope, $stateParams, apiService, $state, $ionicLoading, $ionicTabsDelegate) {


        var platosString = apiService.getPlatosbyCat($stateParams.categoriaId);
        var hijosString = apiService.getSubcats($stateParams.categoriaId);
        var hijos = JSON.parse(hijosString);
        $scope.hijoslenght = Object.keys(hijos.rows).length;
        $scope.hijos = hijos.rows;
        $scope.active = '';
        $scope.items = JSON.parse(localStorage.getItem('cart'));
        $scope.$on('$ionicView.enter', function(e) {
            $scope.items = JSON.parse(localStorage.getItem('cart'));
            $ionicTabsDelegate.select(0);
            if ($scope.items === null)
                $scope.badgenum = null;
            else
                $scope.badgenum = $scope.items.length;
        });


        if ($scope.hijoslenght > 0) {
            platosString = apiService.getPlatosbyCat(hijos.rows[0].IDCATEGORIA);

            $ionicTabsDelegate.select(0);
        } else {
            var categoriaPadre = apiService.getCategoriaById($stateParams.categoriaId);
            $scope.categoria = categoriaPadre.rows[0];
        }

        var platos = JSON.parse(platosString);
        $scope.platos = platos.rows;

        $scope.selectTabWithIndex = function(index) {
          $ionicTabsDelegate.select(index);
        }

        $scope.showPlatos = function(idcat) {
            $ionicLoading.show({
                template: '<span style="padding-top:100px;">Cargando</span><br/> <ion-spinner icon="dots"/>',
                hideOnStateChange: false
            });
            platosString = apiService.getPlatosbyCat(idcat);
            platos = JSON.parse(platosString);
            if (platos)
                $ionicLoading.hide();

            $scope.platos = platos.rows;
        };

        $scope.confirmarpedido = function() {
            $state.go('app.carrito');
        }


        $scope.setActive = function(type) {

            $scope.active = type;
        };
        $scope.isActive = function(type) {
            return type === $scope.active;
        };
        $ionicTabsDelegate.select(1);
    })
    .controller('adicionesCtrl', function($scope, $stateParams, apiService, $ionicHistory, $ionicPopup) {
        $scope.formData = {};
        var carnes = 0,
            checkedItems = [],
            plato = apiService.getPlatoById($stateParams.platoId),
            adiciones = JSON.parse(localStorage.getItem('adiciones'));
        $scope.data = {};
        $scope.showinput = false;
        $scope.carnes = '';
        $scope.adiciones = adiciones.rows;
        $scope.precio = plato.rows[0].PRECIO;
        console.log(plato);
        if (plato.rows[0].NUMERODECARNES == 'S') {
            cordova.plugins.Keyboard.disableScroll(false);
            var myPopup = $ionicPopup.show({
                template: '<div ng-show="showinput"><h4 style="color:white;">Cuantas?</h4><input type="tel" ng-model="data.wifi"></div>',
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
                            if (!$scope.showinput) {
                                $scope.showinput = true;
                            }
                            e.preventDefault();
                        } else {
                            return $scope.data.wifi;
                        }
                    }
                }]
            });
            myPopup.then(function(res) {
                console.log('Tapped!', res);

                carnes = res


                cordova.plugins.Keyboard.disableScroll(true);
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

            // An alert dialog
            var alertPopup = $ionicPopup.alert({
                title: 'TU PLATO HA SIDO AGREGADO',
                template: '',
                buttons: [{
                    text: 'Aceptar',
                    type: 'button-balanced'
                }]
            });
            alertPopup.then(function(res) {
                $ionicHistory.goBack();
            });

            //$ionicNavBarDelegate.back();

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
    $scope.adiciones = '';
    var adiciones = JSON.parse(localStorage.getItem('adiciones'));
    if ($scope.items) {
        for (var i = 0, len = $scope.items.length; i < len; i++) {
            var price = $scope.items[i].plato.PRECIO.replace(/[^0-9\.]+/g, '');
            var adicion = $scope.items[i].adiciones;
            $scope.items[i].valorcarnes = 0;
            $scope.items[i].adicionesText = [];
            $scope.items[i].subtotal = parseInt(price.replace('.', ''));
            $scope.subtotal = $scope.subtotal + parseInt(price.replace('.', ''));

            if ($scope.items[i].hasOwnProperty('carnes')) {
                $scope.subtotal = $scope.subtotal + parseInt(6000 * parseInt($scope.items[i].carnes));
                $scope.items[i].subtotal = $scope.items[i].subtotal + parseInt(6000 * parseInt($scope.items[i].carnes));
                $scope.items[i].valorcarnes = parseInt(6000 * parseInt($scope.items[i].carnes));
            }

            if (adicion.length) {

                for (n = 0; n < adicion.length; n++) {
                    id = adicion[n];
                    rows = adiciones.rows;

                    for (a = 0; a < rows.length; a++) {
                        if (id == rows[a].IDADICION) {
                            $scope.items[i].adicionesText.push(rows[a]);
                            var priceadicion = rows[a].PRECIO.replace(/[^0-9\.]+/g, '');
                            if (priceadicion) {
                                $scope.subtotal = $scope.subtotal + parseInt(priceadicion.replace('.', ''));
                                $scope.items[i].subtotal = $scope.items[i].subtotal + parseInt(priceadicion.replace('.', ''));
                            }
                        }

                    }
                }

                /*$scope.items[i].adiciones = $scope.adiciones;
                $scope.adiciones = '';*/
            }

        }
    }
    console.log($scope.items);
    //$scope.items = JSON.parse(localStorage.getItem('cart'));
    localStorage.setItem('subtotal', JSON.stringify($scope.subtotal));

    $scope.pagar = function() {
        $state.go('app.checkout');
    }

    $scope.borrarAdicion = function(item, i) {
        var idAdicion = item.IDADICION
        var adicion = $scope.items[i].adiciones;
        var priceadicion = item.PRECIO.replace(/[^0-9\.]+/g, '');
        localStorage.setItem('cart', JSON.stringify($scope.items));
        if (adicion.length) {
            for (n = 0; n < adicion.length; n++) {
                id = adicion[n];
                if (id == idAdicion) {
                    adicion.splice(n, 1);
                    $scope.items[i].subtotal = $scope.items[i].subtotal - parseInt(priceadicion.replace('.', ''));
                }
            }
        }
        $scope.items[i].adiciones = adicion;
        localStorage.setItem('cart', JSON.stringify($scope.items));
    }

    $scope.borrarCarnes = function(i) {
        $scope.items[i].valorcarnes = null;
        $scope.items[i].carnes = null;
        localStorage.setItem('cart', JSON.stringify($scope.items));
    }

    $scope.borrarItem = function() {
        localStorage.setItem('cart', JSON.stringify($scope.items));
    }

})

.controller('checkoutCtrl', function($scope, $stateParams, apiService, $state, $ionicPopup, $ionicPopover, $cordovaGeolocation) {
    $scope.formData = {};
    $scope.data = {};
    $scope.valorDomicilio = 0;
    $scope.direcciones = JSON.parse(localStorage.getItem('direcciones'));
    $scope.subtotal = JSON.parse(localStorage.getItem('subtotal'));
    $scope.deviceToken = localStorage.getItem('deviceToken');
    $scope.items = JSON.parse(localStorage.getItem('cart'));
    $scope.formData.direccion = localStorage.getItem('direccion');
    $scope.formData.formapago = 'Efectivo';
    if ($scope.direcciones === null)
        $scope.direcciones = [];

    $scope.pedir = function() {

        // An alert dialog
        if($scope.formData.formapago != 'Online'){
          var results = apiService.pedir($scope.formData.formapago, $scope.formData.nombre, $scope.formData.telefono, $scope.formData.telefonofijo, $scope.formData.email, $scope.formData.direccion, $scope.deviceToken);
          localStorage.setItem('direccion', scope.formData.direccion);
          localStorage.setItem('cart', null);
          localStorage.setItem('subtotal', null);
          var alertPopup = $ionicPopup.alert({
              title: 'TU PEDIDO HA SIDO RECIBIDO',
              template: 'GRACIAS',
              buttons: [{
                  text: 'Aceptar',
                  type: 'button-balanced'
              }]
          });
          alertPopup.then(function(res) {
              //$ionicHistory.goBack();
              console.log('http://porthospub.com/webCheckout.php?params='+$scope.formData);
              window.open('http://porthospub.com/webCheckout.php?params='+$scope.formData);
              $state.go('app.home');
          });
        }else{

        }

    }

    var template = '<ion-popover-view style="border:none; background-color:black; color:white;"><ion-item style="border-color:white; background-color:black; color:white;" ng-click="set_pago(1)" class="item item-icon-left"><i class="icon ion-cash"></i> Efectivo</ion-item><ion-item style="border-color:white; background-color:black; color:white;" ng-click="set_pago(2)" class="item item-icon-left"><i class="icon ion-card"></i> Tarjeta Débito</ion-item><ion-item style="border-color:white; background-color:black; color:white;" ng-click="set_pago(3)" class="item item-icon-left"><i class="icon ion-card"></i> Tarjeta Crédito</ion-item><ion-item style="border-color:white; background-color:black; color:white;" ng-click="set_pago(4)" class="item item-icon-left"><i class="icon ion-iphone"></i> Pago Online</ion-item></ion-popover-view>';

    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });
    $scope.showPopover = function() {
        $scope.popover.show($event);
    }

    var posOptions = {
        timeout: 10000,
        enableHighAccuracy: false
    };
    $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function(position) {
            var lat = position.coords.latitude
            var long = position.coords.longitude
                //11.0055, -74.81022
                //11.00834, -74.81783
            var distance = $scope.distance(lat, long, 11.0055, -74.81022, 'K');
            //alert(distance);
            if(distance<4){
              $scope.valorDomicilio = 4000;
            }else if(4<=distance && distance<=6){
              $scope.valorDomicilio = 6000;
            }else {
              $scope.valorDomicilio = 0;
            }

        }, function(err) {
            // error
        });

    $scope.distance = function(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var radlon1 = Math.PI * lon1 / 180
        var radlon2 = Math.PI * lon2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta / 180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        if (unit == "K") {
            dist = dist * 1.609344
        }
        if (unit == "N") {
            dist = dist * 0.8684
        }
        return dist
    }

    $scope.set_pago = function(id) {
        switch (id) {
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
            if (res) {
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
