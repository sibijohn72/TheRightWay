angular.module('fcApp').controller('FooterController', ['$scope', '$routeParams', '$compile', '$location',
function($scope, $routeParams, $compile, $location) {
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', 'slide-menu').items;
	$scope.vModel = {
		cocLink : pageData.findBy('pageId', 'mi-coc').link
	};

	$scope.vEvent = {
		reportViolationClick : function() {
			$location.path('/report-violations-info');
		},
		handbookClick : function(link) {
			window.open(link, '_blank');
		}
	}
}]);
