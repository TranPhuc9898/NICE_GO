export interface ICardOrder {
  created_at?: string; // "2021-09-29 00:00:00"
  deleted_at?: string | null; // null
  driver_id?: number; // 0
  from_location?: string; // "Hồ Chí Minh"
  id?: number; // 1
  partner_id?: number; // 0
  price?: number; // 850000
  property?: {
    name?: string; // "Nguyễn Văn A"
    phone?: string; // "0123456789"
  };
  status?: string; // "waiting"
  to_location?: string; // "Vũng Tàu"
  updated_at?: string; // "2021-09-29 00:00:00"
  user_id?: number; // 1
}
// Pressable onPress
