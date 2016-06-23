angular.module('fcApp').controller('FeedbackController', ['$scope', '$routeParams',
function($scope, $routeParams) {
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', $routeParams.pageKey);
	$scope.vModel = {
		title : pageData.title,
		descriptionContent : pageData.descriptionContent,
		mail : pageData.mail
	};
}]);
