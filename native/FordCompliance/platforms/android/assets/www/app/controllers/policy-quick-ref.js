angular.module('fcApp').controller('PolicyQuickRefController', ['$scope', '$routeParams', '$sce',
function($scope, $routeParams, $sce) {

	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', $routeParams.pageKey);
	var subTitle = appJson.findBy('pageKey', pageData.reference).title;
	var icon = appJson.findBy('pageKey', pageData.reference).titleicon;
	//Update pageData with actual data by fetching from reference.
	pageData = appJson.findBy('pageKey', pageData.reference).items.findBy('nextPage', $routeParams.pageKey);
	$scope.vModel = {
		links : pageData.items.filter(function(item) {return item.link.length;}),
		docs: pageData.items.filter(function(item) {return !item.link.length;}),
		title : pageData.title,
		subTitle : subTitle,
		icon : icon

	};

	$scope.vEvents = {
		parseHtml: function(content){
			return $sce.trustAsHtml(content);
		}
	}


}]);
