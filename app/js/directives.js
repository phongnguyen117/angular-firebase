(function(angular) {
  'user strict';

  var chatDirectives = angular.module('chatDirectives', []);

  chatDirectives.directive('youtube',
    function($sce){
      return {
        restrict:'EA',
        scope: {
          linkInfo: '=model'
        },
        replace: true,
        template: '<div>'+
                    '<iframe style="overflow:hidden;width:350px;height:300px;"src="{{url}}" frameborder="0"></iframe>'+
                  '</div>',
        link: function(scope){
          scope.$watch('linkInfo', function () {
            if (scope.linkInfo){
              scope.url = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + scope.linkInfo);
            }
          });
        }
      }
  });

  chatDirectives.directive('scrollDown',['$document', function($document) {
    return {
      restrict: 'A',
      replace: 'true',
        link: function(scope, elem, attrs){
          var raw = elem[0];
          scope.$watch(function(){
            raw.scrollTop = raw.scrollHeight;
          })
        }
      };
  }]);
})(angular);