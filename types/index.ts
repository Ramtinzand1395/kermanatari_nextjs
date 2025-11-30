// [#001A6E] hover [#010c32]
// [#377dff] hover 0057f9
export interface CartItem {
  id: string | number;
  title: string;
  image: string;
  price: number;
  quantity: number;
  discountPrice: number | null;
  sku: string;
}

export interface CartStoreStateType {
  cart: CartItem[];
  hasHydrated: boolean;
}

// export interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   parentId: number | null;
//   parent: string;
//   createdAt: string;
//   updatedAt: string;
// }

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  parent?: Category;
  subcategories: Category[];
  products: Product[];
}

export interface Product {
  id: number;
  sku: string;
  title: string;
  slug: string;
  description: string;
  shortDesc?: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  brand?: string;
  mainImage: string;
  createdAt: string;
  updatedAt: string;
  userId?: number;
  categoryId: number;

  tags: Tag[];
  images: ProductImage[];
  specifications: Specification[];
  comments: Comment[];
  favorites: Favorite[];
  OrderItem: OrderItem[];
  category: Category;
  User?: User;
}
export interface Tag {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}
export interface Favorite {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  user: User;
  product: Product;
}
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  total: number;

  order: Order;
  product: Product;
}
export interface ProductImage {
  id: number;
  url: string;
  productId: number;
  product: Product;
}
export interface Order {
  id: number;
  userId?: number;
  addressId?: number;
  totalPrice: number;
  shippingCost: number;
  finalPrice: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  trackingCode?: string;
  invoiceNumber?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;

  user?: User;
  address?: Address;
  items: OrderItem[];
}

export interface Comment {
  id: number;
  text: string;
  rating: number;
  userId: number;
  productId?: number;
  verified: boolean;
  createdAt: string;
  user?: User;
  product?: Product;
}



export interface Address {
  id: number;
  userId: number;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  plaque: string;
  unit: string;
  receiverPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
  role: "user" | "admin" | "superadmin"; // اگر نقش‌ها محدود هستند
  otps?: OTP[]; // وابسته به مدل OTP که باید جدا تعریف شود
  newsletter: boolean;
  gender?: string;
  birthday?: string;
  nationalCode?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  // علاقه‌مندی‌ها را می‌توان اینجا اضافه کرد اگر مدلش را داری
}

export interface OTP {
  id: number;
  code: string;
  userId: number;
  createdAt: string | Date;
  expiresAt: string | Date;
}

export type UserProfileForm = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
} & User;

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export interface Customer {
  id: number;
  name: string;
  mobile: string;
  lastName: string;
  sex: string;
  birthday?: string;
  description?: string;
  persianDate?: string;
  createdAt: string;
  updatedAt: string;

  CustomerOrder: CustomerOrder[];
}

export interface CustomerOrder {
  id: number;
  list: string[]; // JSON string
  price: number;
  customerId: number;
  description?: string;
  consoleType: string;
  deliveryStatus?: string;
  persianDate?: string;
  deliveryDate: string;
  deliveryCode: string;
  createdAt: string;
  updatedAt: string;

  customer: Customer;
}

export interface GameList {
  id: number;
  platform: string;
  createdAt: string;
  updatedAt: string;

  items: GameListItem[];
}

export interface GameListItem {
  id: number;
  name: string;
  gameListId: number;
  gameList: GameList;
}

export interface Specification {
  id: number;
  title: string;
  productId?: number;
  product?: Product;
  items: SpecificationItem[];
}

export interface SpecificationItem {
  id: number;
  key: string;
  value: string;
  specificationId: number;
  specification: Specification;
}

export type ProfileFormPayload = {
  name: string;
  lastName: string;
  gender?: string;
  birthday?: string;
  nationalCode?: string;
  email: string;
  mobile: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};
