'use strict';

angular.module('fcApp.filters', []);
angular.module('fcApp.services', []);
angular.module('fcApp.directives', []);

angular.module('fcApp', ['ngRoute', 'config', 'fcApp.filters', 'fcApp.services', 'fcApp.directives', 'ngTouch']).run(['$rootScope',
function($rootScope) {

	$rootScope.globalEvents = {
		toggleMenu : function() {
		    if($rootScope.globalModel.isMenuOpen){
		        $('.content-scroller').css('overflow-y','auto');
		    }else{
		        $('.content-scroller').css('overflow-y','hidden');
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
	//String Classify
	String.prototype.classify = function() {
		var arr = this.split('-');
		return arr.reduce(function(p, n) {
			return p += n.charAt(0).toUpperCase() + n.slice(1)
		}, '');
	}
}]);
