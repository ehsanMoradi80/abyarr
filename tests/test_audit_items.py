# Automated audit verification tests
# Run with: python3 tests/test_audit_items.py or pytest tests/test_audit_items.py -v

import os
import wave

def test_splash_duplicate_removed():
    with open('index.html', 'r', encoding='utf-8') as f: content = f.read()
    assert 'noosh-logo-box' not in content

def test_auth_fallback_removed():
    with open('src/lib/clerk.tsx', 'r', encoding='utf-8') as f: content = f.read()
    assert 'throw new Error' in content

def test_app_context_has_bearer_token():
    with open('src/context/AppContext.tsx', 'r', encoding='utf-8') as f: content = f.read()
    assert 'bearerToken' in content and 'Authorization' in content

def test_storage_user_scoped():
    with open('native/storage.js', 'r', encoding='utf-8') as f: content = f.read()
    assert 'userStorageKey' in content

def test_rls_policy_exists():
    assert os.path.exists('supabase/migrations/010_abyar_clerk_rls_fix.sql')

def test_assets_exist():
    assert os.path.exists('assets/splash.png')
    assert os.path.exists('assets/adaptive-icon-foreground.png')
    assert os.path.exists('assets/sounds/reminder.wav')

def test_wav_audio_valid_header_and_sound():
    path = 'assets/sounds/reminder.wav'
    assert os.path.exists(path)
    with wave.open(path, 'rb') as w:
        nchannels = w.getnchannels()
        sampwidth = w.getsampwidth()
        framerate = w.getframerate()
        nframes = w.getnframes()
        assert nchannels >= 1, "Must have at least 1 audio channel"
        assert sampwidth >= 2, "Must be 16-bit audio"
        assert framerate >= 22050, "Sample rate must be >= 22.05kHz"
        assert nframes > 1000, "Audio file must contain non-empty sound data"

def test_tour_modal_has_measure_target():
    with open('native/TourModal.js', 'r', encoding='utf-8') as f: content = f.read()
    assert 'measureTarget' in content and 'calloutTop' in content

def test_main_application_has_alarm_hook():
    with open('android/app/src/main/java/com/abyar/water/MainApplication.kt', 'r', encoding='utf-8') as f: content = f.read()
    assert 'alarm' in content.lower() or 'boot' in content.lower()

def test_android_appwidget_providers_exist():
    assert os.path.exists('android/app/src/main/java/com/abyar/water/WaterWidgetProvider.kt')
    assert os.path.exists('android/app/src/main/java/com/abyar/water/StreakWidgetProvider.kt')
    assert os.path.exists('android/app/src/main/java/com/abyar/water/WidgetBridgeModule.kt')
    assert os.path.exists('android/app/src/main/java/com/abyar/water/WidgetPackage.kt')
    assert os.path.exists('android/app/src/main/res/layout/widget_water_4x1.xml')
    assert os.path.exists('android/app/src/main/res/layout/widget_streak_2x2.xml')

def test_android_manifest_components_registered():
    with open('android/app/src/main/AndroidManifest.xml', 'r', encoding='utf-8') as f: content = f.read()
    assert 'WaterWidgetProvider' in content
    assert 'StreakWidgetProvider' in content
    assert 'AlarmReceiver' in content
    assert 'BootReceiver' in content
    assert 'RECEIVE_BOOT_COMPLETED' in content
    assert 'SCHEDULE_EXACT_ALARM' in content

def test_offline_outbox_services_exist():
    assert os.path.exists('src/services/offlineOutbox.ts')
    assert os.path.exists('native/outbox.js')
    with open('src/services/offlineOutbox.ts', 'r', encoding='utf-8') as f: ts_outbox = f.read()
    assert 'resolveLogsConflict' in ts_outbox
    assert 'enqueue' in ts_outbox
    with open('native/outbox.js', 'r', encoding='utf-8') as f: js_outbox = f.read()
    assert 'mergeLogs' in js_outbox
    assert 'enqueue' in js_outbox

def test_stack_navigation_implemented_in_app():
    with open('App.js', 'r', encoding='utf-8') as f: content = f.read()
    assert 'navStack' in content
    assert 'push(' in content
    assert 'pop(' in content
    assert 'BackHandler' in content

def test_supabase_realtime_user_filtered_listener():
    with open('src/services/supabaseClient.ts', 'r', encoding='utf-8') as f: content = f.read()
    assert 'subscribeToPartnerRealtime' in content
    assert 'filter' in content
    assert 'user_id=eq.' in content
    assert 'subscribeToPartnerBroadcast' in content

def test_widget_update_after_drink_log():
    with open('App.js', 'r', encoding='utf-8') as f: app_content = f.read()
    assert 'NativeBridgeService.updateWidgetData' in app_content
    with open('src/services/nativeBridge.ts', 'r', encoding='utf-8') as f: bridge_content = f.read()
    assert 'updateWidgetData' in bridge_content

def test_utf8_encoding_clean():
    # Verify key source directories can be read cleanly as UTF-8
    dirs = ['src', 'native', 'android/app/src/main']
    for d in dirs:
        if not os.path.exists(d): continue
        for root, _, files in os.walk(d):
            for file in files:
                if file.endswith(('.ts', '.tsx', '.js', '.kt', '.xml', '.json')):
                    fp = os.path.join(root, file)
                    with open(fp, 'rb') as f:
                        raw = f.read()
                    try:
                        raw.decode('utf-8')
                    except UnicodeDecodeError as e:
                        raise AssertionError(f"File {fp} has invalid UTF-8 encoding: {e}")

if __name__ == '__main__':
    tests = [k for k, v in list(globals().items()) if k.startswith('test_') and callable(v)]
    passed = 0
    failed = 0
    print(f"Running {len(tests)} automated audit verification tests...\n")
    for t in tests:
        try:
            globals()[t]()
            print(f"  PASS: {t}")
            passed += 1
        except Exception as e:
            print(f"  FAIL: {t} -> {e}")
            failed += 1
    print(f"\nAudit Test Summary: {passed} passed, {failed} failed.")
    if failed > 0:
        exit(1)
