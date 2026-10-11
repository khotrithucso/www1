let wakeLock = null;

// Giữ màn hình luôn sáng chìm (Standby)
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
    }
  } catch (err) {
    console.log('WakeLock error:', err);
  }
}

// Đồng hồ hiển thị chìm tiết kiệm pin
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').innerText = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// Bắt sự kiện chạm 2 lần (Double Tap) để mở màn hình
let lastTap = 0;
document.addEventListener('touchend', function (e) {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  
  if (tapLength < 300 && tapLength > 0) {
    // Đã chạm 2 lần thành công
    unlockScreen();
    e.preventDefault();
  }
  lastTap = currentTime;
});

function unlockScreen() {
  if (wakeLock !== null) {
    wakeLock.release();
    wakeLock = null;
  }
  // Hiệu ứng mở sáng màn hình
  document.body.style.backgroundColor = '#ffffff';
  document.getElementById('lockScreen').innerHTML = '<h2 style="color:#000; margin-top:50vh;">ĐÃ MỞ KHÓA!</h2>';
  
  setTimeout(() => {
    // Reset lại trạng thái chờ khóa tiếp theo
    location.reload();
  }, 1500);
}

requestWakeLock();
