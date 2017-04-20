//
//  Utility.m
//  FordAccountManager
//  Created by Sreejith MV on 4/7/14.
//  For utility functions like internet checking and version check
//

#import "Utility.h"

@implementation Utility
//Checking network is avalible or not
+ (BOOL)isConnectingToInternet
{
    NSURL *url=[NSURL URLWithString:@"http://www.google.com"];
    NSMutableURLRequest *request=[NSMutableURLRequest requestWithURL:url];
    [request setHTTPMethod:@"HEAD"];
    NSHTTPURLResponse *response;
    [NSURLConnection sendSynchronousRequest:request returningResponse:&response error: NULL];
    return ([response statusCode]==200)?YES:NO;
}

//Checking the version of app in app store
+ (NSString *)getAppVerionFromAppStore{
    NSString *appInfoUrl = [NSString stringWithFormat:@"http://itunes.apple.com/lookup?bundleId=com.ford.therightway"] ;
                            //%@", [[NSBundle mainBundle] bundleIdentifier]];
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL:[NSURL URLWithString:appInfoUrl]];
    [request setHTTPMethod:@"GET"];
    NSURLResponse *response;
    NSError *error;
    NSData *data = [NSURLConnection  sendSynchronousRequest:request returningResponse: &response error: &error];
    NSString *output = [NSString stringWithCString:[data bytes] length:[data length]];
    NSError *e = nil;
    NSData *jsonData = [output dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *jsonDict = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error: &e];
    NSString *version=@"";
    if([[jsonDict objectForKey:@"resultCount"] intValue] != 0){
        version = [[[jsonDict objectForKey:@"results"] objectAtIndex:0] objectForKey:@"version"];

    }
    return version;
}

+(BOOL) getLanguageVersionUpdate:(NSString*)currentVerionCode verisonCode: (NSInteger)currentVerion{
    NSString *appInfoUrl = @"https://s3.amazonaws.com/fordcorp-prod-author-datastore/public/compliance/languages.json" ;
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    request.cachePolicy = NSURLRequestReloadIgnoringLocalCacheData;
    [request setURL:[NSURL URLWithString:appInfoUrl]];
    [request setHTTPMethod:@"GET"];
    NSURLResponse *response;
    NSError *error;
    NSData *data = [NSURLConnection  sendSynchronousRequest:request returningResponse: &response error: &error];
    NSString *output = [NSString stringWithCString:[data bytes] length:[data length]];
    if (output.length != 0) {
        NSError *e = nil;
        NSData *jsonData = [output dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary *jsonDict = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error: &e];
        NSArray *languageArray = [jsonDict objectForKey:@"languages"];
        for (int i =0; i<languageArray.count; i++) {
            NSDictionary *language = [languageArray objectAtIndex:i];
            if ([currentVerionCode isEqualToString:[language objectForKey:@"code"]]) {
                int version = [[language objectForKey:@"version"] intValue];
                if (version > currentVerion) {
                    return TRUE;
                }else{
                    return FALSE;
                }
                break;
            }
        }
    }
    return FALSE;
}

//Checking app store verion and current app version
+ (BOOL)checkForAppUpdate{
    NSString * build = [[NSBundle mainBundle] objectForInfoDictionaryKey: (NSString *)kCFBundleVersionKey];
    NSString *appStoreVersion = [Utility getAppVerionFromAppStore];
    if(![appStoreVersion isEqualToString:@""]){
        NSArray* marketVer = [appStoreVersion componentsSeparatedByString: @"."];
        NSArray* existingVer = [build componentsSeparatedByString: @"."];
        BOOL isLatest = TRUE;
        for(int i =0 ; i< 3; i++){
            int exit = 0;
            int market = 0;
            if(existingVer.count > i){
                exit = [existingVer[i] intValue];
            }
            if(marketVer.count > i){
                market = [marketVer[i] intValue];
            }
           
            if(exit > market){
                break;
            }else  if (market > exit) {
                isLatest = FALSE;
                break;
            }
        }
        return isLatest;
    }else{
        return TRUE;
    }
}

//Checking language version from S3 server
+ (BOOL) checkForContentUpdate{
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    NSString *currentCode = [userDefaults valueForKey:@"LANGUAGE_CODE"];
    NSInteger currentVersion = [[userDefaults valueForKey:@"LANGUAGE_VERSION"] integerValue];
    return [self getLanguageVersionUpdate:currentCode verisonCode:currentVersion];
}

@end
