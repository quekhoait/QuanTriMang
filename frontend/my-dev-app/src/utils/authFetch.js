export const fetchWithAuth = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('accessToken');
    let res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    // Nếu token hết hạn
    if (res.status === 401) {
      // Gọi API làm mới token
      const refreshRes = await fetch('http://localhost:5999/api/user/refresh-token', {
        method: 'POST',
        credentials: 'include', // Bắt buộc nếu dùng refreshToken trong cookie
      });

      if (!refreshRes.ok) throw new Error('Không thể làm mới token.');

      const { accessToken } = await refreshRes.json();
      localStorage.setItem('accessToken', accessToken);

      // Gửi lại request ban đầu với token mới
      res = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return res;
  } catch (err) {
    console.error('❌ Lỗi fetchWithAuth:', err);
    throw err;
  }
};
