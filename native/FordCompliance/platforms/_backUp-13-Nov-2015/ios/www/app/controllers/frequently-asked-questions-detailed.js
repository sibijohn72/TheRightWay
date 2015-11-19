angular.module('fcApp').controller('FrequentlyAskedQuestionsDetailedController', ['$scope', '$routeParams', '$sce',
function($scope, $routeParams, $sce) {

	var params = $routeParams.pageKey.split('_');

	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', params[0]);
	$scope.vModel = {};
	$scope.vModel.title = pageData.title;
	$scope.vModel.subTitle = appJson.findBy('pageKey', pageData.reference).title;
	$scope.vModel.icon = appJson.findBy('pageKey', pageData.reference).titleicon;

	//Update pageData with actual data by fetching from reference.
	pageData = appJson.findBy('pageKey', pageData.reference)['frequently-asked-questions'][params[1]];

	$scope.vModel.question = pageData.question, $scope.vModel.answer = $sce.trustAsHtml(pageData.answer);

}]);
