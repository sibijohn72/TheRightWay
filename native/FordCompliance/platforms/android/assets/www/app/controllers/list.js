angular.module('fcApp').controller('ListController', ['$scope', '$routeParams',
function($scope, $routeParams) {
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', $routeParams.pageKey);

	//Update pageData with actual data by fetching from reference.
	pageData = appJson.findBy('pageKey', pageData.reference);

	$scope.vModel = {
		title : pageData.title,
		items : pageData.items
	}

}]); 