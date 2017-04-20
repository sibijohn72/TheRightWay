package com.ford.plugin;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.os.AsyncTask;
import android.os.Environment;

public class DownloadPdf extends CordovaPlugin implements TaskListener {
	public CallbackContext _callbackContext;
	private String _filePath = "";
	private ProgressDialog _progress;
	private String ALERT_MESSAGE 		= "This function will download a copy of the Code of Conduct Handbook onto your device.  It is approximately 6MB.  Do you want to proceed with the download?";
	private String APP_TITLE	 		= "The Right Way";
	private String DOWNLOAD_BUT_TEXT 	= "Download";
	private String CANCEL_BUT_TEXT		= "CANCEL";
	private String PROGRESS_MSG			= "Downloading Code of Conduct Handbook...";
	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		if (action.equals("DownloadFile")) {
			
			ALERT_MESSAGE 		= args.getJSONArray(2).getString(0);
			PROGRESS_MSG 		= args.getJSONArray(2).getString(1);
			APP_TITLE 			= args.getJSONArray(2).getString(2);
			DOWNLOAD_BUT_TEXT	= args.getJSONArray(2).getString(3);
			CANCEL_BUT_TEXT		= args.getJSONArray(2).getString(4);
			
			_progress = new ProgressDialog(cordova.getActivity());
			_progress.setMessage(PROGRESS_MSG);
			_progress.setProgressStyle(ProgressDialog.STYLE_SPINNER);
			_progress.setIndeterminate(true);
			_progress.setCancelable(false);
			_progress.show();
			_callbackContext = callbackContext;
			final String fileName = args.getString(0);
			_filePath = Environment.getExternalStorageDirectory()
					+ "/Android/data/" + cordova.getActivity().getPackageName()
					+ "/" + fileName.split("/")[fileName.split("/").length - 1];
			File file = new File(_filePath);
			if (!file.exists() || args.getBoolean(1)) {
				new AlertDialog.Builder(cordova.getActivity())
						.setTitle(APP_TITLE)
						.setMessage(ALERT_MESSAGE)
						.setPositiveButton(DOWNLOAD_BUT_TEXT,
								new DialogInterface.OnClickListener() {
									public void onClick(DialogInterface dialog,
											int which) {
										new DownloadPDF().execute(fileName);
									}
								})
						.setNegativeButton(CANCEL_BUT_TEXT,
								new DialogInterface.OnClickListener() {
									public void onClick(DialogInterface dialog,
											int which) {
										_progress.dismiss();
										onTaskDone("Cancel", true);
									}
								}).show();
			} else {
				_progress.dismiss();
				onTaskDone(_filePath, true);
			}
			PluginResult pluginResult = new PluginResult(
					PluginResult.Status.NO_RESULT);
			pluginResult.setKeepCallback(true);
			callbackContext.sendPluginResult(pluginResult);
			return true;
		} else {
			return false;
		}
	}

	@Override
	public void onTaskDone(String data, boolean status) {
		if (this._callbackContext != null) {
			if (status) {
				PluginResult result = new PluginResult(PluginResult.Status.OK,
						data);
				result.setKeepCallback(false);
				this._callbackContext.sendPluginResult(result);
			} else {
				this._callbackContext.error(data);
			}
		}
	}

	private class DownloadPDF extends AsyncTask<String, String, String> {
		@Override
		protected void onPreExecute() {
			super.onPreExecute();
		}

		@Override
		protected String doInBackground(String... params) {
			int count;
			URL url;
			try {
				url = new URL(params[0]);
				URLConnection conection = url.openConnection();
				conection.connect();
				int lenghtOfFile = conection.getContentLength();
				InputStream input = new BufferedInputStream(url.openStream());
				OutputStream output = new FileOutputStream(_filePath);
				byte data[] = new byte[1024];
				long total = 0;
				while ((count = input.read(data)) != -1) {
					total += count;
					publishProgress("" + (int) ((total * 100) / lenghtOfFile));
					output.write(data, 0, count);
				}
				output.flush();
				output.close();
				input.close();
			} catch (Exception e) {
				_progress.dismiss();
				onTaskDone(e.toString(), false);
				e.printStackTrace();
			}

			return null;
		}

		@Override
		protected void onPostExecute(String result) {
			_progress.dismiss();
			onTaskDone(_filePath, true);
		}
	}
}
