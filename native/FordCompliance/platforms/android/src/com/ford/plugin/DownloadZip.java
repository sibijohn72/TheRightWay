package com.ford.plugin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import com.ford.therightway.FordCompliance;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.SharedPreferences;

public class DownloadZip extends CordovaPlugin implements TaskListener {
	public CallbackContext _callbackContext;
	private ProgressDialog _progress;
	private String DOWNLOAD_CONTENT_TEXT = "Downloading Content";
	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		if (action.equals("DownloadFile")) {
			SharedPreferences.Editor editor = cordova.getActivity()
					.getSharedPreferences(FordCompliance.PREFERANCES_NAME, 0)
					.edit();

			editor.putString("LANGUAGE_CODE", args.getString(1));
			editor.putInt("LANGUAGE_VERSION", args.getInt(2));
			editor.commit();
			_progress = new ProgressDialog(cordova.getActivity());
			_progress.setMessage(DOWNLOAD_CONTENT_TEXT);
			_progress.setProgressStyle(ProgressDialog.STYLE_SPINNER);
			_progress.setIndeterminate(true);
			_progress.setCancelable(false);
			_progress.show();
			_callbackContext = callbackContext;
			final TaskListener gt = this;
			new DownloadHelper(cordova.getActivity(), gt).execute(args
					.getString(0));
			PluginResult pluginResult = new PluginResult(
					PluginResult.Status.NO_RESULT);
			pluginResult.setKeepCallback(true);
			callbackContext.sendPluginResult(pluginResult);
			return true;
		}
		return false;
	}

	@Override
	public void onTaskDone(String data, boolean status) {
		if (this._callbackContext != null) {
			_progress.dismiss();
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
}
