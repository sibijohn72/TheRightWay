//
//  unzip.h
//
//  Created by developer1 on 7/24/14.
//
//

#ifndef _unz_H
#define _unz_H

#ifdef __cplusplus
extern "C" {
#endif
    
#ifndef _ZLIB_H
#include "zlib.h"
#endif
    
#ifndef _ZLIBIOAPI_H
#include "inout.h"
#endif
    
 #define Z_BZIP2ED 12
    
#if defined(STRICTUNZIP) || defined(STRICTZIPUNZIP)
    typedef struct TagunzFile__ { int unused; } unzFile__;
    typedef unzFile__ *unzFile;
#else
    typedef voidp unzFile;
#endif
    
    
#define UNZ_OK                          (0)
#define UNZ_END_OF_LIST_OF_FILE         (-100)
#define UNZ_ERRNO                       (Z_ERRNO)
#define UNZ_EOF                         (0)
#define UNZ_PARAMERROR                  (-102)
#define UNZ_BADZIPFILE                  (-103)
#define UNZ_INTERNALERROR               (-104)
#define UNZ_CRCERROR                    (-105)
    
    /* tm_unz contain date/time info */
    typedef struct tm_unz_s
    {
        uInt tm_sec;
        uInt tm_min;
        uInt tm_hour;
        uInt tm_mday;
        uInt tm_mon;
        uInt tm_year;
    } tm_unz;
    
    /* unz_global_info structure contain global data about the ZIPfile
     These data comes from the end of central dir */
    typedef struct unz_global_info_s
    {
        uLong number_entry;
        uLong size_comment;
    } unz_global_info;
    
    
    /* unz_file_info contain information about a file in the zipfile */
    typedef struct unz_file_info_s
    {
        uLong version;
        uLong version_needed;
        uLong flag;
        uLong compression_method;
        uLong dosDate;
        uLong crc;
        uLong compressed_size;
        uLong uncompressed_size;
        uLong size_filename;
        uLong size_file_extra;
        uLong size_file_comment;
        
        uLong disk_num_start;
        uLong internal_fa;
        uLong external_fa;
        
        tm_unz tmu_date;
    } unz_file_info;
    
    extern int ZEXPORT unzStringFileNameCompare OF ((const char* fileName1,
                                                     const char* fileName2,
                                                     int iCaseSensitivity));
    //   Compare two filename (fileName1,fileName2).
    
    extern unzFile ZEXPORT unzOpen OF((const char *path));
    // Open a Zip file.
    
    extern unzFile ZEXPORT unzOpen2 OF((const char *path,
                                        zlib_filefunc_def* pzlib_filefunc_def));
    
    extern int ZEXPORT unzClose OF((unzFile file));
    //  Close a ZipFile opened with unzipOpen.
    
    extern int ZEXPORT unzGetGlobalInfo OF((unzFile file,
                                            unz_global_info *pglobal_info));
    // Write info about the ZipFile
    
    
    extern int ZEXPORT unzGetGlobalComment OF((unzFile file,
                                               char *szComment,
                                               uLong uSizeBuf));
    /*
     Get the global comment string of the ZipFile, in the szComment buffer.
     uSizeBuf is the size of the szComment buffer.
     return the number of byte copied or an error code <0
     */
    extern int ZEXPORT unzGoToFirstFile OF((unzFile file));
    //  Set the current file of the zipfile to the first file.
    
    
    extern int ZEXPORT unzGoToNextFile OF((unzFile file));
    //  Set the current file of the zipfile to the next file.
    
    
    extern int ZEXPORT unzLocateFile OF((unzFile file,
                                         const char *szFileName,
                                         int iCaseSensitivity));
    // Try locate the file szFileName in the zipfile.
    
    /* unz_file_info contain information about a file in the zipfile */
    typedef struct unz_file_pos_s
    {
        uLong pos_in_zip_directory;
        uLong num_of_file;
    } unz_file_pos;
    
    extern int ZEXPORT unzGetFilePos(
                                     unzFile file,
                                     unz_file_pos* file_pos);
    
    extern int ZEXPORT unzGoToFilePos(
                                      unzFile file,
                                      unz_file_pos* file_pos);
    
    
    extern int ZEXPORT unzGetCurrentFileInfo OF((unzFile file,
                                                 unz_file_info *pfile_info,
                                                 char *szFileName,
                                                 uLong fileNameBufferSize,
                                                 void *extraField,
                                                 uLong extraFieldBufferSize,
                                                 char *szComment,
                                                 uLong commentBufferSize));
    //  Get Info about the current file
    
    /* for reading the content of the current zipfile, you can open it, read data
     from it, and close it (you can close it before reading all the file)
     */
    
    extern int ZEXPORT unzOpenCurrentFile OF((unzFile file));
    /*
     Open for reading data the current file in the zipfile.
     If there is no error, the return value is UNZ_OK.
     */
    
    extern int ZEXPORT unzOpenCurrentFilePassword OF((unzFile file,
                                                      const char* password));
    
    
    extern int ZEXPORT unzOpenCurrentFile2 OF((unzFile file,
                                               int* method,
                                               int* level,
                                               int raw));
    
    extern int ZEXPORT unzOpenCurrentFile3 OF((unzFile file,
                                               int* method,
                                               int* level,
                                               int raw,
                                               const char* password));
    
    extern int ZEXPORT unzCloseCurrentFile OF((unzFile file));
    // Close the file in zip opened with unzOpenCurrentFile
    
    
    extern int ZEXPORT unzReadCurrentFile OF((unzFile file,
                                              voidp buf,
                                              unsigned len));
    //  Read bytes from the current file
    
    
    extern z_off_t ZEXPORT unztell OF((unzFile file));
    /*
     Give the current position in uncompressed data
     */
    
    extern int ZEXPORT unzeof OF((unzFile file));
    /*
     return 1 if the end of file was reached, 0 elsewhere
     */
    
    extern int ZEXPORT unzGetLocalExtrafield OF((unzFile file,
                                                 voidp buf,
                                                 unsigned len));
    //  Read extra field from the current file
    
    
    /* Get the current file offset */
    extern uLong ZEXPORT unzGetOffset (unzFile file);
    
    /* Set the current file offset */
    extern int ZEXPORT unzSetOffset (unzFile file, uLong pos);
    
    
    
#ifdef __cplusplus
}
#endif

#endif 
