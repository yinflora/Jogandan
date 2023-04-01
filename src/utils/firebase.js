import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBKj7wtGKt8M2s6uaonIvtRHUXvTgmCAxM',
  authDomain: 'jogandan-2023.firebaseapp.com',
  projectId: 'jogandan-2023',
  storageBucket: 'jogandan-2023.appspot.com',
  messagingSenderId: '890420058309',
  appId: '1:890420058309:web:c7f6bb4d34943abc77b8ac',
  measurementId: 'G-80Q52MX1Q0',
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export async function getProcessedItems() {
  const itemsRef = collection(db, 'users', '07WrsXZ2x794a2FJFkPe', 'items');
  // const itemsQuery = query(itemsRef, where('status', '==', '已處理'));
  const itemsQuery = query(itemsRef, where('status', '==', '保留'));

  const querySnapshot = await getDocs(itemsQuery);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, ' => ', doc.data());
  });
}
