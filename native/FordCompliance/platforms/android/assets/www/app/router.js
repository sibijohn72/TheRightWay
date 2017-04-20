angular.module('fcApp').config(['$routeProvider',
function($routeProvider) {
	var appJson = null;
    var otherwiseRoute = function() {
    	var path = {
			redirectTo : '/language-select'
		};
        if(localStorage.getItem('appLanguage')) {
            path.redirectTo = '/home';
        } else {
            path.redirectTo = '/language-select';
        }
		return path;
    };

	$routeProvider.when('/language-select', {
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
}]).run(function($rootScope, $location, $timeout) {

	//Setting some page relationships for scroll saving.
	var pageRelations = [{
		pageKey: 'faq-gifts-favors',
		nextPageKey: 'faq-gifts-favors-detailed'
	}, {
		pageKey: 'faq-meals-travels',
		nextPageKey: 'faq-meals-travels-detailed'
	}, {
		pageKey: 'faq-conflicts-of-interest',
		nextPageKey: 'faq-conflicts-of-interest-detailed'
	}, {
		pageKey: 'faq-company-assets',
		nextPageKey: 'faq-company-assets-detailed'
	}, {
		pageKey: 'faq-anti-bribery-corruption',
		nextPageKey: 'faq-anti-bribery-corruption-detailed'
	}, {
		pageKey: 'faq-it-security-and-privacy',
		nextPageKey: 'faq-it-security-and-privacy-detailed'
	}, {
		pageKey: 'faq-working-together',
		nextPageKey: 'faq-working-together-detailed'
	}, {
		pageKey: 'faq-tips-for-managers',
		nextPageKey: 'faq-tips-for-managers-detailed'
	}, {
		pageKey: 'search',
		nextPageKey: ''
	}];

	$rootScope.$on("$routeChangeStart", function(event, next, current) {
		$rootScope.globalModel.isMenuOpen = false;

		//If current page is a relationship page we save the scroll position.		
		if(current) {
	        var relationalPage = pageRelations.findBy('pageKey', current.params.pageKey);
	        if(relationalPage) {
	        	localStorage.setItem('scroll-'+current.params.pageKey, $('.content-scroller').scrollTop());
	        }
	    }
	});

	$rootScope.$on('$routeChangeSuccess', function(event, next, current) {

		//If you enter a certain page other than the specified next page, the scroll position will be cleared
		//else the saved value will be used.
		if(current) {
	      	$timeout(function() {
		      	var relationalPage = pageRelations.findBy('pageKey', next.params.pageKey);
		        if(relationalPage) {
		        	if(current.params.pageKey.indexOf(relationalPage.nextPageKey) > -1) {
		        		var scrollPos = parseInt(localStorage.getItem('scroll-'+next.params.pageKey));
                        $('.content-scroller').scrollTop(scrollPos);
                        $("body").append('<div class="iosFixedFix"></div>');
                        setTimeout(function(){$(".iosFixedFix").remove();}, 1);
			        } else {
			        	localStorage.removeItem('scroll-'+next.params.pageKey);
			        }
			    }
	      	});
      	}
   	});
});
