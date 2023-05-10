import { Timestamp } from 'firebase/firestore';

type Status =
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

type Category = '保留' | '待處理' | '已處理';

type Item = {
  id: string;
  name: string;
  status: Status;
  category: Category;
  created: Timestamp;
  processedDate: Timestamp;
  description: string;
  images: string[];
};

export type { Item };
