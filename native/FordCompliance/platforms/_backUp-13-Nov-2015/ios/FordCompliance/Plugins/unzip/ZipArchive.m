//
//  ZipArchive.m
//  ZipArchive
//
//  Created by developer1 on 7/24/14.
//
//

#import "ZipArchive.h"
#import "zlib.h"
#import "zconf.h"



@interface ZipArchive (Private)
-(BOOL) OverWrite:(NSString*) file;
-(NSDate*) originalDate;
@end



@implementation ZipArchive
@synthesize delegate = _delegate;

-(id) init
{
    if( self=[super init] )
    {
        
    }
    return self;
}

-(BOOL) UnzipOpenFile:(NSString*) zipFile
{
    _unzFile = unzOpen( (const char*)[zipFile UTF8String] );
    if( _unzFile )
    {
        unz_global_info  globalInfo = {0};
        if( unzGetGlobalInfo(_unzFile, &globalInfo )==UNZ_OK )
        {
            NSLog(@"%lu entries in the zip file",globalInfo.number_entry);
        }
    }
    return _unzFile!=NULL;
}

-(BOOL) UnzipFileTo:(NSString*) path overWrite:(BOOL) overwrite
{
    BOOL success = YES;
    int ret = unzGoToFirstFile( _unzFile );
    unsigned char		buffer[4096] = {0};
    NSFileManager* fman = [NSFileManager defaultManager];
    if( ret!=UNZ_OK )
    {
        NSLog(@"Unzip Failed");
    }
    
    do{
        ret = unzOpenCurrentFile( _unzFile );

        if( ret!=UNZ_OK )
        {
            NSLog(@"Error Occured in Unzip");
            success = NO;
            break;
        }
        // reading data and write to file
        int read ;
        unz_file_info	fileInfo ={0};
        ret = unzGetCurrentFileInfo(_unzFile, &fileInfo, NULL, 0, NULL, 0, NULL, 0);
        if( ret!=UNZ_OK )
        {
            NSLog(@"Error occured while getting file info");
            success = NO;
            unzCloseCurrentFile( _unzFile );
            break;
        }
        char* filename = (char*) malloc( fileInfo.size_filename +1 );
        unzGetCurrentFileInfo(_unzFile, &fileInfo, filename, fileInfo.size_filename + 1, NULL, 0, NULL, 0);
        filename[fileInfo.size_filename] = '\0';
        
        // check if it contains directory
        NSString* strPath = [NSString stringWithCString:filename encoding:NSUTF8StringEncoding];
        BOOL isDirectory = NO;
        if( filename[fileInfo.size_filename-1]=='/' || filename[fileInfo.size_filename-1]=='\\')
            isDirectory = YES;
        free( filename );
        if( [strPath rangeOfCharacterFromSet:[NSCharacterSet characterSetWithCharactersInString:@"/\\"]].location!=NSNotFound )
        {// contains a path
            strPath = [strPath stringByReplacingOccurrencesOfString:@"\\" withString:@"/"];
        }
        NSString* fullPath = [path stringByAppendingPathComponent:strPath];
        
        if( isDirectory )
            [fman createDirectoryAtPath:fullPath withIntermediateDirectories:YES attributes:nil error:nil];
        else
            [fman createDirectoryAtPath:[fullPath stringByDeletingLastPathComponent] withIntermediateDirectories:YES attributes:nil error:nil];
        if( [fman fileExistsAtPath:fullPath] && !isDirectory && !overwrite )
        {
            if( ![self OverWrite:fullPath] )
            {
                unzCloseCurrentFile( _unzFile );
                ret = unzGoToNextFile( _unzFile );
                continue;
            }
        }
        FILE* fp = fopen( (const char*)[fullPath UTF8String], "wb");
        while( fp )
        {
            read=unzReadCurrentFile(_unzFile, buffer, 4096);
            if( read > 0 )
            {
                fwrite(buffer, read, 1, fp );
            }
            else if( read<0 )
            {
                NSLog (@"Failed to read zip file");
                break;
            }
            else
                break;
        }
        if( fp )
        {
            fclose( fp );
            // Set Original date
            if( fileInfo.dosDate!=0 )
            {
                NSDate* orgDate = [[NSDate alloc]
                                   initWithTimeInterval:(NSTimeInterval)fileInfo.dosDate
                                   sinceDate:[self originalDate] ];
                
                NSDictionary* attr = [NSDictionary dictionaryWithObject:orgDate forKey:NSFileModificationDate];
                
                if( attr )
                {
                    if( ![[NSFileManager defaultManager] setAttributes:attr ofItemAtPath:fullPath error:nil] )
                    {
                        // Error in setting attributes
                        NSLog(@"Failed to set attributes");
                    }
                    
                }
                orgDate = nil;
            }
            
        }
        unzCloseCurrentFile( _unzFile );
        ret = unzGoToNextFile( _unzFile );
    }while( ret==UNZ_OK && UNZ_OK!=UNZ_END_OF_LIST_OF_FILE );
    return success;
}

-(BOOL) UnzipCloseFile
{
    if( _unzFile )
        return unzClose( _unzFile )==UNZ_OK;
    return YES;
}

-(BOOL) OverWrite:(NSString*) file
{
    NSLog(@"Overwriting File : %@",file);
    return YES;
}

#pragma mark get Original Date
-(NSDate*) originalDate
{
    NSDateComponents *comps = [[NSDateComponents alloc] init];
    [comps setDay:1];
    [comps setMonth:1];
    [comps setYear:1980];
    NSCalendar *gregorian = [[NSCalendar alloc]
                             initWithCalendarIdentifier:NSGregorianCalendar];
    NSDate *date = [gregorian dateFromComponents:comps];
    
    return date;
}

@end