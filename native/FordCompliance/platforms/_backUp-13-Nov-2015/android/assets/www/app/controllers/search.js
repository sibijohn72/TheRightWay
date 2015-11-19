angular.module('fcApp')
.controller('SearchController', ['$scope', 'NativeService', '$routeParams', function($scope, NativeService, $routeParams) {
    var appJson = JSON.parse(localStorage.getItem('appJson'));
    var keys = appJson.findBy('pageKey', 'search-keys').keys;

    $scope.vModel = {
    	searchText: '',
    	title: 'Search'
    };

    $scope.vEvents = {
    	searchApp: function() {
    		var searchText = $scope.vModel.searchText.trim();
    		if(!searchText) {
                NativeService.alert('You must enter a search term.', function(){}, 'Ford Compliance');
    		} else {
    			localStorage.setItem('searchTerm', searchText);
    			var results = search(searchText, keys);
    			if(results.length) {
    				$scope.vModel.items = results;
    			} else {
    				$scope.vModel.items = [];
    				NativeService.alert('No results were found.', function(){}, 'Ford Compliance');
    			}
    		}    		
    	}
    };

    //if coming from home screen
    var searchText = localStorage.getItem('searchTerm');
    //localStorage.removeItem('searchTerm');
    if(searchText) {
   	 	$scope.vModel.searchText = searchText;
   	    $scope.vEvents.searchApp();
    }

	function search(searchKey, searchKeys) {
		var urls = [];
		searchKey = searchKey.toLowerCase();

		//extract excerpt
		function extractExcerpt(str, index) {
			// var limit = 50;
			// var length = str.length;
			// var start, end;
			
			// if((length - index) >= limit) {
			// 	start = index;
			// } else {
			// 	start = index;
			// }
			// end = start+limit;
	        
	        // return str.substring(start, end) + '...';
	        return str.substring(0, 100) + '...';

	   	}

	    //Search the policy summary section
	    function searchPolicySummary(data) {
	    	var policySummry = data.items[0];

	    	if(policySummry.description) {
		        var index = policySummry.description.toLowerCase().indexOf(searchKey);        
		        if(index >= 0) {
		            urls.push({
		            	url: policySummry.nextPage,
		                excerpt: extractExcerpt(policySummry.description, index)
		            });
		        }
	    	}
	    }

	    //Search the common policy section
	    function searchFAQs(data) {
	    	var fAQs = data['frequently-asked-questions'];

	        fAQs.forEach(function(example, index) {
	        	var questionIndex = example.question.toLowerCase().indexOf(searchKey);
	            var answerIndex = example.answer.toLowerCase().indexOf(searchKey);
	            if(questionIndex >= 0) {
	            	urls.push({
	            		url: example.nextPage +'_'+ index,
	                	excerpt: extractExcerpt(example.question, index)
	            	});
	            } else if(answerIndex >= 0) {
	            	urls.push({
	            		url: example.nextPage +'_'+ index,
	                	excerpt: extractExcerpt(example.answer, index)
	            	});
	            }
	        });
	    }

	    //Loop through each key and fetch data object
	    searchKeys.forEach(function(item) {
	    	var dataObject = appJson.findBy('pageKey', item);

	    	searchPolicySummary(dataObject);
	    	searchFAQs(dataObject);
	    });

	    return urls;
	}


}]);