angular.module('fcApp').controller('SlideMenuController', ['$scope', '$rootScope', '$location', 'ENV', 'NativeService',
function($scope, $rootScope, $location, ENV, NativeService) {

	var appJson = JSON.parse(localStorage.getItem('appJson'));
	$scope.vModel = {
		menuItems : appJson.findBy('pageKey', 'slide-menu').items
	};

	$scope.vEvent = {
		closeSlideMenu : function() {
			$('.content-scroller').css('overflow-y','auto');
			$('.content-scroller').css('-webkit-overflow-scrolling','touch');
			$scope.globalModel.isMenuOpen = false;
		},
		searchApp : function() {
			localStorage.removeItem('searchTerm');
			$location.path('/search');
		},
		openUrl : function(link) {
            $scope.loading = true;
            if(navigator.notification){
                NativeService.downloadPDFfromUrl(link, function(response) {
                    if(device.platform == "iOS"){
                        window.open(response, '_blank', 'location=no,EnableViewPortScale=yes');
                    }else{
                        window.open(response, "_system", "location=no");
                    }
                }, function(e){
                    navigator.notification.alert(ENV.errorMsg, null, 'The Right Way', 'Cancel');
                });  
            }
		}
	}
}]);
