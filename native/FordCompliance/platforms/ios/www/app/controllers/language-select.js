angular.module('fcApp').controller('LanguageSelectController', function($scope, ENV, NativeService, $http, $location, $rootScope) {

	$scope.vModel = {
		showTcLink : false,
		hideBack : true
	};

	$scope.vEvents = {
		initApp : function() {
			var selectedLanguage = $scope.vModel.languages.findBy('code', $scope.vModel.selectedLanguage);
			if(!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
				selectedLanguage.bundlePath = ENV.bundlePath + $scope.vModel.selectedLanguage + '/app.json';
			}
            
			if(localStorage.getItem('appLanguage') == selectedLanguage.code) {
				if(localStorage.getItem('appLanguageVersion') == selectedLanguage.version) {
					$location.path('/home');
				} else {
					$rootScope.bundleCall(selectedLanguage);
				}
			} else {
				$rootScope.bundleCall(selectedLanguage);
			}
		},
		showLongTc : function() {
			window.open(ENV.longTcUrl, '_system');
		}
	};

	$scope.fetchLanguages = function() {
		var jsonPath = "";
		if(localStorage.getItem('appLanguage')) {
			$scope.vModel.showTcLink = true;
			$scope.vModel.hideBack = false;
		}
		if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
			jsonPath = ENV.serverPath + 'languages.json';
		} else {
			jsonPath = ENV.bundlePath + 'languages.json';
		}
		$rootScope.loading = true;
		$http.get(jsonPath + "?" + new Date()).success(function(response) {
			$rootScope.loading = false;
			var updateFlag = false;
			$scope.vModel.selectedLanguage = localStorage.getItem('appLanguage') || response.languages[0].code;
			if(localStorage.getItem('appLanguageVersion')) {
				for(var i = 0; i < response.languages.length; i++) {
					if(response.languages[i].version > parseInt(localStorage.getItem('appLanguageVersion')) && response.languages[i].code == localStorage.getItem('appLanguage')) {
						response.languages[i].isNew = true;
						updateFlag = true;
					} else {
						response.languages[i].isNew = false;
					}
				}
			}
			if(updateFlag){
			    NativeService.alert(ENV.updateMsg, null, 'Settings', 'OK');
			}
			$scope.vModel.languages = response.languages;
		}).error(function() {
			$rootScope.loading = false;
			if($scope.vModel.hideBack) {
			    NativeService.alert(ENV.errorMsg, $scope.fetchLanguages, 'Settings', 'Retry');
			} else {
				var list = [];
				list.push(JSON.parse(localStorage.getItem('appLanguagePack')));
				list[0].isNew = false;
				$scope.vModel.languages = list;
				NativeService.alert(ENV.errorMsg, null, 'Settings', 'OK');
			}
		});

	};

	$scope.checkStaticLables			= function(){		


		if(!$rootScope.staticLabels){
			if(localStorage.getItem('appJson')){
				if(JSON.parse(localStorage.getItem('appJson')).findBy('pageKey', 'static-labels'))
					$rootScope.staticLabels = JSON.parse(localStorage.getItem('appJson')).findBy('pageKey', 'static-labels').items;
			}
			else{
				$rootScope.staticLabels 	= {

					"settings" 				: "Settings",
					"languageSettings" 		: "Language Settings",
					"new" 					: "New",
					"viewTermsAndConditions": "View Terms and Conditions",
					"submit" 				: "Submit"
				}	
			}				
			
		}	
						
		
	};

	$scope.fetchLanguages();
	$scope.checkStaticLables();

});
