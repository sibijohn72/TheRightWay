/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.ford.fordcomplince;

import java.io.UnsupportedEncodingException;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import android.app.AlertDialog;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager.NameNotFoundException;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;

import org.apache.cordova.*;

public class FordCompliance extends CordovaActivity {

	public static Context _context;
	public static int _badgeCount = 0;
	public static String PREFERANCES_NAME = "ford_data";
	private static boolean mIsInForegroundMode;
	private static boolean isMoveToPlayStore;

/*	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.init();
		_context = FordCompliance.this;
		appView.setWebViewClient(new CordovaWebViewClient(this, this.appView) {
			@Override
			public boolean shouldOverrideUrlLoading(WebView view, String url) {
				if (url.contains("mailto:")) {
					Intent i = new Intent(Intent.ACTION_SEND);
					i.setType("message/rfc822");
					i.putExtra(Intent.EXTRA_EMAIL,
							new String[] { getMailId(url) });
					i.putExtra(Intent.EXTRA_SUBJECT, getSubject(url));
					i.putExtra(Intent.EXTRA_TEXT, getBody(url));
					try {
						startActivity(Intent.createChooser(i, "Send email"));
					} catch (android.content.ActivityNotFoundException ex) {

					}
					return true;
				} else {
					return super.shouldOverrideUrlLoading(view, url);
				}
			}
		});
		loadUrl(launchUrl);
	}

	@Override
	protected void onStart() {
		clearNotifications();
		new CheckVersionUpdate().execute(getApplicationContext()
				.getPackageName(),
				getResources().getString(R.string.playstore_url));
		mIsInForegroundMode = true;
		isMoveToPlayStore = false;
		super.onStart();
	}

	@Override
	protected void onPause() {
		mIsInForegroundMode = false;
		clearNotifications();
		if (!isMoveToPlayStore) {
			new CheckVersionUpdate().execute(getApplicationContext()
					.getPackageName(),
					getResources().getString(R.string.playstore_url));

		}
		SharedPreferences prefs = getSharedPreferences(PREFERANCES_NAME, 0);
		String code = prefs.getString("LANGUAGE_CODE", null);
		if (code != null) {
			new CheckLanguageUpdate().execute();
		}
		super.onPause();
	}

	private String getMailId(String url) {
		if (url.contains("subject")) {
			url = getMatchString("mailto:(.*?).com", url) + ".com";
		} else {
			url = url.substring(7);
		}
		return url;
	}

	private String getSubject(String url) {
		if (url.contains("subject")) {
			if (url.contains("body")) {
				url = getMatchString("subject=(.*?)&body=", url);
			} else {
				url = url + "&";
				url = getMatchString("subject=(.*?)&", url);
			}

		} else {
			url = "";
		}
		try {
			return java.net.URLDecoder.decode(url, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			return url;
		}
	}

	private String getBody(String url) {
		if (url.contains("body")) {
			url = url + "&";
			url = getMatchString("body=(.*?)&", url);
		} else {
			url = "";
		}
		try {
			return java.net.URLDecoder.decode(url, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			return url;
		}
	}

	private String getMatchString(String _pattern, String _url) {
		Pattern article = Pattern.compile(_pattern);
		Matcher match = article.matcher(_url);
		if (match.find()) {
			return match.group(1);
		} else {
			return "";
		}
	}

	private static void setLocalNotification(String message) {
		Intent intent = new Intent(_context, FordCompliance.class);
		PendingIntent pIntent = PendingIntent.getActivity(_context, 0, intent,
				0);
		_badgeCount = _badgeCount + 1;
		BadgeUtils.setBadge(_context, _badgeCount);
		Notification notification = new Notification.Builder(_context)
				.setContentTitle(message).setContentText("The Right Way")
				.setSmallIcon(R.drawable.icon).setContentIntent(pIntent)
				.build();
		NotificationManager notificationManager = (NotificationManager) _context
				.getSystemService(NOTIFICATION_SERVICE);
		notification.flags |= Notification.FLAG_AUTO_CANCEL;
		notification.defaults |= Notification.DEFAULT_SOUND;
		notification.defaults |= Notification.DEFAULT_VIBRATE;
		Random random = new Random();
		int m = random.nextInt(9999 - 1000) + 1000;
		notificationManager.notify(m, notification);
	}

	private static void clearNotifications() {
		NotificationManager notificationManager = (NotificationManager) _context
				.getSystemService(Context.NOTIFICATION_SERVICE);
		notificationManager.cancelAll();
		_badgeCount = 0;
		BadgeUtils.clearBadge(_context);
	}

	private static void showAlert(final String appId, String message) {
		AlertDialog.Builder alertDialog = new AlertDialog.Builder(_context);
		alertDialog.setTitle("Update Available");
		alertDialog.setCancelable(false);
		alertDialog.setMessage(message);
		alertDialog.setPositiveButton("OK",
				new DialogInterface.OnClickListener() {
					public void onClick(DialogInterface dialog, int which) {
						isMoveToPlayStore = true;
						try {
							_context.startActivity(new Intent(
									Intent.ACTION_VIEW, Uri
											.parse("market://details?id="
													+ appId)));
						} catch (android.content.ActivityNotFoundException anfe) {
							Intent i = new Intent(Intent.ACTION_VIEW);
							i.setData(Uri
									.parse("http://play.google.com/store/apps/details?id="
											+ appId));
							i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
							_context.startActivity(i);
						}
					}
				}).setNegativeButton("Cancel",
				new DialogInterface.OnClickListener() {

					@Override
					public void onClick(DialogInterface dialog, int which) {

					}
				});
		alertDialog.show();
	}

	public static void showVersionUpdateAlert(String MarketVersionName,
			final String appId) {
		String ExistingVersionName = "";
		try {
			ExistingVersionName = _context.getPackageManager().getPackageInfo(
					((Context) _context).getPackageName(), 0).versionName;
		} catch (NameNotFoundException e) {
			e.printStackTrace();
		}

		String[] marketVersionNumber = MarketVersionName.split("\\.");
		String[] existingVersionNumber = ExistingVersionName.split("\\.");
		boolean isLatest = true;
		for (int i = 0; i < 3; i++) {
			if (Integer.parseInt(marketVersionNumber[i]) > Integer
					.parseInt(existingVersionNumber[i])) {
				isLatest = false;
				break;
			}
			else if (Integer.parseInt(marketVersionNumber[i]) < Integer
					.parseInt(existingVersionNumber[i])) {

					break;
					}
		}

		if (!isLatest) {
			if (mIsInForegroundMode) {
				showAlert(
						appId,
						_context.getResources().getString(
								R.string.UPDATE_VERSION_MSG));
			} else {
				setLocalNotification(_context.getResources().getString(
						R.string.UPDATE_VERSION_MSG));
			}

		} else {
			clearNotifications();
		}
	}

	public static void checkLanguageVersion(int serverVersion,
			int currentVersion) {
		if (serverVersion > currentVersion) {
			setLocalNotification(_context.getResources().getString(
					R.string.UPDATE_LANGUAGE_MSG));
		}
	}*/
}
