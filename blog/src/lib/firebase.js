// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import Home from "../pages/Home";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

export const addPost = async (title, content) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      title,
      content,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Firesotre에 게시글 추가 중 오류 발생:", error);
  }
};

export const getPosts = async () => {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Firestore에서 게시글 불러오기 오류:", error);
    return [];
  }
};

export const getPostById = async (id) => {
  try {
    const postRef = doc(db, "posts", id);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      return { id: postSnap.id, ...postSnap.data() };
    } else {
      return null; // 문서가 존재하지 않음
    }
  } catch (error) {
    console.error("Firestore에서 게시글 가져오기 오류:", error);
    return null;
  }
};

// 게시글 업데이트
export const updatePost = async (id, title, content) => {
  try {
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      title,
      content,
    });
    console.log(`Firestore에서 게시글 업데이트 완료 (ID: ${id})`);
  } catch (error) {
    console.error("Firestore에서 게시글 업데이트 오류:", error);
  }
};

// 게시글 삭제
export const deletePost = async (id) => {
  try {
    const postRef = doc(db, "posts", id);
    await deleteDoc(postRef);
    console.log(`Firestore에서 게시글 삭제 완료 (ID: ${id})`);
  } catch (error) {
    console.error("Firestore에서 게시글 삭제 오류:", error);
  }
};
