angular.module('fcApp').controller('ExecMessagesController', ['$scope', '$routeParams', '$sce', 'ENV',
function($scope, $routeParams, $sce, ENV) {
	var params = $routeParams.pageKey.split('_');
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', params[0]);

	$scope.vModel = {
		title : pageData.title,
		items : pageData.items,
		openTab : params[1] ? params[1] : 0
	};

	$scope.vEvent = {
		showItemContent : function(item) {
			return $sce.trustAsHtml(item);
		},
		openInAppBrowser: function(url){
			window.open(url, '_blank');
		}
	};
}]);
