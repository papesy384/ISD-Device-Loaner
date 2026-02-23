export type ProfileRole = "admin" | "student";

export interface Profile {
  id: string;
  email: string;
  role: ProfileRole;
  preferred_lang: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export type DeviceStatus = "available" | "loaned" | "repair";
export type DeviceCondition = "new" | "good" | "fair" | "poor";

export interface Device {
  id: string;
  name: string;
  serial_number: string;
  status: DeviceStatus;
  condition: DeviceCondition;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: string;
  user_id: string;
  device_id: string;
  checkout_at: string;
  due_at: string;
  returned_at: string | null;
  notified_24h: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface LoanWithDetails extends Loan {
  device?: Device | null;
  profile?: Profile | null;
}
