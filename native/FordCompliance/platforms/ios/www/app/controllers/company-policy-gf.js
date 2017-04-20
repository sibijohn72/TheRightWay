angular.module('fcApp').controller('CompanyPolicyGfController', ['$scope', '$routeParams',
function($scope, $routeParams) {
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	console.log($routeParams.pageKey);
	$scope.vModel = {

		items : appJson.findBy('pageKey', $routeParams.pageKey).items
	};
}]); 