import { Timestamp } from 'firebase/firestore';

type SignupFormType = {
  name: string;
  email: string;
  password: string;
  [key: string]: string;
};

type LoginFormType = {
  email: string;
  password: string;
  [key: string]: string;
};

type SignupErrorType = {
  code: 'auth/ail-already-in-use' | 'auth/weak-password' | 'auth/invalid-email';
};

type LoginErrorType = {
  code: 'auth/user-not-found' | 'auth/wrong-password' | 'auth/invalid-email';
};

type ItemFormType = {
  name: string;
  category: CategoryType;
  status: StatusType;
  description: string;
  images: string[];
};

type CategoryType =
  | '居家生活'
  | '服飾配件'
  | '美妝保養'
  | '3C產品'
  | '影音產品'
  | '書報雜誌'
  | '體育器材'
  | '寵物用品'
  | '食物及飲料'
  | '興趣及遊戲'
  | '紀念意義'
  | '其他';

type StatusType = '保留' | '待處理' | '已處理';

type ItemType = {
  id: string;
  name: string;
  status: StatusType;
  category: CategoryType;
  created: Timestamp;
  processedDate: Timestamp | '';
  description: string;
  images: string[];
};

type UserType = {
  uid: string;
  name: string;
  email: string;
  image: string;
  level: string;
  visionBoard: VisionBoardType;
};

type BoardTemplateType = {
  id: string;
  template: object;
};

type BoardDataType = {
  background: string;
  hoverCursor: string;
  objects: [];
  version: string;
};

type VisionBoardType = {
  data: BoardDataType;
  template?: BoardDataType;
  isEdited: boolean;
  lastModified: Timestamp | null;
};

type FormInputsType = {
  name: string;
  category: CategoryType | '請選擇類別' | '';
  status: StatusType | '請選擇狀態' | '';
  description?: string;
  images: string[];
  [key: string]: string | string[] | undefined;
};

export type {
  SignupFormType,
  SignupErrorType,
  LoginErrorType,
  LoginFormType,
  ItemFormType,
  CategoryType,
  StatusType,
  ItemType,
  UserType,
  BoardTemplateType,
  BoardDataType,
  VisionBoardType,
  FormInputsType,
};
