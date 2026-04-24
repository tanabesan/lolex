// ============================================================
//  sync.js  —  LOL.ex 設定をFirestoreと同期する
// ============================================================
import { db }   from "./firebase-config.js";
import { auth } from "./firebase-config.js";
import {
    doc, getDoc, setDoc, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// LOL.ex 拡張が localStorage に保存しているキー一覧
const LOLEX_KEYS = [
    "yt-videoId",
    "yt-playlistId",
    "yt-last-time",
    "customBackgroundUrl",
    "customBackgroundList",
    "yt-is-visible",
    "yt-loop",
    "yt-shuffle",
    "airMoveAutoSwitchEnabled",
    "lolex-language",
    "lolex-primary-color",
    "lolex-secondary-color",
    "yt-collapsed",
    "yt-volume",
    "yt-card-visible",
    "lolex-yt-hotkey",
    "lolex-yt-float-btn",
];

// コース別 Air Move キーを動的に追加
const COURSE_IDS = [
    "beacon-bay","boulder-hill","circus-contest","devils-trick","dash-cup",
    "escape-tsunami","gravity-gates","hammer-ville","jungle-temple","kittie-kegs",
    "lava-lake","mecha-maze","mill-valley","monster-manor","polar-path",
    "123-red-light","nasty-seals","rickety-run","risky-cliffs","shark-park",
    "silly-slide","spiky-slopes","splash-dash","tumble-town","tricky-traps","ufo-attack",
];
COURSE_IDS.forEach(id => LOLEX_KEYS.push(`stopAirMove_${id}`));

// ---- localStorageから設定を収集 ----
export function collectSettings() {
    const settings = {};
    LOLEX_KEYS.forEach(key => {
        const val = localStorage.getItem(key);
        if (val !== null) settings[key] = val;
    });
    return settings;
}

// ---- Firestoreへアップロード（クラウドへ保存） ----
export async function uploadSettings() {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const settings = collectSettings();
    await setDoc(doc(db, "users", user.uid, "lolex", "settings"), {
        ...settings,
        _updatedAt: serverTimestamp(),
        _version: "0.81",
    });
    return settings;
}

// ---- Firestoreからダウンロード（クラウドから復元） ----
export async function downloadSettings() {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const snap = await getDoc(doc(db, "users", user.uid, "lolex", "settings"));
    if (!snap.exists()) return null;

    const data = snap.data();
    const restored = {};
    LOLEX_KEYS.forEach(key => {
        if (data[key] !== undefined) {
            localStorage.setItem(key, data[key]);
            restored[key] = data[key];
        }
    });
    return restored;
}

// ---- 最終更新日時を取得 ----
export async function getLastSyncTime() {
    const user = auth.currentUser;
    if (!user) return null;
    const snap = await getDoc(doc(db, "users", user.uid, "lolex", "settings"));
    if (!snap.exists()) return null;
    const ts = snap.data()._updatedAt;
    return ts ? ts.toDate() : null;
}
