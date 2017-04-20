angular.module('fcApp').controller('GiftsFavorsController', ['$scope', '$routeParams',
function($scope, $routeParams) {
	var appJson = JSON.parse(localStorage.getItem('appJson'));

	$scope.vModel = {
		items : appJson.findBy('pageKey', $routeParams.pageKey).items,
		title : appJson.findBy('pageKey', $routeParams.pageKey).title
	};
}]); 