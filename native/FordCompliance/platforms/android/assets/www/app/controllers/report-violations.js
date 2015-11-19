angular.module('fcApp').controller('ReportViolationsController', ['$rootScope', '$scope', '$routeParams',
function($rootScope, $scope, $routeParams) {

	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', $routeParams.pageKey);
	$scope.showPopup = false;
	$scope.vModel = {
		title : pageData.title,
		items : pageData.items
	};

	$scope.vEvents = {};

	$scope.vEvents.rvPopupOpen = function(index) {
		//$rootScope.rvIndex = index;
		$scope.rvIndex = index;
		$scope.showPopup = true;
	}
	
	$scope.vEvents.rvPopupClose = function(vModel) {
		$scope.showPopup = false;
	}
}]);
