angular.module('fcApp').controller('PolicySummaryContentController', ['$scope', '$sce', '$routeParams',
function($scope, $sce, $routeParams) {

	var params = $routeParams.pageKey.split('_');
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', params[0]);

	var calc_num_pages = function() {
		return $('.carousel-content div').length;
	};

	var show_content = function(currentPage) {
		$.each($('.carousel-content div'), function(i, item) {
			$(item).hide();
		});
		$($('.carousel-content div')[currentPage - 1]).show();
	};

	var cp = 1;
	//Update pageData with actual data by fetching from reference.
	pageData = appJson.findBy('pageKey', pageData.reference);
	var subTitle = pageData.title;
	var icon = pageData.titleicon;
	pageData = pageData.items.findBy('nextPage', params[0]);

	$scope.descriptionContent = $sce.trustAsHtml(pageData.descriptionContent);
	$scope.vModel = {
		title : pageData.title,
		subTitle : subTitle,
		icon: icon
	};

	$scope.set_page_shift = function() {
		$.each($('.carousel-content div'), function(i, item) {
			$(item).attr('id', 'content' + i);
			$(item).hide();
		});
		$('.carousel-content div:first-child').show()
	};

	$scope.items = 1;
	// indicator_length;

	$scope.getNumber = function(num) {

		var indicator_length = calc_num_pages();
		$scope.items = indicator_length;

		return new Array(num);
	}
	//console.log($( ".carousel-indicator" ).find( "span" ))
	$(".carousel-indicator").find("span").addClass("active");
	$scope.swipeleft = function($event) {
		var transVal=$('#content').css("-webkit-transform");
		var transValue=[];
		if(transVal != "none"){
			transVal=transVal.split("(");
			transValue=transVal[1].split(",");
		}
		else{
			transValue[0]=0.999;
		}
		if(transValue[0] <= 1)
		{
			var np;
			np = cp - 1;
			if(np <= 0)
				return;
			cp = np;
			$(".carousel-indicator").find("span").removeClass("active");
			$(".carousel-indicator").find("span").removeClass("value1");
			$(".carousel-indicator").find("span:nth-child(" + cp + ")").addClass("active");
			show_content(cp);
		}
	}
	$scope.swiperight = function($event) {
		var transVal=$('#content').css("-webkit-transform");
		var transValue=[];
		if(transVal != "none"){
			transVal=transVal.split("(");
			transValue=transVal[1].split(",");
		}
		else{
			transValue[0]=0.999;
		}
		if(transValue[0] <= 1)
		{
			var np;
			np = cp + 1;
			if(np > calc_num_pages())
				return;
			cp = np;
			$(".carousel-indicator").find("span").removeClass("active");
			$(".carousel-indicator").find("span").removeClass("value1");
			$(".carousel-indicator").find("span:nth-child(" + cp + ")").addClass("active");
			show_content(cp);
		}
	}
	$scope.set_page_shift();
}]);
