angular.module('fcApp').controller('CanIController', function($scope, $routeParams, $compile) {
	var appJson = JSON.parse(localStorage.getItem('appJson'));
	var pageData = appJson.findBy('pageKey', $routeParams.pageKey);
	pageData = appJson.findBy('pageKey', pageData.reference);
	var staticKeys = appJson.findBy('pageKey', 'static-labels').items;	
	var index = 0;

	$scope.vModel = {
		title : pageData.canITitle.split('?')[0] + ' (' + pageData.title + ')?',
		items : pageData['can-i'],
		reminder : pageData.canIReminder
	};
	
	$scope.selectChange = function(index) {
		var newIndex = index + 1;
		var selectedItem = $scope.$eval('selectedItem' + index);
		var template = '';
		for(var i = $('.content-scroller select').length-1; i >= index; i--) {
			$('[ng-model="selectedItem' + i + '"]').parent('span').next('.cani-txt-contnt').remove();

			if(i != index) {
				$('[ng-model="selectedItem' + i + '"]').parent('span').remove();
			}
		}
		if(selectedItem) {
			var text;
			if(selectedItem.reference) {
				text = appJson.findBy('pageKey', selectedItem.reference).descriptionContent;
			} else if(selectedItem.text) {
				text = selectedItem.text;
			}

			if(text) {
				template += '<div class="cani-txt-contnt">' + text + '</div>';
			}			
			if(selectedItem.items) {
				template += '<span class="fields"><select ng-model="selectedItem' + newIndex + '" ng-change="selectChange(' + newIndex + ')" ng-options="item.title for item in ' + 'selectedItem' + index + '.items">';
				template += '<option value="">'+staticKeys.selectAnOption+'</option></select> </span>';
			}
		}
		$('.content-scroller').append($compile(template)($scope));
		//$('.content-scroller select').append('<optgroup label=""></optgroup>');
	};
});
