angular.module('fcApp').controller('SlideMenuController', ['$scope', '$rootScope', '$location',
function($scope, $rootScope, $location) {

	var appJson = JSON.parse(localStorage.getItem('appJson'));

	$scope.vModel = {
		menuItems : appJson.findBy('pageKey', 'slide-menu').items
	};

	$scope.vEvent = {
		closeSlideMenu : function() {
			$('.content-scroller').css('overflow-y','auto');
			$scope.globalModel.isMenuOpen = false;
		},
		searchApp : function() {
			localStorage.removeItem('searchTerm');
			$location.path('/search');
		},
		openUrl : function(link) {
			window.open(link, '_blank');
		}
	}
}]);
