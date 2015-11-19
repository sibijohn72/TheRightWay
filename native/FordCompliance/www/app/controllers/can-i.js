angular.module('fcApp').controller('CanIController', function($scope, $routeParams, $compile) {
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', $routeParams.pageKey);
	pageData = appJson.findBy('pageKey', pageData.reference);

	var index = 0;

	$scope.vModel = {
		title : pageData.canITitle.split('?')[0] + ' (' + pageData.title + ')?',
		items : pageData['can-i'],
		reminder : pageData.canIReminder
	};

	$scope.selectChange = function(index) {

		// $('.cani-txt-contnt:eq('+index+')').remove();

		// var newIndex = index + 1;
		// var selectedItem = $scope.$eval('selectedItem' + index);
		// var template = '';
		// // for(var i = $('.cani-item').length; i > index; i--) {
		// //  	$('.cani-item:eq(' +i+ ')').remove();
		// // }

		// for(var i = $('.content-scroller select').length; i > index; i--) {
		// 	$('[ng-model="selectedItem' + i + '"]').parent('span').next('.cani-txt-contnt').remove();
		//  	$('[ng-model="selectedItem' + i + '"]').parent('span').remove();
		// }

		var newIndex = index + 1;
		var selectedItem = $scope.$eval('selectedItem' + index);
		var template = '';
		// for(var i = $('.cani-item').length; i > index; i--) {
		//  	$('.cani-item:eq(' +i+ ')').remove();
		// }

		for(var i = $('.content-scroller select').length-1; i >= index; i--) {
			$('[ng-model="selectedItem' + i + '"]').parent('span').next('.cani-txt-contnt').remove();

			if(i != index) {
				$('[ng-model="selectedItem' + i + '"]').parent('span').remove();
			}
		}
		
		// if(selectedItem) {
		// 	if(selectedItem.items) {
		// 		var template = '<span class="fields"><select ng-model="selectedItem' + newIndex + '" ng-change="selectChange(' + newIndex + ')" ng-options="item.title for item in ' + 'selectedItem' + index + '.items">';
		// 		template = template + '<option value="">Select an option</option></select> </span>';
		// 		$('.content-scroller').append($compile(template)($scope));
		// 	} else {
		// 		$('.content-scroller').append("<div id='resultText' class='cani-txt-contnt'>" + selectedItem.text + "</div>");
		// 	}
		// }
        
        //template += '<div class="cani-item">';
		if(selectedItem) {
			if(selectedItem.text) {
				template += '<div class="cani-txt-contnt">' + selectedItem.text + '</div>';
			}

			if(selectedItem.items) {
				template += '<span class="fields"><select ng-model="selectedItem' + newIndex + '" ng-change="selectChange(' + newIndex + ')" ng-options="item.title for item in ' + 'selectedItem' + index + '.items">';
				template += '<option value="">Select an option</option></select> </span>';
			}
		}
		//template += '</div>';
		$('.content-scroller').append($compile(template)($scope));
	};
});
