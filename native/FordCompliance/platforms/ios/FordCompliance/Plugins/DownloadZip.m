//
//  DownloadZip.m
//  DownloadZip
//
//  Created by developer1 on 7/24/14.
//
//

#import "DownloadZip.h"
#import "ZipArchive.h"
#import "MainViewController.h"
#import "AppDelegate.h"

@interface DownloadZip(){
    UIView* activityView;
}
@end

@implementation DownloadZip
MainViewController * mainCtrlr;
- (id)init
{
    self = [super init];
    if (self) {
        _command = nil;
  
    }
    return self;
}

- (void)DownloadFile:(CDVInvokedUrlCommand *)command
{
    AppDelegate *appDelegate = (AppDelegate*)[UIApplication sharedApplication].delegate;
    mainCtrlr = (MainViewController*)appDelegate.window.rootViewController;
    NSString* articleUrl = [NSString stringWithFormat:@"%@?v=%d",[command.arguments objectAtIndex:0],rand()];
    self.receivedData = [NSMutableData data];
    _command = command;
    NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
    [userDefaults setObject:[command.arguments objectAtIndex:1] forKey:@"LANGUAGE_CODE"];
    [userDefaults setInteger:[[command.arguments objectAtIndex:2] integerValue]  forKey:@"LANGUAGE_VERSION"];
    [userDefaults synchronize];
    [self showActivityIndicatorViewer];
    [[NSURLConnection alloc] initWithRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:articleUrl]] delegate:self];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error{
    [self hideActivityIndicatorViewer];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data{
    [_receivedData appendData:data];
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection{
    CDVPluginResult* pluginResult = nil;
    if (_receivedData) {
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        //NSString *path = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"\\www"];
        NSString *path = [paths objectAtIndex:0];
        NSString *zipPath = [path stringByAppendingPathComponent:@"content.zip"];
        path = [path stringByAppendingString:@"/www/content/"];
        NSError *error = nil;
        NSFileManager *fileManager = [NSFileManager defaultManager];
        
        if ([fileManager fileExistsAtPath:zipPath]){
            [fileManager removeItemAtPath:zipPath error:&error];
        }
       
        [_receivedData writeToFile:zipPath options:0 error:&error];
        
        if(!error)
        {
            ZipArchive *za = [[ZipArchive alloc] init];
            if ([za UnzipOpenFile: zipPath]) {
                BOOL ret = [za UnzipFileTo: path overWrite: YES];
                if(NO == ret){} [za UnzipCloseFile];
                [self hideActivityIndicatorViewer];
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:path];
            }else{
                [self hideActivityIndicatorViewer];
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Download Failed"];
            }
        }
        else
        {
            [self hideActivityIndicatorViewer];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description];
        }
    }
    else{
        [self hideActivityIndicatorViewer];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Download Failed"];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:_command.callbackId];
}


-(void)showActivityIndicatorViewer
{
    AppDelegate *delegate = [[UIApplication sharedApplication] delegate];
    UIWindow *window = delegate.window;
    activityView = [[UIView alloc] initWithFrame: CGRectMake(0, 0, window.bounds.size.width, window.bounds.size.height)];
    activityView.backgroundColor = [UIColor blackColor];
    activityView.alpha = 0.5;
    
    UIActivityIndicatorView *activityWheel = [[UIActivityIndicatorView alloc] initWithFrame: CGRectMake(window.bounds.size.width / 2 - 12, window.bounds.size.height / 2 - 12, 24, 24)];
    activityWheel.activityIndicatorViewStyle = UIActivityIndicatorViewStyleWhite;
    activityWheel.autoresizingMask = (UIViewAutoresizingFlexibleLeftMargin |
                                      UIViewAutoresizingFlexibleRightMargin |
                                      UIViewAutoresizingFlexibleTopMargin |
                                      UIViewAutoresizingFlexibleBottomMargin);
    [activityView addSubview:activityWheel];
    [window addSubview: activityView];
    
    [[[activityView subviews] objectAtIndex:0] startAnimating];
}

-(void)hideActivityIndicatorViewer
{
    [[[activityView subviews] objectAtIndex:0] stopAnimating];
    [activityView removeFromSuperview];
    activityView = nil;
}


-(void)cordovaGetPushStatus:(CDVInvokedUrlCommand *)command{
    CDVPluginResult* pluginResult = nil;
    
    UIRemoteNotificationType types = [[UIApplication sharedApplication] enabledRemoteNotificationTypes];
    if (types == UIRemoteNotificationTypeNone) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:TRUE];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:FALSE];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
