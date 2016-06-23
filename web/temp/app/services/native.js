'use strict';

angular.module('fcApp.services').factory('NativeService', ['ENV', '$http', '$timeout', '$rootScope',
function(ENV, $http, $timeout, $rootScope) {
    return {

        alert : function(message, alertCallback, title, buttonText) {			
            if(navigator.notification) {
                navigator.notification.alert(message, alertCallback, title, buttonText);
            } else {
                alertCallback();
            }
        },

        fetchJsonBundle : function(selectedLanguage, successCb, errorCb) {
            if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
                cordova.exec(function(result) {
                    localStorage.setItem('bundle-url', result);
                    $http.get(result + selectedLanguage.code+ "/app.json"  + "?" + new Date(), {cache: false}).success(successCb);
                }, function(error) {
                    errorCb();
                }.bind(this), "DownloadZip", "DownloadFile", [selectedLanguage.bundlePath, selectedLanguage.code, selectedLanguage.version]);
            } else {
                $http.get(selectedLanguage.bundlePath + "?" + new Date(), {cache: false}).success(successCb);
            }
        },
        
        downloadPDFfromUrl: function(url, successCb, errorCb) {            
            if(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
                $timeout(function() {
                    $rootScope.loading = true;
                });
                var forceDownload = false;
                var staticVariables = JSON.parse(localStorage.getItem('appJson')).findBy('pageKey', 'static-labels').items;
                var downloadStaticTexts = [staticVariables["donwloadMsg"],staticVariables["downloadProgressMsg"],staticVariables["rightWayTitle"],staticVariables["downloadTxt"],staticVariables["cancelButtonText"]];
                $http.get(ENV.serverPath + "languages.json?" + new Date()).success(function(response) {
                    var language = response.languages.findBy('code', localStorage.getItem('appLanguage'));
                    if(parseInt(localStorage.getItem('codeOfConductHandbookVersion')) != language.codeOfConductHandbookVersion){
                        forceDownload= true;
                    }
                    $rootScope.loading = false;
                    cordova.exec(function(result) {
                        if(result.indexOf('Cancel') === -1){
                            localStorage.setItem('codeOfConductHandbookVersion', language.codeOfConductHandbookVersion);
                            successCb(result);
                        }
                    }, function(error) {
                        errorCb();
                    }.bind(this), "DownloadPdf", "DownloadFile", [url, forceDownload,downloadStaticTexts]);
                }).error(function() {
                    $rootScope.loading = false;
                    cordova.exec(function(result) {
                        if(result.indexOf('Cancel') === -1){
                            successCb(result);
                        }
                    }, function(error) {
                        errorCb();
                    }.bind(this), "DownloadPdf", "DownloadFile", [url, forceDownload,downloadStaticTexts]);
                });
            } else {
                successCb(url);
            }
        },

        fetchTwitterFeed : function(successCb, errorCb) {
            var twitterAPIurl = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=";
            var tweeterURL = twitterAPIurl + "ToGoRightWay" + "&include_rts=1&count=" + 1;
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
