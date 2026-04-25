import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey:            "AIzaSyCJqqCzt_xppIt0lg3ItQfPwoR9uLWRWZI",
    authDomain:        "lolex0204.firebaseapp.com",
    projectId:         "lolex0204",
    storageBucket:     "lolex0204.firebasestorage.app",
    messagingSenderId: "940620254622",
    appId:             "1:940620254622:web:edca80d191423cd460da8f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);