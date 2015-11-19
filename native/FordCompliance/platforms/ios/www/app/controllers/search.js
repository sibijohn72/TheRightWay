angular.module('fcApp')
.controller('SearchController', ['$scope', 'NativeService', '$routeParams', '$sce', function($scope, NativeService, $routeParams, $sce) {
    var appJson = JSON.parse(localStorage.getItem('appJson'));
    var indexes = appJson.findBy('pageKey', 'search-page-keys').keys;
    var keys = appJson.findBy('pageKey', 'search-key-words').keys;

    $scope.vModel = {
    	searchText: '',
    	title: 'Search'
    };

    $scope.vEvents = {
    	searchApp: function() {
            $(".search-txt").blur();
    		var searchText = $scope.vModel.searchText.trim();
    		if(!searchText) {
                NativeService.alert('You must enter a search term.', function(){}, 'The Right Way', 'OK');
    		} else {
    			localStorage.setItem('searchTerm', searchText);

    			//in case multiple words are in the search string.
    			var searchWord = searchText.split(' ');

    			//Get the keywords asscociated with this search word.
    			var searchWords = keys.filter(function(item) {
    				return item.inArray(searchWord);
    			});

    			searchWords = searchWords.length? searchWords : [[searchWord]];
    			searchWords = searchWords.flatten();

    			//Make sure the words in the search text are in the searchWords array.
    			searchWord.forEach(function(item) {
                    if(!searchWords.inArray(item)) {
                    	searchWords.push(item);
                    }
    			});

    			var results = search(searchWords, indexes);
    			if(results.length) {
    				$scope.vModel.items = results;
    			} else {
    				$scope.vModel.items = [];
    				NativeService.alert('No results were found.', function(){}, 'The Right Way', 'OK');
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

	function search(words, searchKeys) {
		var urls = [];
		var searchRegEx = new RegExp(words.join('|'), 'i');
		//searchKey = searchKey.toLowerCase();

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
	        return $sce.trustAsHtml(str.substring(0, 100) + '...');

	   	}

	    //Search the policy summary section
	    function searchPolicySummary(data) {
	    	var policySummry = data.items[0];

	    	if(policySummry.description) {
		        // var index = policySummry.description.toLowerCase().indexOf(searchKey);        
		        // if(index >= 0) {
		        //     urls.push({
		        //     	url: policySummry.nextPage,
		        //         excerpt: extractExcerpt(policySummry.description, index)
		        //     });
		        // }

		        var isFound = searchRegEx.test(policySummry.description.toLowerCase());
		        if(isFound) {
		            urls.push({
		            	url: policySummry.nextPage,
		                excerpt: extractExcerpt(policySummry.description)
		            });
		        }
	    	}
	    }

	    //Search the common policy section
	    function searchFAQs(data) {
	    	var fAQs = data['frequently-asked-questions'];

	        fAQs.forEach(function(example, index) {
	        	// var questionIndex = example.question.toLowerCase().indexOf(searchKey);
	         //    var answerIndex = example.answer.toLowerCase().indexOf(searchKey);
	         //    if(questionIndex >= 0) {
	         //    	urls.push({
	         //    		url: example.nextPage +'_'+ index,
	         //        	excerpt: extractExcerpt(example.question, index)
	         //    	});
	         //    } else if(answerIndex >= 0) {
	         //    	urls.push({
	         //    		url: example.nextPage +'_'+ index,
	         //        	excerpt: extractExcerpt(example.answer, index)
	         //    	});
	         //    }

	         	var inQuestion = searchRegEx.test(example.question.toLowerCase());
	            var inAnswer = searchRegEx.test(example.answer.toLowerCase());
	            if(inQuestion) {
	            	urls.push({
	            		url: example.nextPage +'_'+ index,
	                	excerpt: extractExcerpt(example.question, index)
	            	});
	            } else if(inAnswer) {
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