angular.module('fcApp').controller('ContactGridController', function($scope, $routeParams, $location) {
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', $routeParams.pageKey);

	var gridItems = [];
	pageData.items.forEach(function(item) {
		var obj = appJson.findBy('pageKey', item.reference);
		obj.nextPage = item.nextPage;
		gridItems.push(obj);
	});

	$scope.vModel = {
		title : pageData.title,
		items : gridItems
	};
    
    $scope.vEvents={
		openFeedback: function(){
			$location.path('/feedback');
		}
	}

}); 