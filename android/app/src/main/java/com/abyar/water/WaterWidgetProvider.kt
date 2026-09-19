package com.abyar.water

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Build
import android.widget.RemoteViews

class WaterWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)

        when (intent.action) {
            ACTION_QUICK_ADD_WATER -> {
                val prefs = getPrefs(context)
                val current = prefs.getInt(KEY_TODAY_GLASSES, 0)
                val goal = prefs.getInt(KEY_GOAL_GLASSES, 8)
                val newCount = current + 1

                prefs.edit().putInt(KEY_TODAY_GLASSES, newCount).apply()

                // Refresh all widget instances
                updateAll(context)

                // Broadcast back to React Native app if running
                val broadcastIntent = Intent(ACTION_DRINK_LOGGED_FROM_WIDGET).apply {
                    putExtra("todayGlasses", newCount)
                    setPackage(context.packageName)
                }
                context.sendBroadcast(broadcastIntent)
            }

            ACTION_UPDATE_WIDGET -> {
                val prefs = getPrefs(context)
                val editor = prefs.edit()
                if (intent.hasExtra("todayGlasses")) {
                    editor.putInt(KEY_TODAY_GLASSES, intent.getIntExtra("todayGlasses", 0))
                }
                if (intent.hasExtra("goalGlasses")) {
                    editor.putInt(KEY_GOAL_GLASSES, intent.getIntExtra("goalGlasses", 8))
                }
                if (intent.hasExtra("streakDays")) {
                    editor.putInt(KEY_STREAK_DAYS, intent.getIntExtra("streakDays", 1))
                }
                editor.apply()

                updateAll(context)
            }
        }
    }

    companion object {
        const val PREFS_NAME = "AbyarWidgetPrefs"
        const val KEY_TODAY_GLASSES = "today_glasses"
        const val KEY_GOAL_GLASSES = "goal_glasses"
        const val KEY_STREAK_DAYS = "streak_days"

        const val ACTION_QUICK_ADD_WATER = "com.abyar.water.ACTION_QUICK_ADD_WATER"
        const val ACTION_UPDATE_WIDGET = "com.abyar.water.ACTION_UPDATE_WIDGET"
        const val ACTION_DRINK_LOGGED_FROM_WIDGET = "com.abyar.water.ACTION_DRINK_LOGGED_FROM_WIDGET"

        fun getPrefs(context: Context): SharedPreferences {
            return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        }

        fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            val prefs = getPrefs(context)
            val today = prefs.getInt(KEY_TODAY_GLASSES, 0)
            val goal = prefs.getInt(KEY_GOAL_GLASSES, 8).coerceAtLeast(1)
            val percent = ((today.toFloat() / goal.toFloat()) * 100).toInt().coerceIn(0, 100)

            val views = RemoteViews(context.packageName, R.layout.widget_water_4x1)

            // Update texts and progress bar
            views.setTextViewText(R.id.widget_glasses_text, "$today از $goal لیوان")
            views.setTextViewText(R.id.widget_percent_text, "$percent٪")
            views.setProgressBar(R.id.widget_progress_bar, 100, percent, false)

            // PendingIntent for Quick Add Button
            val addIntent = Intent(context, WaterWidgetProvider::class.java).apply {
                action = ACTION_QUICK_ADD_WATER
            }
            val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }
            val addPendingIntent = PendingIntent.getBroadcast(context, 1001, addIntent, flags)
            views.setOnClickPendingIntent(R.id.widget_btn_quick_add, addPendingIntent)

            // PendingIntent to launch MainActivity on tapping widget body
            val launchIntent = Intent(context, MainActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            }
            val launchPendingIntent = PendingIntent.getActivity(context, 1002, launchIntent, flags)
            views.setOnClickPendingIntent(R.id.widget_root, launchPendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }

        fun updateAll(context: Context) {
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val componentName = ComponentName(context, WaterWidgetProvider::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
            for (id in appWidgetIds) {
                updateAppWidget(context, appWidgetManager, id)
            }
        }

        fun updateWidgetData(context: Context, todayGlasses: Int, goalGlasses: Int, streakDays: Int) {
            val prefs = getPrefs(context)
            prefs.edit()
                .putInt(KEY_TODAY_GLASSES, todayGlasses)
                .putInt(KEY_GOAL_GLASSES, goalGlasses)
                .putInt(KEY_STREAK_DAYS, streakDays)
                .apply()
            updateAll(context)
        }
    }
}
