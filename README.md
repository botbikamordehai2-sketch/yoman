# יומן · פינבורד פתקיות לפרויקטים

PWA אישית — פתקים בסגנון Google Keep עם סינון לפי פרויקט/תגית, צבעים, נעיצה,
צ׳קליסטים, חיפוש, מצב כהה. כל המידע נשמר ב-localStorage בלבד (פרטי לחלוטין).

## פריסה ל-GitHub Pages

```bash
git init
git add .
git commit -m "init: יומן PWA"
git branch -M main
git remote add origin https://github.com/<USER>/<REPO>.git
git push -u origin main
```

ואז ב-GitHub: **Settings → Pages → Source: `main` / `/ (root)` → Save**.

תוך דקה-שתיים האפליקציה תהיה זמינה ב:
`https://<USER>.github.io/<REPO>/`

## התקנה במסך הבית

- **iOS (Safari):** פתיחת הקישור → ⤴ שיתוף → "הוסף למסך הבית"
- **Android (Chrome):** פתיחת הקישור → תפריט שלוש-נקודות → "התקן אפליקציה"

## עדכון

עדכון של קובץ + `git push` ← בפתיחה הבאה ה-Service Worker מחליף גרסה אוטומטית.
לכפיית רענון מיידי: לרענן את הדף פעמיים, או להעלות את הגרסה ב-`sw.js`
(`CACHE = 'yoman-v2'` וכו׳).

## קבצים

| קובץ | מה זה |
|---|---|
| `index.html` | shell + CSS tokens + טעינת React |
| `pinboard.jsx` | כל הקומפוננטות + state + localStorage |
| `manifest.webmanifest` | מטא ל-PWA (שם, אייקונים, צבעים) |
| `sw.js` | Service Worker — offline + cache |
| `icons/` | אייקונים בגדלים 192/512/180 |
