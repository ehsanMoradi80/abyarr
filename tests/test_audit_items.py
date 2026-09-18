# Automated audit verification tests
# Run with: pytest tests/test_audit_items.py -v

import os

def test_splash_duplicate_removed():
    with open('index.html', 'r') as f: content = f.read()
    assert 'noosh-logo-box' not in content

def test_auth_fallback_removed():
    with open('src/lib/clerk.tsx', 'r') as f: content = f.read()
    assert 'throw new Error' in content

def test_app_context_has_bearer_token():
    with open('src/context/AppContext.tsx', 'r') as f: content = f.read()
    assert 'bearerToken' in content and 'Authorization' in content

def test_storage_user_scoped():
    with open('native/storage.js', 'r') as f: content = f.read()
    assert 'userStorageKey' in content

def test_rls_policy_exists():
    assert os.path.exists('supabase/migrations/010_abyar_clerk_rls_fix.sql')

def test_assets_exist():
    assert os.path.exists('assets/splash.png')
    assert os.path.exists('assets/adaptive-icon-foreground.png')
    assert os.path.exists('assets/sounds/reminder.wav')

def test_tour_modal_has_measure_target():
    with open('native/TourModal.js', 'r') as f: content = f.read()
    assert 'measureTarget' in content and 'calloutTop' in content

def test_main_application_has_alarm_hook():
    with open('android/app/src/main/java/com/abyar/water/MainApplication.kt', 'r') as f: content = f.read()
    assert 'alarm' in content.lower() or 'boot' in content.lower()
