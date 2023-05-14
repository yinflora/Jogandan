import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
  BoardTemplateType,
  FormInputsType,
  ItemType,
  LoginFormType,
  SignupFormType,
} from '../types/types';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'jogandan-2023.firebaseapp.com',
  projectId: 'jogandan-2023',
  storageBucket: 'jogandan-2023.appspot.com',
  messagingSenderId: '890420058309',
  appId: '1:890420058309:web:c7f6bb4d34943abc77b8ac',
  measurementId: 'G-80Q52MX1Q0',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});

const USER_DEFAULT_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/jogandan-2023.appspot.com/o/userPhoto.png?alt=media&token=679fd51a-4928-4201-870e-1d9b2b592e3f';

const googleLogin = async () => {
  try {
    const { user } = await signInWithPopup(auth, provider);
    const userInfo = await createUser(user, null);
    return userInfo;
  } catch (error) {
    console.error(error);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
};

const nativeSignup = async (form: SignupFormType) => {
  const { name, email, password } = form;
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const userData = await createUser(user, name);
  return userData;
};

const nativeLogin = async (form: LoginFormType) => {
  const { email, password } = form;
  await signInWithEmailAndPassword(auth, email, password);
};

const createUser = async (userAuth: User, name: string | null) => {
  const userRef = doc(db, 'users', userAuth.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data();
  }

  const authProvider = userAuth.providerData[0].providerId;
  const { template } = (await getTemplate()) as BoardTemplateType;
  const { displayName, email, photoURL, uid } = userAuth;

  try {
    const userData = {
      name: authProvider === 'password' ? name : displayName,
      email,
      image: authProvider === 'password' ? USER_DEFAULT_IMAGE : photoURL,
      uid,
      visionBoard: {
        data: template,
        isEdited: false,
        lastModified: serverTimestamp(),
      },
    };

    await setDoc(userRef, userData);
    return userData;
  } catch (error) {
    console.error(error);
  }
};

const getUser = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    return userDoc.data();
  } catch (error) {
    console.error(error);
  }
  return null;
};

const updateUser = async (url: string) => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);

    await updateDoc(userRef, {
      image: url,
    });
  } catch (error) {
    console.error(error);
  }
};

const uploadItem = async (form: FormInputsType) => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const { name, category, status, description, images } = form;
    const itemsRef = collection(db, 'users', user.uid, 'items');
    const { id } = await addDoc(itemsRef, {
      name,
      category,
      status,
      created: serverTimestamp(),
      description,
      images,
      processedDate: status === '已處理' ? serverTimestamp() : '',
    });

    const uploadedItemRef = doc(db, 'users', user.uid, 'items', id);

    await updateDoc(uploadedItemRef, {
      id,
    });
  } catch (error) {
    console.error(error);
  }
};

const getItems = async () => {
  const user = auth.currentUser;
  if (!user) return;
  const itemsRef = collection(db, 'users', user.uid, 'items');
  const itemsQuery = query(itemsRef, orderBy('created', 'desc'));
  const items: DocumentData[] = [];

  const querySnapshot = await getDocs(itemsQuery);
  querySnapshot.forEach((document) => items.push(document.data()));

  return items;
};

const updateItem = async (
  itemId: string,
  newForm: FormInputsType | ItemType
) => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const itemDocRef = doc(db, 'users', user.uid, 'items', itemId);
    await updateDoc(itemDocRef, {
      ...newForm,
      processedDate: newForm.status === '已處理' ? serverTimestamp() : '',
    });
  } catch (error) {
    console.error(error);
  }
};

const getTemplate = async () => {
  try {
    const TEMPLATE_ID = 'eDuLEGPS3NCJsyeIYzXl';
    const templatesRef = doc(db, 'templates', TEMPLATE_ID);
    const docSnap = await getDoc(templatesRef);
    return docSnap.data();
  } catch (error) {
    console.error(error);
  }
};

const saveBoard = async (boardData: object, isEdited: boolean) => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);

    await updateDoc(userRef, {
      visionBoard: {
        data: boardData,
        lastUpdated: serverTimestamp(),
        isEdited,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export {
  storage,
  auth,
  googleLogin,
  logout,
  nativeSignup,
  nativeLogin,
  getUser,
  updateUser,
  uploadItem,
  getItems,
  updateItem,
  getTemplate,
  saveBoard,
};
