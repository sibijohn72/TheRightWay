angular.module('fcApp').config(['$routeProvider',
function($routeProvider) {
	var appJson = null;
    var otherwiseRoute = function() {
    	var path = {
			redirectTo : '/terms'
		};

    	if(localStorage.getItem('tc_flag')) {
			if(localStorage.getItem('appLanguage')) {
				path.redirectTo = '/home';
			} else {
				path.redirectTo = '/language-select';
			}
		}

		return path;
    };

	$routeProvider.when('/terms', {
		templateUrl : './app/templates/terms.html',
		controller : 'TermsController'
	}).when('/language-select', {
		templateUrl : './app/templates/language-select.html',
		controller : 'LanguageSelectController'
	}).when('/:pageKey', {
		templateUrl : function(params) {
			var param = params.pageKey.split('_')[0];

			appJson = appJson ? appJson : JSON.parse(localStorage.getItem('appJson'));
			var pageData = appJson.findBy('pageKey', param);

			var template;
			if(pageData) {
				if(pageData.template) {
					template = 'app/templates/' + pageData.template + '.html';
				} else {
					template = 'app/templates/' + pageData.pageKey + '.html';
				}
			}
			return template;
		},
		controller : function($scope, $routeParams, $controller) {

			var param = $routeParams.pageKey.split('_')[0];

			appJson = appJson ? appJson : JSON.parse(localStorage.getItem('appJson'));
			var pageData = appJson.findBy('pageKey', param);
			var controller;
			if(pageData) {
				if(pageData.controller) {
					controller = pageData.controller.classify() + 'Controller';
				} else {
					controller = pageData.pageKey.classify() + 'Controller';
				}
			}
			return $controller(controller, {
				$scope : $scope
			});
		}
	}).otherwise(otherwiseRoute());
}]).run(function($rootScope, $location) {
	$rootScope.$on("$routeChangeStart", function(event, next, current) {
		$rootScope.globalModel.isMenuOpen = false;
	});
});
