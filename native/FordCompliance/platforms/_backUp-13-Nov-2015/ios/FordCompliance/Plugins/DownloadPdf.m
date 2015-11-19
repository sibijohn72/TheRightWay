//
//  DownloadPdf.m
//  FordCompliance
//
//  Created by developer on 2/27/15.
//
//


#import "DownloadPdf.h"
#import "MainViewController.h"
#import "AppDelegate.h"

@interface DownloadPdf(){
    UIView* activityView;
}
@end

@implementation DownloadPdf
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
    _command = command;
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *path = [paths objectAtIndex:0];
    BOOL forceDownload =[[_command.arguments objectAtIndex:1] boolValue] ;
    NSString *zipPath = [path stringByAppendingPathComponent:@"coc.pdf"];
    if (![[NSFileManager defaultManager] fileExistsAtPath:zipPath] || forceDownload) {
        UIAlertView *alert = [[UIAlertView alloc]initWithTitle:@"The Right Way" message:@"This function will download a copy of the Code of Conduct Handbook onto your device. It is approximately 6MB. Do you want to proceed with the download?" delegate:self cancelButtonTitle:@"Cancel" otherButtonTitles:@"Download", nil];
        [alert show];
    }else{
        CDVPluginResult* pluginResult = nil;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:zipPath];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:_command.callbackId];
    }
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

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    CDVPluginResult* pluginResult = nil;
    if (buttonIndex == 0)
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Cancel"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:_command.callbackId];

    }
    if (buttonIndex == 1)
    {
        [self showActivityIndicatorViewer];
        NSString* articleUrl = [NSString stringWithFormat:@"%@?v=%d",[_command.arguments objectAtIndex:0],rand()];
        self.receivedData = [NSMutableData data];
        [[NSURLConnection alloc] initWithRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:articleUrl]] delegate:self];
    }
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error{
    CDVPluginResult* pluginResult = nil;
    [self hideActivityIndicatorViewer];
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:_command.callbackId];

}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data{
    [_receivedData appendData:data];
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection{
    [self hideActivityIndicatorViewer];
    CDVPluginResult* pluginResult = nil;
    if (_receivedData) {
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *path = [paths objectAtIndex:0];
        NSString *zipPath = [path stringByAppendingPathComponent:@"coc.pdf"];
        path = [path stringByAppendingString:@"/www/content/"];
        NSError *error = nil;
        NSFileManager *fileManager = [NSFileManager defaultManager];
        
        if ([fileManager fileExistsAtPath:zipPath]){
            [fileManager removeItemAtPath:zipPath error:&error];
        }
        
        [_receivedData writeToFile:zipPath options:0 error:&error];
        
        if(!error)
        {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:zipPath];
        }
        else
        {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.description];
        }
    }
    else{
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Download Failed"];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:_command.callbackId];
}

@end

