'use strict';

angular.module('fcApp.services').factory('NativeService', ['ENV', '$http',
function(ENV, $http) {
	return {

		alert : function(message, alertCallback, title) {
			if(navigator.notification) {
				navigator.notification.alert(message, alertCallback, title, 'OK');
			} else {
				alert(message);
				alertCallback();
			}
		},

		fetchJsonBundle : function(url, selectedLanguage, successCb, errorCb) {
			if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
				cordova.exec(function(result) {
					localStorage.setItem('bundle-url', result);
					$http.get(result + "app.json").success(successCb);
				}, function(error) {
					errorCb();
				}.bind(this), "DownloadZip", "DownloadFile", [url, selectedLanguage.code, selectedLanguage.version]);
			} else {
				$http.get(url).success(successCb);
			}
		},

		fetchTwitterFeed : function(successCb, errorCb) {
			var twitterAPIurl = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=";
			var tweeterURL = twitterAPIurl + "fordteam" + "&include_rts=1&count=" + 1;
			var token = "Bearer AAAAAAAAAAAAAAAAAAAAAFKgZAAAAAAAPXUPKPzRDyOnpklUwdjz42hrf5Q%3DTGyzuXGBdIYvaCx4HNvBp1j4fXO4pTSAPkFwWWBj1YnItSM0mf";
			$http({
				method : 'GET',
				url : tweeterURL,
				headers : {
					'Authorization' : token
				}
			}).success(successCb, status);
		}
	};
}]);
