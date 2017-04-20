angular.module('fcApp').controller('StaticController', ['$scope', '$routeParams', '$compile', '$sce',
function($scope, $routeParams, $compile, $sce) {
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', $routeParams.pageKey);
	var index = 0;

	$scope.vModel = {
		title : pageData.title,
		descriptionContent : $sce.trustAsHtml(pageData.descriptionContent)
	};

}]);
