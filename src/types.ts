export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Cancelled';

export interface Order {
  id: string;
  timestamp: string;
  customerName: string;
  phoneNumber: string;
  wilayaCode: number;
  wilayaNameAr: string;
  wilayaNameFr: string;
  address: string;
  shippingCompany: 'Yalidine Express' | 'ZR Express';
  shippingType: 'Home' | 'Office';
  shippingFee: number;
  productPrice: number;
  totalPrice: number;
  quantity: number;
  status: OrderStatus;
}

export interface Review {
  id: string;
  name: string;
  wilaya: string;
  rating: number;
  text: string;
  date: string;
  avatarColor: string;
}

export interface Wilaya {
  code: number;
  nameAr: string;
  nameFr: string;
  region: 'North' | 'South' | 'Highlands';
  yalidineHomeFee: number;
  yalidineOfficeFee: number;
  zrHomeFee: number;
  zrOfficeFee: number;
}
