angular.module('fcApp').controller('ContactForQuestionsController', ['$rootScope', '$scope', '$routeParams',
function($rootScope, $scope, $routeParams) {

	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', $routeParams.pageKey);
	$scope.showPopup = false;
	$scope.vModel = {
		title : pageData.title,
		items : pageData.items
	};
}]);
