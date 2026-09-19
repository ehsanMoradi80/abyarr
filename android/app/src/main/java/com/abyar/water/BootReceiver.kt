package com.abyar.water

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
            intent.action == Intent.ACTION_MY_PACKAGE_REPLACED ||
            intent.action == "android.intent.action.QUICKBOOT_POWERON") {

            val prefs = context.getSharedPreferences("abyar_alarm_prefs", Context.MODE_PRIVATE)
            val enabled = prefs.getBoolean("reminder_enabled", true)
            if (enabled) {
                val intervalMinutes = prefs.getInt("interval_minutes", 60).coerceAtLeast(1)
                AlarmReceiver.scheduleExactAlarm(context, intervalMinutes)
            }
        }
    }
}
