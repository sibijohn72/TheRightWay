angular.module('fcApp').controller('LanguageSelectController', function($scope, ENV, NativeService, $http, $location) {

	$scope.vModel = {
		showTcLink : false,
		hideBack : true
	};

	$scope.vEvents = {
		initApp : function() {
			var selectedLanguage = $scope.vModel.languages.findBy('code', $scope.vModel.selectedLanguage);
			var jsonPath = "";
			if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
				jsonPath = selectedLanguage.bundlePath;
			} else {
				jsonPath = ENV.bundlePath + $scope.vModel.selectedLanguage + '/app.json';
			}
			if(localStorage.getItem('appLanguage') == selectedLanguage.code) {
				if(localStorage.getItem('appLanguageVersion') == selectedLanguage.version) {
					$location.path('/home');
				} else {
					$scope.bundleCall(jsonPath, selectedLanguage);
				}
			} else {
				$scope.bundleCall(jsonPath, selectedLanguage);
			}
		},
		showLongTc : function() {
			window.open(ENV.longTcUrl, '_blank');
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
		$scope.loading = true;
		$http.get(jsonPath + "?" + new Date()).success(function(response) {
			$scope.loading = false;
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
				navigator.notification.alert(ENV.updateMsg, null, 'Settings', 'OK');
			}
			$scope.vModel.languages = response.languages;
		}).error(function() {
			$scope.loading = false;
			if($scope.vModel.hideBack) {
				navigator.notification.alert(ENV.errorMsg, $scope.fetchLanguages, 'Settings', 'Retry');
			} else {
				var list = [];
				list.push(JSON.parse(localStorage.getItem('appLanguagePack')));
				list[0].isNew = false;
				$scope.vModel.languages = list;
				navigator.notification.alert(ENV.errorMsg, null, 'Settings', 'OK');
			}

		});

	};

	$scope.bundleCall = function(jsonPath, selectedLanguage) {
		$scope.loading = true;
		localStorage.setItem('appLanguagePack', JSON.stringify(selectedLanguage));
		NativeService.fetchJsonBundle(jsonPath, selectedLanguage, function(response) {
			localStorage.setItem('appJson', JSON.stringify(response));
			localStorage.setItem('appLanguage', selectedLanguage.code);
			localStorage.setItem('appLanguageVersion', selectedLanguage.version);
			$location.path('/home');
			$scope.loading = false;
		}, function() {
			if($scope.vModel.hideBack) {
				navigator.notification.alert(ENV.errorMsg, $scope.bundleCall, 'Settings', 'Retry');
			} else {
				navigator.notification.alert(ENV.errorMsg, null, 'Settings', 'OK');
			}
		});
	};

	$scope.fetchLanguages();

});
