angular.module('fcApp').controller('ContactForQuestionsController', ['$rootScope', '$scope', '$routeParams', '$location',
function($rootScope, $scope, $routeParams, $location) {

	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', $routeParams.pageKey);
	$scope.showPopup = false;
	$scope.vModel = {
		title : pageData.title,
		items : pageData.items
	};
	$scope.vEvents={
		openFeedback: function(){
			$location.path('/feedback');
		}
	}
}]);
