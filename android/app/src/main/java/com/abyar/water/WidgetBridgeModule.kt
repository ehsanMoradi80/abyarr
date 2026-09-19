package com.abyar.water

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments

class WidgetBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WidgetBridge"
    }

    @ReactMethod
    fun updateWidgetData(todayGlasses: Int, goalGlasses: Int, streakDays: Int, promise: Promise) {
        try {
            WaterWidgetProvider.updateWidgetData(reactApplicationContext, todayGlasses, goalGlasses, streakDays)
            StreakWidgetProvider.updateAll(reactApplicationContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("WIDGET_UPDATE_ERROR", e.message)
        }
    }

    @ReactMethod
    fun getWidgetData(promise: Promise) {
        try {
            val prefs = WaterWidgetProvider.getPrefs(reactApplicationContext)
            val map: WritableMap = Arguments.createMap()
            map.putInt("todayGlasses", prefs.getInt(WaterWidgetProvider.KEY_TODAY_GLASSES, 0))
            map.putInt("goalGlasses", prefs.getInt(WaterWidgetProvider.KEY_GOAL_GLASSES, 8))
            map.putInt("streakDays", prefs.getInt(WaterWidgetProvider.KEY_STREAK_DAYS, 1))
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("WIDGET_GET_ERROR", e.message)
        }
    }
}
