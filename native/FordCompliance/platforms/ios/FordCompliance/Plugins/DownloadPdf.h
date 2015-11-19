//
//  DownloadPdf.h
//  FordCompliance
//
//  Created by developer on 2/27/15.
//
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>

@interface DownloadPdf : CDVPlugin <NSURLConnectionDelegate,NSURLConnectionDataDelegate,NSURLConnectionDownloadDelegate>
{
    CDVInvokedUrlCommand* _command;
}
@property(nonatomic, retain)NSMutableData *receivedData;
- (void) DownloadFile:(CDVInvokedUrlCommand*)command;
@end

