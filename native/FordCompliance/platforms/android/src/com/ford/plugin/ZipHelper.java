package com.ford.plugin;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class ZipHelper {

	private String zipFilePath;
	private String unCompressPath;

	public ZipHelper(String zip, String locationtouncompress) {
		zipFilePath = zip;
		unCompressPath = locationtouncompress;
		checkAndCreateDirectory("");
	}

	public void unzip() throws Exception {
		FileInputStream fin = new FileInputStream(zipFilePath);
		ZipInputStream zin = new ZipInputStream(fin);
		ZipEntry ze = null;

		while ((ze = zin.getNextEntry()) != null) {
			File destFile = new File(unCompressPath, ze.getName());
			File parent = destFile.getParentFile();
			parent.mkdirs();
			if (ze.isDirectory()) {
				checkAndCreateDirectory(ze.getName());
			} else {
				new File(unCompressPath, ze.getName()).createNewFile();
				FileOutputStream fout = new FileOutputStream(unCompressPath
						+ ze.getName());
				for (int c = zin.read(); c != -1; c = zin.read()) {
					fout.write(c);
				}
				zin.closeEntry();
				fout.close();
			}
		}
		new File(zipFilePath).delete();
		zin.close();

	}

	private void checkAndCreateDirectory(String dirPath) {
		File f = new File(unCompressPath + dirPath);
		if (!f.isDirectory()) {
			f.mkdirs();
		}
	}

}
