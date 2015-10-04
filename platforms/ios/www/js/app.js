// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngIOS9UIWebViewPatch'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.plugins.pushNotification) {

            pushNotification = window.plugins.pushNotification;

            /*pushNotification.registerDevice({alert:true, badge:true, sound:true}, function(status) {
                                            app.myLog.value+=JSON.stringify(['registerDevice status: ', status])+"\n";
                                            app.storeToken(status.deviceToken);
                                            console.log(status);
                                            });
            */

            pushNotification.register(
                tokenHandler,
                errorHandler, {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true",
                    "ecb": "onNotificationAPN"
                });

            function tokenHandler(result) {
                // Your iOS push server needs to know the token before it can push to this device
                // here is where you might want to send it the token for later use.
                //alert('device token = ' + result);
                localStorage.setItem('deviceToken', result);
            }

            // result contains any message sent from the plugin call
            function successHandler(result) {
                //alert('result = ' + result);
            }


            // result contains any error description text returned from the plugin call
            function errorHandler(error) {
                //alert('error = ' + error);
            }

            // iOS
            function onNotificationAPN(event) {
                if (event.alert) {
                    navigator.notification.alert(event.alert);
                }

                if (event.sound) {
                    var snd = new Media(event.sound);
                    snd.play();
                }

                if (event.badge) {
                    pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
                }
            }


        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })

    .state('app.search', {
        url: "/search",
        views: {
            'menuContent': {
                templateUrl: "templates/search.html"
            }
        }
    })

    .state('app.sucursales', {
        url: "/sucursales",
        views: {
            'menuContent': {
                templateUrl: "templates/sucursales.html",
                controller: "MapCtrl"
            }
        }
    })

    .state('app.eventos', {
        url: "/eventos",
        views: {
            'menuContent': {
                templateUrl: "templates/eventos.html"
            }
        }
    })

    .state('app.carrito', {
            url: "/carrito",
            views: {
                'menuContent': {
                    templateUrl: "templates/carrito.html",
                    controller: 'carritoCtrl'
                }
            }
        })
        .state('app.checkout', {
            url: "/checkout",
            views: {
                'menuContent': {
                    templateUrl: "templates/checkout.html",
                    controller: 'checkoutCtrl'
                }
            }
        })

    .state('app.adiciones', {
        url: "/paso2/:platoId",
        views: {
            'menuContent': {
                templateUrl: "templates/adiciones.html",
                controller: 'adicionesCtrl'
            }
        }
    })

    .state('app.categorias', {
        url: "/categorias",
        views: {
            'menuContent': {
                templateUrl: "templates/categorias.html",
                controller: 'categoriasCtrl'
            }
        }
    })

    .state('app.home', {
            url: "/home",
            views: {
                'menuContent': {
                    templateUrl: "templates/home.html",
                    controller: 'homeCtrl'
                }
            }
        })
        .state('app.platos', {
            url: "/platos/:categoriaId",
            views: {
                'menuContent': {
                    templateUrl: "templates/platos.html",
                    controller: 'PlatosCtrl'
                }
            }
        })
        .state('app.single', {
            url: "/playlists/:playlistId",
            views: {
                'menuContent': {
                    templateUrl: "templates/playlist.html",
                    controller: 'PlaylistCtrl'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});
