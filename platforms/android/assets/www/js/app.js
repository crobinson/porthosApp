// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

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

            $("#app-status-ul").append('<li>deviceready event received</li>');

            document.addEventListener("backbutton", function(e) {
                $("#app-status-ul").append('<li>backbutton event received</li>');

                if ($("#home").length > 0) {
                    e.preventDefault();
                    pushNotification.unregister(successHandler, errorHandler);
                    navigator.app.exitApp();
                } else {
                    navigator.app.backHistory();
                }
            }, false);

            if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
                //Here is your API key: AIzaSyBAAyE4nrmUGxdFKmoljIpTHRNRBzrkN_I
                pushNotification.register(
                    successHandler,
                    errorHandler, {
                        "senderID": "669309263365",
                        "ecb": "onNotification"
                    });
            } else {
                pushNotification.register(
                    tokenHandler,
                    errorHandler, {
                        "badge": "true",
                        "sound": "true",
                        "alert": "true",
                        "ecb": "onNotificationAPN"
                    });

            }

            function tokenHandler(result) {
                // Your iOS push server needs to know the token before it can push to this device
                // here is where you might want to send it the token for later use.
                //alert('device token = ' + result);
                localStorage.setItem('deviceToken', result);
            }

            // result contains any message sent from the plugin call
            function successHandler(result) {
                alert('result = ' + result);
            }


            // result contains any error description text returned from the plugin call
            function errorHandler(error) {
                alert('error = ' + error);
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

        // Android and Amazon Fire OS
        function onNotification(e) {
            $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

            switch (e.event) {
                case 'registered':
                    if (e.regid.length > 0) {
                        $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                        // Your GCM push server needs to know the regID before it can push to this device
                        // here is where you might want to send it the regID for later use.
                        console.log("regID = " + e.regid);
                        localStorage.setItem('regid', e.regid);
                    }
                    break;

                case 'message':
                    // if this flag is set, this notification happened while we were in the foreground.
                    // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                    if (e.foreground) {
                        $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                        // on Android soundname is outside the payload.
                        // On Amazon FireOS all custom attributes are contained within payload
                        var soundfile = e.soundname || e.payload.sound;
                        // if the notification contains a soundname, play it.
                        var my_media = new Media("/android_asset/www/" + soundfile);
                        my_media.play();
                    } else { // otherwise we were launched because the user touched a notification in the notification tray.
                        if (e.coldstart) {
                            $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                        } else {
                            $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                        }
                    }

                    $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                    //Only works for GCM
                    $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                    //Only works on Amazon Fire OS
                    $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
                    break;

                case 'error':
                    $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                    break;

                default:
                    $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                    break;
            }
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
                templateUrl: "templates/sucursales.html"
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