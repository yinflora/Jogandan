import { Timestamp } from 'firebase/firestore';

type SignupForm = {
  name: string;
  email: string;
  password: string;
};

type ItemForm = {
  name: string;
  category: Category;
  status: Status;
  description: string;
  images: string[];
};

type Category =
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

type Status = '保留' | '待處理' | '已處理';

type Item = {
  id: string;
  name: string;
  status: Status;
  category: Category;
  created: Timestamp;
  processedDate: Timestamp | '';
  description: string;
  images: string[];
};

type User = {
  uid: string;
  name: string;
  email: string;
  image: string;
  level: string;
  visionBoard: VisionBoard;
};

type VisionBoard = {
  data: object;
  isEdited: boolean;
  lastModified: Timestamp | null;
};

export type { SignupForm, ItemForm, Category, Status, Item, User };
