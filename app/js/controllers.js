(function(angular) {
  'user strict';

  var ref = new Firebase('https://glaring-heat-5049.firebaseio.com/');

  var AuthService = function($firebaseAuth, $rootScope, $q) {
    this.$firebaseAuth = $firebaseAuth;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.user = null;
  };

  AuthService.prototype.authenticate = function(user) {
    if(this.user) {
      this.user = null;
    }
    this.user = user;
  };

  AuthService.prototype.logIn = function() {
    var _this = this;
    var deferred = this.$q.defer();

    ref.authWithOAuthPopup('facebook', function(error, authData) {
      if (error) {
        deferred.reject('Login Failed!', error);
      } else {
        _this.authenticate(authData);
        deferred.resolve();
        console.log('Authenticated successfully with payload:', authData);
      }
    });

    return deferred.promise;
  };

  AuthService.prototype.logOut = function() {
    // ref.unauth();
    var deferred = this.$q.defer();
    this.user = null;
    deferred.resolve(this.user);
    return deferred.promise;
  };

  var controllers = angular.module('chatApp');

  controllers.factory('authService', ['$firebaseAuth', '$rootScope', '$q',
    function($firebaseAuth, $rootScope, $q) {
      return new AuthService($firebaseAuth, $rootScope, $q);
  }]);

  controllers.controller('AuthCtrl', ['$scope', '$rootScope', 'authService', '$firebase', '$location',
    function($scope, $rootScope, authService, $firebase, $location) {
    console.log('authService', authService);
    $scope.authService = authService;

    $scope.login = function() {
      authService.logIn().then(function() {
        console.log('sadasdasds', authService);
      });
    };

    $scope.logout = function() {
      authService.logOut().then(function(user) {
        $scope.authService.user = user;
      }) ;
    };
  }]);

  controllers.controller('HomeCtrl', ['$scope', '$rootScope', 'authService', '$firebaseArray', '$firebaseObject', '$state', 
    function($scope, $rootScope, authService, $firebaseArray, $firebaseObject, $state) {

    $scope.authService = authService;

    var refListChatRooms = new Firebase('https://glaring-heat-5049.firebaseio.com/chatrooms');

    $scope.rooms = $firebaseArray(refListChatRooms);
    $scope.isNew = false;

    $scope.newRoom = function() {
      $scope.rooms.$add({
        createdBy: $scope.authService.user.facebook.displayName,
        roomName: $scope.roomName,
        createdDate: Date.now()
      }).then(function(ref) {
          var id = ref.key();
          console.log('added record with id ' + id);
      });
    };

    $scope.deleteRoom=function(index){
      $scope.rooms.$remove($scope.rooms[index]);
    };

    $scope.joinChat=function(index){
      $state.go('chat', {roomId: $scope.rooms[index].$id});
    };
  }]);

  controllers.controller('ChatCtrl',['$scope', '$rootScope', 'authService', '$stateParams', '$firebaseObject', '$firebaseArray', 
    function($scope, $rootScope, authService, $stateParams, $firebaseObject, $firebaseArray){

      var chatRoom = new Firebase('https://glaring-heat-5049.firebaseio.com/chatrooms/' + $stateParams.roomId);
      var msgSync = $firebaseArray(chatRoom.child('chatMessages'));

      $scope.roomInfo = $firebaseObject(chatRoom);
      $scope.authService = authService;
      $scope.chatMessages= msgSync;

      $scope.sendMessage=function() {
        $scope.url = null;
        if($scope.message.indexOf('https://www.youtube.com/watch?v=')==-1) {
          console.log('aaa');
        } else {
          var number = $scope.message.indexOf('https://www.youtube.com/watch?v=');
          var start=number+32, end= number+43;

          $scope.message.substring(start,end);
          $scope.url = $scope.message.substring(start,end);
        };

        if ($scope.message.length === 0) return;
        msgSync.$add({
          postedBy: $scope.authService.user.facebook.displayName,
          message: $scope.message,
          postedDate: Date.now(),
          userImg: $scope.authService.user.facebook.profileImageURL,
          url: $scope.url
        });
        $scope.message='';
      }
  }]);

}(angular));
