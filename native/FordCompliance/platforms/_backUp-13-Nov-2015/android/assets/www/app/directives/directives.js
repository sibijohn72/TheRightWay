//'use strict';

/* Directives */
angular.module('fcApp.directives').directive('appVersion', ['version',
function(version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}]).directive('execMessageRepeatDirective', function() {
	return function(scope, element, attrs) {
		if(scope.$last) {
			$(".Drildown").getReady({
				barColor : "#E7E7EE"
			});
			$('#DrildownMenuItem' + scope.vModel.openTab).click();
		}
	};
}).directive('rvPopup', function() {
	return {
		restrict : 'E',
		replace : false,
		templateUrl : 'app/templates/report-violation-popup.html'

	}
}).directive('policySummaryContent', ['$timeout',
function(timer) {
	return {
		transclude : true,
		link : function(scope, element, attrs) {
			function afterRender() {
				$.each($('.carousel-content div'), function(i, item) {
					$(item).attr('id', 'content' + i);
					$(item).hide();
				});
				$('.carousel-content div:first-child').show()
			}

			timer(afterRender.bind(element), 0);
		}
	};
}]).directive('loading', function () {
      return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading"><div class="loader-img"></div></div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  });
