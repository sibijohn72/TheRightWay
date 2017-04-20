package com.ford.therightway;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import android.os.AsyncTask;

public class CheckVersionUpdate extends AsyncTask<String, Void, String> {

	String baseURL = "";
	String appId = "";

	@Override
	protected String doInBackground(String... urls) {
		String str = "";
		try {
			appId = urls[0];
			URL url = new URL(urls[1] + appId);
			URLConnection spoof = url.openConnection();
			spoof.setRequestProperty("User-Agent",
					"Mozilla/4.0 (compatible; MSIE 5.5; Windows NT 5.0; H010818)");
			BufferedReader in = new BufferedReader(new InputStreamReader(
					spoof.getInputStream()));
			String strLine = "";
			// Loop through every line in the source
			while ((strLine = in.readLine()) != null) {
				str = str + strLine;
			}
			return str;
		} catch (Exception e) {
			return null;
		}

	}

	@Override
	protected void onPostExecute(String result) {
		// TODO Auto-generated method stub
		try {
			if (result!=null) {
				Pattern pattern = Pattern.compile("softwareVersion\">[^<]*</");
				Matcher matcher = pattern.matcher(result);
				matcher.find();
				String MarketVersionName = matcher.group(0).substring(
						matcher.group(0).indexOf(">") + 1,
						matcher.group(0).indexOf("<"));
				FordCompliance.showVersionUpdateAlert(MarketVersionName.trim(), appId);  		    		 
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		super.onPostExecute(result);
	}

}
