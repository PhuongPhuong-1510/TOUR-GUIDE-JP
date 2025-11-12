// testSupabase.js
import { supabase } from './supabase.js'; // phải đúng tên và đường dẫn

async function testConnection() {
  try {
    // Thử lấy 5 bản ghi từ bảng 'todos' (nếu có)
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Lỗi khi truy vấn Supabase:', error.message);
    } else {
      console.log('✅ Kết nối Supabase thành công! Dữ liệu mẫu:', data);
    }
  } catch (err) {
    console.error('❌ Lỗi kết nối Supabase:', err.message);
  }
}

testConnection();
