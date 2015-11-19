//
//  DownloadZip.h
//  DownloadZip
//
//  Created by developer1 on 7/24/14.
//
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>

@interface DownloadZip : CDVPlugin <NSURLConnectionDelegate,NSURLConnectionDataDelegate,NSURLConnectionDownloadDelegate>
{
    CDVInvokedUrlCommand* _command;
}
@property(nonatomic, retain)NSMutableData *receivedData;
    - (void) DownloadFile:(CDVInvokedUrlCommand*)command;
@end

