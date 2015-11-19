//
//  ZipArchive.h
//  ZipArchive
//
//  Created by developer1 on 7/24/14.
//
//

#import <UIKit/UIKit.h>


#include "unzip.h"


@protocol ZipArchiveDelegate <NSObject>
@optional
-(void) ErrorMessage:(NSString*) msg;
-(BOOL) OverWriteOperation:(NSString*) file;

@end


@interface ZipArchive : NSObject <ZipArchiveDelegate>{
@private
    unzFile		_unzFile;
    id			_delegate;
}

@property (nonatomic, retain) id delegate;

-(BOOL) UnzipOpenFile:(NSString*) zipFile;
-(BOOL) UnzipFileTo:(NSString*) path overWrite:(BOOL) overwrite;
-(BOOL) UnzipCloseFile;
@end
