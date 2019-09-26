# untitled1

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
```
curl -X POST -H "Authorization: key=${AAAAPq8InsM:APA91bFmyzTI57KiPksgwcf5tLAPZHn2bFUXR_v4EMY5zbrG5yfEbMTgfxXV_yaMRYTmDdrFu6In0aqXj-G-eJRnI4LB8OPT5-M1G1zkAwBg40MME7skG1b8PM_ZFPlm0V6hy2MtoHj7}" -H "Content-Type: application/json" -d '{
  "to": "${cyV98RD5XaM:APA91bHPswIj2aKJbVeBM2F04ZvZt7IUr9IsufI8NZP02PLB5wT-ON5Q6eNc7hwfU70aEg5DcodOf0HtXLc5Jkma4Uox5J9GYe4bBdmc4WGvEVFvzj2JYTQuInXiFjdHFJd4O5Qkovfy}",
  "notification": {
    "title": "FCM Message",
    "body": "This is an FCM Message",
    "icon": "./img/icons/android-chrome-192x192.png"
  }
}' https://fcm.googleapis.com/fcm/send
```