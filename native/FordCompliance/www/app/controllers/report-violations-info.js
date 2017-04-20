angular.module('fcApp').controller('ReportViolationsInfoController', ['$scope', '$sce', '$routeParams', '$location',
function($scope, $sce, $routeParams, $location) {
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', $routeParams.pageKey);
	pageData = appJson.findBy('pageKey', pageData.reference);
	$scope.vModel = {
		information : $sce.trustAsHtml(pageData.information),
		title : pageData.title,
		nextPage : pageData.pageKey
	};
	$scope.vEvent = {
		proceedClick : function(page) {
			$location.path('/' + page);
		}
	};
}]);
