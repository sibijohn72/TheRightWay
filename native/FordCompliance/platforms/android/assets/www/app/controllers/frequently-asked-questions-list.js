angular.module('fcApp').controller('FrequentlyAskedQuestionsListController', ['$scope', '$routeParams', '$sce',
function($scope, $routeParams, $sce) {
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', $routeParams.pageKey);
	$scope.title = pageData.title;

	//Update pageData with actual data by fetching from reference.
	pageData = appJson.findBy('pageKey', pageData.reference);

	$scope.vModel = {
		items : pageData['frequently-asked-questions'].map(function(item) {
            item.question = $sce.trustAsHtml(item.question)
            return item;
		}),
		title : appJson.findBy('pageKey', $routeParams.pageKey).title,
		subTitle : pageData.title,
		icon: pageData.titleicon
	}

}]); 