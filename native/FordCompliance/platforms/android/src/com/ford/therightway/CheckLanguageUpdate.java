package com.ford.therightway;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.util.Log;



public class CheckLanguageUpdate extends AsyncTask<String, Void, String> {
	@Override
	protected String doInBackground(String... params) {
		InputStream inputStream = null;
		String result = "";
		String url_select = FordCompliance._context.getResources().getString(
				R.string.language_pack_url);
		ArrayList<NameValuePair> param = new ArrayList<NameValuePair>();

		try {
			HttpClient httpClient = new DefaultHttpClient();
			HttpGet httpPost = new HttpGet(url_select);
			//httpPost.setEntity(new UrlEncodedFormEntity(param));
			HttpResponse httpResponse = httpClient.execute(httpPost);
			HttpEntity httpEntity = httpResponse.getEntity();
			inputStream = httpEntity.getContent();
		} catch (UnsupportedEncodingException e) {
			Log.e("EncodingException", e.toString());
			e.printStackTrace();
		} catch (ClientProtocolException e) {
			Log.e("ClientProtocolException", e.toString());
			e.printStackTrace();
		} catch (IllegalStateException e) {
			Log.e("IllegalStateException", e.toString());
			e.printStackTrace();
		} catch (IOException e) {
			Log.e("IOException", e.toString());
			e.printStackTrace();
		}
		// Convert response to string using String Builder
		try {
			BufferedReader bReader = new BufferedReader(new InputStreamReader(
					inputStream, "utf-8"), 8);
			StringBuilder sBuilder = new StringBuilder();

			String line = null;
			while ((line = bReader.readLine()) != null) {
				sBuilder.append(line + "\n");
			}
			inputStream.close();
			result = sBuilder.toString();

		} catch (Exception e) {
			Log.e("AppLog", "Error converting result "
					+ e.toString());
		}

		return result;
	}

	@Override
	protected void onPostExecute(String result) {
		try {
			JSONObject resultObject = new JSONObject(result);
			JSONArray languageArray = resultObject.getJSONArray("languages");
			SharedPreferences prefs = FordCompliance._context
					.getSharedPreferences(FordCompliance.PREFERANCES_NAME, 0);
			String code = prefs.getString("LANGUAGE_CODE", null);

			for (int i = 0; i < languageArray.length(); i++) {
				JSONObject jObject = languageArray.getJSONObject(i);
				String name = jObject.getString("code");
				if (name.equals(code)) {
					FordCompliance.checkLanguageVersion(
							jObject.getInt("version"),
							prefs.getInt("LANGUAGE_VERSION", 0));
					break;
				}
			}
		} catch (JSONException e) {
			Log.e("JSONException", "Error: " + e.toString());
		}
		super.onPostExecute(result);
	}
}
