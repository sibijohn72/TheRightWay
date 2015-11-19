'use strict';

angular.module('fcApp.filters', []);
angular.module('fcApp.services', []);
angular.module('fcApp.directives', []);

angular.module('fcApp', ['ngRoute', 'config', 'fcApp.filters', 'fcApp.services', 'fcApp.directives', 'ngTouch']).run(['$rootScope', 'NativeService', '$location', 'ENV', '$http', '$timeout', '$route',
function($rootScope, NativeService, $location, ENV, $http, $timeout, $route) {

	$rootScope.globalEvents = {
		toggleMenu : function() {
		    if($rootScope.globalModel.isMenuOpen){
		        $('.content-scroller').css('overflow-y','auto');
		        $('.content-scroller').css('-webkit-overflow-scrolling','touch');
		    }else{
		        $('.content-scroller').css('overflow-y','hidden');
		        $('.content-scroller').css('-webkit-overflow-scrolling','auto');
		    }
			$rootScope.globalModel.isMenuOpen = !$rootScope.globalModel.isMenuOpen;
		},
		goBack : function() {
			window.history.go(-1);
		}
		
	};

	$rootScope.globalModel = {
		isMenuOpen : false
	};

	$rootScope.bundleCall = function(selectedLanguage) {
		localStorage.setItem('appLanguagePack', JSON.stringify(selectedLanguage));
		NativeService.fetchJsonBundle(selectedLanguage, function(response) {
			localStorage.setItem('appJson', JSON.stringify(response));
			localStorage.setItem('appLanguage', selectedLanguage.code);
			localStorage.setItem('appLanguageVersion', selectedLanguage.version);
			if($location.path() == '/home') {
                $route.reload();
			} else {
				$location.path('/home');
			}
			
			$timeout(function() {
			  	$rootScope.syncInProgress = false;
			});
		}, function() {
			$rootScope.syncInProgress = false;
			if($scope.vModel.hideBack) {
			    NativeService.alert(ENV.errorMsg, $rootScope.bundleCall(selectedLanguage), 'Settings', 'Retry');
			} else {
			    NativeService.alert(ENV.errorMsg, null, 'Settings', 'OK');
			}
		});
	};

	//Array find polyfill
	if(!Array.prototype.find) {
		Object.defineProperty(Array.prototype, 'find', {
			enumerable : false,
			configurable : true,
			writable : true,
			value : function(predicate) {
				if(this == null) {
					throw new TypeError('Array.prototype.find called on null or undefined');
				}
				if( typeof predicate !== 'function') {
					throw new TypeError('predicate must be a function');
				}
				var list = Object(this);
				var length = list.length >>> 0;
				var thisArg = arguments[1];
				var value;

				for(var i = 0; i < length; i++) {
					if( i in list) {
						value = list[i];
						if(predicate.call(thisArg, value, i, list)) {
							return value;
						}
					}
				}
				return undefined;
			}
		});
	}

	Array.prototype.findBy = function(key, value) {
		function iter(item) {
			if(item[key] === value) {
				return true;
			}
			return false;
		};

		return this.find(iter);
	}

	//Case insensitive Array.indexOf but will match even sub string.
	Array.prototype.inArray = function(key) {
		var regString = Array.isArray(key)? key.join('|') : key;
		var searchRegEx = new RegExp(regString, 'i');

		return this.some(function(item) {
 			return searchRegEx.test(item);
		});
	}

	//Flatten array
	Array.prototype.flatten = function() {
		var merged = [];
		return merged.concat.apply(merged, this);
	}

	//String Classify
	String.prototype.classify = function() {
		var arr = this.split('-');
		return arr.reduce(function(p, n) {
			return p += n.charAt(0).toUpperCase() + n.slice(1)
		}, '');
	}

	//This will fetch the language json in the background and see if a new version of the bundle is available.
	$rootScope.checkContentUpdate = function () {
		$rootScope.syncInProgress = true;
		var jsonPath = "";
		var selectedLanguage = JSON.parse(localStorage.getItem('appLanguagePack'));
		var langCode = localStorage.getItem('appLanguage');
		var langVersion = localStorage.getItem('appLanguageVersion');

		if(langCode) {
			if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
				jsonPath = ENV.serverPath + 'languages.json';
			} else {
				jsonPath = ENV.bundlePath + 'languages.json';
			}

			$http.get(jsonPath + "?" + new Date()).success(function(response) {
				var language = response.languages.findBy('code', langCode);
				if(language.version > langVersion) {
					
				    NativeService.alert(ENV.updateMsg, function() {
						$rootScope.bundleCall(language);
					}, 'Update', 'OK');
				} else {
					$rootScope.syncInProgress = false;
				}		
			}).error(function() {
				$rootScope.syncInProgress = false;
			});
		}
	}
	document.addEventListener("resume", $rootScope.checkContentUpdate, false);
    document.addEventListener("orientationchange", function(e){
                              var a=$("div[zoomer]")[0].style.webkitTransform.split(" ");
                              var str = a[0].split('(')[0] + "(0px,";
                              for(var i =1 ; i<a.length;i++){str= str+" "+a[i]}
                              $("div[zoomer]")[0].style.webkitTransform = str;
    }, false);
}]);
