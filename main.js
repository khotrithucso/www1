import { AdMob, BannerAdSize, BannerAdPosition, RewardAdPluginEvents } from '@capacitor-community/admob';

// Bắt lỗi JS toàn cục hiển thị Alert
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

// Hàm phụ trợ: Huỷ và xoá sạch khung Banner/MREC đang hiển thị
async function removeCurrentBanner() {
  try {
    await AdMob.hideBanner();
    await AdMob.removeBanner();
  } catch (e) {
    // Bỏ qua nếu chưa có Banner nào khởi tạo
  }
}

// 0. Khởi tạo AdMob SDK
async function initAdMob() {
  try {
    await AdMob.initialize({
      initializeForTesting: true,
    });
    log("✅ AdMob SDK đã khởi tạo thành công!");
  } catch (err) {
    log("❌ Lỗi khởi tạo AdMob: " + (err.message || JSON.stringify(err)));
  }
}

// 1. Banner Ad (Khung 320x50 dưới đáy)
let isBannerShow = false;
let isNativeShow = false;

document.getElementById('btnBanner').addEventListener('click', async () => {
  if (!isBannerShow) {
    try {
      // Xoá khung quảng cáo cũ (nếu Nút 6 đang bật)
      await removeCurrentBanner();
      isNativeShow = false;
      document.getElementById('btnNative').innerText = "6. Test Native Ad (Thẻ 300x250)";

      // Hiện Banner 320x50 ở đáy
      await AdMob.showBanner({
        adId: 'ca-app-pub-3940256099942544/6300978111',
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
    await removeCurrentBanner();
    log("🙈 Đã ẩn Banner Ad!");
    document.getElementById('btnBanner').innerText = "1. Hiện Banner Ad (320x50)";
    isBannerShow = false;
  }
});

// 2. App Open Ad (Quảng cáo mở app - Dùng mã Interstitial Test)
document.getElementById('btnAppOpen').addEventListener('click', async () => {
  log("⏳ Đang tải App Open Ad...");
  try {
    await AdMob.prepareInterstitial({
      adId: 'ca-app-pub-3940256099942544/1033173712',
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
      adId: 'ca-app-pub-3940256099942544/1033173712',
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
      adId: 'ca-app-pub-3940256099942544/5224354917',
    });
    await AdMob.showRewardVideoAd();
    log("🎬 Đang chiếu Rewarded Video Ad (Xem hết nhận quà)...");
  } catch (e) {
    log("❌ Lỗi Rewarded Video: " + e.message);
  }
});

// 5. Rewarded Interstitial Ad (Xen kẽ thưởng)
document.getElementById('btnRewardedInter').addEventListener('click', async () => {
  log("⏳ Đang tải Rewarded Interstitial Ad...");
  try {
    await AdMob.prepareRewardVideoAd({
      adId: 'ca-app-pub-3940256099942544/5224354917',
    });
    await AdMob.showRewardVideoAd();
    log("🎬 Đã chiếu Rewarded Interstitial Ad!");
  } catch (e) {
    log("❌ Lỗi Rewarded Interstitial: " + e.message);
  }
});

// 6. Native Ad (Dạng Card 300x250 MREC ở giữa)
document.getElementById('btnNative').addEventListener('click', async () => {
  if (!isNativeShow) {
    try {
      // Xoá khung quảng cáo cũ (nếu Nút 1 đang bật)
      await removeCurrentBanner();
      isBannerShow = false;
      document.getElementById('btnBanner').innerText = "1. Hiện Banner Ad (320x50)";

      // Hiện Native MREC 300x250 ở giữa
      await AdMob.showBanner({
        adId: 'ca-app-pub-3940256099942544/6300978111',
        adSize: BannerAdSize.MEDIUM_RECTANGLE,
        position: BannerAdPosition.CENTER,
      });
      log("🖼️ Đã hiển thị Native Ad (MREC 300x250) ở chính giữa!");
      document.getElementById('btnNative').innerText = "6. Ẩn Native Ad";
      isNativeShow = true;
    } catch (e) {
      log("❌ Lỗi Native Ad: " + e.message);
    }
  } else {
    await removeCurrentBanner();
    log("🙈 Đã ẩn Native Ad!");
    document.getElementById('btnNative').innerText = "6. Test Native Ad (Thẻ 300x250)";
    isNativeShow = false;
  }
});

// Khởi chạy khi màn hình sẵn sàng
window.addEventListener('DOMContentLoaded', () => {
  initAdMob();
});
