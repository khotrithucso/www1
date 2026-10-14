import { AdMob, BannerAdSize, BannerAdPosition, RewardAdPluginEvents } from '@capacitor-community/admob';

// Bắt lỗi JS toàn cục hiển thị Alert thay vì văng app
window.onerror = function (message, source, lineno, colno, error) {
  alert("LỖI RUNTIME APP:\n" + message + "\nTại dòng: " + lineno);
  return true;
};

function log(msg) {
  const logBox = document.getElementById('logBox');
  if (logBox) {
    const time = new Date().toLocaleTimeString('vi-VN');
    logBox.innerHTML += `<br>[${time}] ${msg}`;
    logBox.scrollTop = logBox.scrollHeight;
  }
}

// 0. Khởi tạo AdMob SDK
async function initAdMob() {
  try {
    await AdMob.initialize({
      testingDevices: ['20775d1031133059'],
      initializeForTesting: true,
    });
    log("✅ AdMob SDK đã khởi tạo thành công!");
  } catch (err) {
    log("❌ Lỗi khởi tạo AdMob: " + (err.message || JSON.stringify(err)));
  }
}

// 1. Banner Ad (Hiện ở đáy màn hình)
let isBannerShow = false;
document.getElementById('btnBanner').addEventListener('click', async () => {
  if (!isBannerShow) {
    try {
      await AdMob.showBanner({
        adId: 'ca-app-pub-3940256099942544/6300978111', // Test Banner ID
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      });
      log("📺 Đã hiện Banner Ad dưới đáy màn hình!");
      document.getElementById('btnBanner').innerText = "1. Ẩn Banner Ad";
      isBannerShow = true;
    } catch (e) {
      log("❌ Lỗi Banner: " + e.message);
    }
  } else {
    try {
      await AdMob.hideBanner();
      await AdMob.removeBanner();
      log("🙈 Đã ẩn Banner Ad!");
      document.getElementById('btnBanner').innerText = "1. Hiện Banner Ad (320x50)";
      isBannerShow = false;
    } catch (e) {
      log("❌ Lỗi ẩn Banner: " + e.message);
    }
  }
});

// 2. App Open Ad (Quảng cáo mở ứng dụng)
document.getElementById('btnAppOpen').addEventListener('click', async () => {
  log("⏳ Đang tải App Open Ad...");
  try {
    await AdMob.prepareInterstitial({
      adId: 'ca-app-pub-3940256099942544/9257395921', // Test App Open ID
    });
    await AdMob.showInterstitial();
    log("🚀 Đã mở App Open Ad thành công!");
  } catch (e) {
    log("❌ Lỗi App Open Ad: " + e.message);
  }
});

// 3. Interstitial Ad (Quảng cáo xen kẽ full màn hình)
document.getElementById('btnInterstitial').addEventListener('click', async () => {
  log("⏳ Đang tải Interstitial Ad...");
  try {
    await AdMob.prepareInterstitial({
      adId: 'ca-app-pub-3940256099942544/1033173712', // Test Interstitial ID
    });
    await AdMob.showInterstitial();
    log("🎬 Đã hiển thị Interstitial Ad full màn hình!");
  } catch (e) {
    log("❌ Lỗi Interstitial Ad: " + e.message);
  }
});

// 4. Rewarded Video Ad (Quảng cáo Video có thưởng)
document.getElementById('btnRewarded').addEventListener('click', async () => {
  log("⏳ Đang tải Rewarded Video Ad...");
  try {
    AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
      log(`🎁 NGƯỜI DÙNG ĐÃ XEM HẾT VIDEO! Nhận thưởng: ${reward.amount} ${reward.type}`);
    });

    await AdMob.prepareRewardVideoAd({
      adId: 'ca-app-pub-3940256099942544/5224354917', // Test Rewarded ID
    });
    await AdMob.showRewardVideoAd();
    log("🎬 Đang chiếu Rewarded Video Ad (Bắt buộc xem hết)...");
  } catch (e) {
    log("❌ Lỗi Rewarded Video: " + e.message);
  }
});

// 5. Rewarded Interstitial Ad (Xen kẽ thưởng)
document.getElementById('btnRewardedInter').addEventListener('click', async () => {
  log("⏳ Đang tải Rewarded Interstitial Ad...");
  try {
    await AdMob.prepareRewardVideoAd({
      adId: 'ca-app-pub-3940256099942544/5354046379', // Test Rewarded Interstitial ID
    });
    await AdMob.showRewardVideoAd();
    log("🎬 Đã chiếu Rewarded Interstitial Ad!");
  } catch (e) {
    log("❌ Lỗi Rewarded Interstitial: " + e.message);
  }
});

// 6. Native Ad (Quảng cáo tự nhiên)
document.getElementById('btnNative').addEventListener('click', async () => {
  log("⏳ Đang tải Native Ad...");
  try {
    await AdMob.showBanner({
      adId: 'ca-app-pub-3940256099942544/2247696110', // Test Native Advanced ID
      adSize: BannerAdSize.MEDIUM_RECTANGLE,
      position: BannerAdPosition.CENTER,
    });
    log("🖼️ Đã hiển thị Native Ad (MREC 300x250) ở chính giữa!");
  } catch (e) {
    log("❌ Lỗi Native Ad: " + e.message);
  }
});

// Khởi chạy khi màn hình sẵn sàng
window.addEventListener('DOMContentLoaded', () => {
  initAdMob();
});
