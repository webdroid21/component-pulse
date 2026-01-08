// ----------------------------------------------------------------------

export type IAddressItem = {
  id: string;
  name: string;
  fullAddress: string;
  phoneNumber: string;
  addressType: 'home' | 'office' | 'other';
  primary?: boolean;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
};
