(function(){
  'use strict';

  var chatApp = angular.module('chatApp', [
    'ui.router',
    'firebase',
    'chatDirectives'
  ]);

  chatApp.config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/');
      $stateProvider.state('index', {
        url: '/',
        views: {
          'content@': { 
            templateUrl: './views/home.html' ,
            controller: 'HomeCtrl'
          },
          '@': { 
            templateUrl: './views/auth.html' ,
            controller: 'AuthCtrl'
          }
        }
      });

      $stateProvider.state('chat', {
        url: '/chat/:roomId',
        views: {
          'content@': { 
            templateUrl: './views/chat.html' ,
            controller: 'ChatCtrl'
          },
          '@': { 
            templateUrl: './views/auth.html' ,
            controller: 'AuthCtrl'
          }
        }
      });
  }]);
})();
