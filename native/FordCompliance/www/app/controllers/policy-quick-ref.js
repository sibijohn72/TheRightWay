angular.module('fcApp').controller('PolicyQuickRefController', ['$scope', '$routeParams',
function($scope, $routeParams) {

	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', $routeParams.pageKey);
	var subTitle = appJson.findBy('pageKey', pageData.reference).title;
	var icon = appJson.findBy('pageKey', pageData.reference).titleicon;
	//Update pageData with actual data by fetching from reference.
	pageData = appJson.findBy('pageKey', pageData.reference).items.findBy('nextPage', $routeParams.pageKey);
	$scope.vModel = {
		items : pageData.items,
		title : pageData.title,
		subTitle : subTitle,
		icon : icon

	};

}]);
