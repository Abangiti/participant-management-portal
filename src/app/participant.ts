
export interface Participant {
  id: number;
  name: string;
  bic: string;
  shortName: string;
  address: string;
  email: string;
  phoneNumber: string;
  status: 'ACTIVE' | 'INACTIVE';
}
