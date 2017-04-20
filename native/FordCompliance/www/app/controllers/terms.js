angular.module('fcApp').controller('TermsController', ['$scope', '$location', 'ENV',
function($scope, $location, ENV) {

	// if(localStorage.getItem('tc_flag')) {
	// 	if(localStorage.getItem('appLanguage')) {
	// 		$location.path('/home');
	// 	} else {
	// 		$location.path('/language-select');
	// 	}
	// }

	$scope.vEvents = {
		acceptTerms : function() {
			localStorage.setItem('tc_flag', true);
			$location.path('/language-select');
		},
		showLongTC : function() {
			window.open(ENV.longTcUrl, '_blank');
		}
	};

}]);
