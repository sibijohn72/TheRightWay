angular.module('fcApp').controller('PageController', ['$scope', 'ENV', '$routeParams',
function($scope, ENV, $routeParams) {

	//$scope.items = $.grep(APP, function(e){ return e.id == $stateParams.jsonPath; })[0].items;
	$scope.items = APP.getObjectBy($routeParams.jsonPath).items;

	$scope.goToNextPage = function() {
		$state.go('page', {
			jsonPath : 'dynamic'
		});
	}

	$scope.createUrl = function(path) {
		return $routeParams.jsonPath + '-' + path;
	}
}]); 