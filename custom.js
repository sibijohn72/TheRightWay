angular.module('fcApp').controller('CustomController', function($scope, $routeParams, $location, NativeService, ENV, $rootScope, $timeout) {
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	console.log("page key : "+JSON.stringify(appJson.findBy('pageKey', $routeParams.pageKey)));
	$scope.vModel = {
		title : appJson.findBy('pageKey', $routeParams.pageKey).title,
		content : appJson.findBy('pageKey', $routeParams.pageKey).content
		};	
});
