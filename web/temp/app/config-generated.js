angular.module("config", [])

.constant("ENV", {
	"bundlePath": "./bundles/",
	"defaultLang": "en",
	"serverPath": "http://10.243.194.11:8088/Compliance/",
	"longTcUrl": "http://public.extsp.ford.com/sites/MobileAppLegalTerms/Documents/Ford%20Compliance%20App%20TCs.pdf",
	"errorMsg": "Server communication failed. Please check your connectivity and try again.",
	"updateMsg": "New content update is available."
})

;