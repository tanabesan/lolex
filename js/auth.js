// ============================================================
//  auth.js  —  ログイン / 新規登録 / ログアウト
// ============================================================
import { auth } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ---- 現在のユーザーを監視し、変化をコールバックで通知 ----
export function watchAuth(callback) {
    return onAuthStateChanged(auth, callback);
}

// ---- 新規登録 ----
export async function register(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
        await updateProfile(cred.user, { displayName });
    }
    return cred.user;
}

// ---- ログイン ----
export async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
}

// ---- ログアウト ----
export async function logout() {
    await signOut(auth);
}