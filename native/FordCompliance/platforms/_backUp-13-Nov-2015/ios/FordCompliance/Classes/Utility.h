//
//  Utility.h
//  FordAccountManager
//
//  Created by Sreejith MV on 4/7/14.
//
//

#import <Foundation/Foundation.h>

@interface Utility : NSObject

+(BOOL)isConnectingToInternet;
+(NSString *)getAppVerionFromAppStore;
+(BOOL)checkForAppUpdate;
+(BOOL)checkForContentUpdate;
+(BOOL)getLanguageVersionUpdate;

@end
