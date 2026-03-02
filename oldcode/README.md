# The Dating Game App

## Frontend
React native with Typescript using Expo for convenience

## Backend
Uses Firebase as the backend.  Copy & paste firebase WEB config JSON into app.config.js like so:

```
export default ({ config }) => {
    return {
        ...config,
        extra: {
            firebaseCreds: {
                apiKey: "asdfasdfasdf",
                authDomain: "asdf-32fd69.firebaseapp.com",
                projectId: "asdf-32fd69",
                storageBucket: "asdf-32fd69.appspot.com",
                messagingSenderId: "232423432423",
                appId: "1:34234234234:web:f231cba11232bf12ac1112",
                measurementId: "G-OIUCNX2N"
            }
        }
    };
};
```

### To Run

install expo and run ```expo start```