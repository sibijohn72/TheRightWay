angular.module('fcApp').controller('HomeController', function($scope, $routeParams, $location, NativeService, ENV, $rootScope, $timeout) {
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', 'exec-messages');
	$scope.vModel = {
		title : appJson.findBy('pageKey', $routeParams.pageKey).title,
		searchText : '',
		hideBack : true,
		twitterContent : false,
		newsList : pageData.items,
		tweet : {
			text : '',
			name : '',
			date : '',
			icon : ''
		},
		sliderLen : pageData.items.length
	};

	var sliderItemIndex = 1;
	window.setInterval(function() {

		var contentLength = $('.news-slider').length;
		var width = (contentLength - 1) * $('.news-slider').width();
		if($('.slider').scrollLeft() >= width) {
			$('.slider').animate({
				scrollLeft : 0
			}, 500);
			sliderItemIndex = 1;
		} else {
			$('.slider').animate({
				scrollLeft : ($('.slider').scrollLeft() + $('.news-slider').width()) + 58
			}, 500);
			sliderItemIndex++;
		}

		$(".slider-indicator").find("span").removeClass("active");
		$(".slider-indicator").find("span:nth-child(" + sliderItemIndex + ")").addClass("active");

	}, 10000);

	NativeService.fetchTwitterFeed(function(response, status) {
		if(status == 200 && typeof response == "object") {
			if(response.length) {
				$scope.vModel.twitterContent = true;
				$scope.vModel.tweet.text = response[0].text;
				$scope.vModel.tweet.name = "@" + response[0].user.screen_name;
				$scope.vModel.tweet.date = $scope.utility.getDate(response[0].created_at);
				$scope.vModel.tweet.icon = response[0].user.profile_image_url;
				$scope.vModel.tweet.id = response[0].id_str;
				$scope.vModel.tweet.screen_name = response[0].user.screen_name;
			}
		} else {
			$scope.vModel.twitterContent = false;
		}
	});
	$scope.vEvents = {
		menu : function() {
			$location.path('/menu');
		},
		searchApp : function() {
            $(".search-txt").blur();
			var searchText = $scope.vModel.searchText.trim();
			if(!searchText) {
				NativeService.alert('You must enter a search term.', function() {
				}, 'The Right Way', 'OK');
			} else {
				localStorage.setItem('searchTerm', searchText);
				$location.path('/search');
			}
		},
		getSliderIndex : function(num) {
			return new Array(num);
		},
		getNewsFeeds : function() {
			if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
				jsonPath = ENV.serverPath + 'news.html';
			} else {
				jsonPath = ENV.bundlePath + 'news.html';
			}
			window.open(jsonPath, '_blank', 'location=yes,EnableViewPortScale=yes');
		},
		getExecMessagePage : function(index) {
			$location.path('/exec-messages_' + index);
		},
		showTweet: function() {
			var tweet = $scope.vModel.tweet;
			window.open('https://twitter.com/'+tweet.screen_name, '_blank', 'location=yes');
		}
	};
	$scope.utility = {
		getDate : function(date) {
			var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
			var dt = new Date(date);
			var date = month[dt.getMonth()] + ". " + dt.getDate() + ", " + dt.getFullYear();
			return date;
		}
	}

	//triggering resume event to see if content update is available. Relevant code is in app.js
	//Wrapped in timeout to delay it till the page is renderred.
	$timeout(function() {
		if(!$rootScope.isfirstSyncCheck && !$rootScope.syncInProgress) {
      		$rootScope.checkContentUpdate();
      		$rootScope.isfirstSyncCheck = true;
		}
	}, 4000);	
});
