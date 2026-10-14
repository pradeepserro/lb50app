package com.lb50.app

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import java.util.concurrent.atomic.AtomicInteger

@ReactModule(name = ForegroundNotificationModule.NAME)
class ForegroundNotificationModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME

  @ReactMethod
  fun show(title: String, body: String) {
    if (
      Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
        reactApplicationContext.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) !=
          PackageManager.PERMISSION_GRANTED
    ) {
      return
    }

    val notificationManager =
      reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    if (
      Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
        notificationManager.getNotificationChannel(CHANNEL_ID) == null
    ) {
      notificationManager.createNotificationChannel(
        NotificationChannel(
          CHANNEL_ID,
          reactApplicationContext.getString(R.string.app_name),
          NotificationManager.IMPORTANCE_HIGH,
        ),
      )
    }

    val launchIntent =
      reactApplicationContext.packageManager
        .getLaunchIntentForPackage(reactApplicationContext.packageName)
        ?.apply {
          addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }
    val contentIntent =
      launchIntent?.let {
        PendingIntent.getActivity(
          reactApplicationContext,
          0,
          it,
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
      }

    @Suppress("DEPRECATION")
    val notificationBuilder =
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        Notification.Builder(reactApplicationContext, CHANNEL_ID)
      } else {
        Notification.Builder(reactApplicationContext)
      }

    notificationBuilder
      .setSmallIcon(reactApplicationContext.applicationInfo.icon)
      .setContentTitle(title)
      .setContentText(body)
      .setStyle(Notification.BigTextStyle().bigText(body))
      .setAutoCancel(true)
      .setCategory(Notification.CATEGORY_MESSAGE)
      .setPriority(Notification.PRIORITY_HIGH)

    contentIntent?.let(notificationBuilder::setContentIntent)
    notificationManager.notify(nextNotificationId.getAndIncrement(), notificationBuilder.build())
  }

  companion object {
    const val NAME = "ForegroundNotification"
    private const val CHANNEL_ID = "lb50_foreground_notifications"
    private val nextNotificationId = AtomicInteger(1)
  }
}
