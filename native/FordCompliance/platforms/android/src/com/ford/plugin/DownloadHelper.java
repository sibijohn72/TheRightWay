package com.ford.plugin;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;

import android.content.Context;
import android.os.AsyncTask;
import android.os.Environment;

public class DownloadHelper extends AsyncTask<String, String, String> {
	private TaskListener _taskListener = null;
	private Context _context = null;

	public DownloadHelper(Context context, TaskListener taskListener) {
		super();
		this._taskListener = taskListener;
		_context = context;
	}

	@Override
	protected void onPreExecute() {
		super.onPreExecute();
	}

	@Override
	protected String doInBackground(String... fileUrl) {
		int count;
		try {
			URL url = new URL(fileUrl[0]);
			URLConnection connection = url.openConnection();
			connection.connect();

			int lengthOfFile = connection.getContentLength();
			InputStream in = new BufferedInputStream(url.openStream());
			if (isExternalStorageWritable()) {
				String filePath = Environment.getExternalStorageDirectory()
						+ "/Android/data/" + _context.getPackageName();
				new File(filePath).mkdirs();
				new File(filePath, "assets.zip").createNewFile();
				filePath = filePath + "/assets.zip";
				OutputStream out = new FileOutputStream(filePath, true);

				byte data[] = new byte[1024];

				long total = 0;

				while ((count = in.read(data)) != -1) {
					total += count;
					publishProgress("" + (int) ((total * 100) / lengthOfFile));
					out.write(data, 0, count);
				}
				out.flush();
				out.close();
				in.close();
			} else {
				if (this._taskListener != null) {
					this._taskListener.onTaskDone("Storage space not avalible",
							false);
				}
			}

		} catch (Exception e) {
			if (this._taskListener != null) {
				this._taskListener.onTaskDone(e.toString(), false);
			}
		}
		return null;
	}

	@Override
	protected void onProgressUpdate(String... values) {
	}

	@Override
	protected void onPostExecute(String result) {
		String zipFilePath = Environment.getExternalStorageDirectory()
				+ "/Android/data/" + _context.getPackageName() + "/assets.zip";

		String unzipFolderPath = Environment.getExternalStorageDirectory()
				+ "/Android/data/" + _context.getPackageName() + "/assets/";
		new File(unzipFolderPath).mkdirs();
		ZipHelper z = new ZipHelper(zipFilePath, unzipFolderPath);
		try {
			z.unzip();
			File unzipDir = new File(unzipFolderPath);
			if (unzipDir.isDirectory() && unzipDir.list() != null) {
				if (this._taskListener != null) {
					this._taskListener.onTaskDone("file://" + unzipFolderPath,
							true);
				}
			}
		} catch (Exception e) {
			if (this._taskListener != null) {
				// this._taskListener.onTaskDone(e.toString(), false);
				this._taskListener
						.onTaskDone("file://" + unzipFolderPath, true);
			}
		}
	}

	private boolean isExternalStorageWritable() {
		String state = Environment.getExternalStorageState();
		if (Environment.MEDIA_MOUNTED.equals(state)) {
			return true;
		}
		return false;
	}

}
