export const NOTIFICATIONS = {
  GENERAL_ERROR: 'Etwas ist schief gelaufen. Probiere es erneut.',
  SIGNUP_ERROR: 'Die Registrierung ist fehlgeschlagen. Bitte erneut probieren.',
  EMAIL_FORMAT_ERROR: 'Bitte gib eine E-Mailadresse ein.',
  PROFILE_PICTURE_UPDATE_ERROR: 'Profilbild konnte nicht aktualisiert werden.',
  NO_USER_LOGGED_IN: 'Bitte melde dich an.',

  FIREBASE_INVALID_EMAIL: 'Die E-Mail-Adresse ist ungültig.',
  FIREBASE_USER_DISABLED: 'Dieser Benutzer wurde deaktiviert.',
  FIREBASE_USER_DELETED: 'Es existiert kein Benutzer mit diesen Daten.',
  FIREBASE_INVALID_PASSWORD: 'Das Passwort ist falsch.',
  FIREBASE_EMAIL_EXISTS: 'Diese E-Mail-Adresse wird bereits verwendet.',
  FIREBASE_WEAK_PASSWORD: 'Das Passwort ist zu schwach.',
  FIREBASE_INVALID_LOGIN_CREDENTIALS: 'Ungültige Anmeldedaten.',
  FIREBASE_POPUP_CLOSED_BY_USER: 'Popup geschlossen. Anmeldung abgebrochen.',

  FIREBASE_EXPIRED_OOB_CODE: 'Der Link ist abgelaufen. Bitte fordere eine neue E-Mail an.',
  FIREBASE_INVALID_OOB_CODE:
    'Der Link ist ungültig oder wurde bereits verwendet. Bitte fordere eine neue E-Mail an.',

  PASSWORD_RESET_EMAIL_SENT:
    'Wenn ein Konto mit dieser E-Mail-Adresse existiert, haben wir dir eine E-Mail zum Zurücksetzen des Passworts geschickt.',
  PASSWORD_RESET_PASSWORD_MISMATCH: 'Die eingegebenen Passwörter stimmen nicht überein.',
  PASSWORD_RESET_SUCCESS: 'Dein Passwort wurde erfolgreich geändert.',
} as const;
