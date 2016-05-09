angular.module("config", [])

.constant("ENV", {
	"bundlePath": "./bundles/",
	"defaultLang": "en",
	"serverPath": "10.230.233.4:81/bundles/",
	"longTcUrl": "http://public.extsp.ford.com/sites/MobileAppLegalTerms/Documents/Ford%20Compliance%20App%20TCs.pdf",
	"errorMsg": "Server communication failed. Please check your connectivity and try again.",
	"updateMsg": "New language update avalible."
})

;