export type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};

export type Brand = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};

export type StoreUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
};

export type Product = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  category: Category;
  brand: Brand;
  ratingsAverage: number;
  ratingsQuantity: number;
  sold: number;
};

export type Subcategory = {
  _id: string;
  name: string;
  slug: string;
};

export type Review = {
  _id: string;
  review: string;
  rating: number;
  userName: string;
  createdAt: string;
};

export type ProductDetail = Product & {
  subcategory: Subcategory[];
  reviews: Review[];
};

export type CatalogResult<T> = {
  items: T[];
  error: string | null;
};
