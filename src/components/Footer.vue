<template>
    <footer class="bg-dark text-white pt-4 pb-2">
      <div class="container">
        <div class="row text-start">
  
          <!-- Cột 1: Thông tin liên hệ -->
          <div class="col-md-3 mb-3">
            <h6>📍 Thông tin liên hệ</h6>
            <p>Thư viện trực tuyến ABC</p>
            <p>123 Đường Sách, Quận 1, TP.HCM</p>
            <p>📞 028 1234 5678</p>
            <p>📧 info@thuvienabc.vn</p>
          </div>
  
          <!-- Cột 2: Nhà xuất bản tài trợ -->
          <div class="col-md-3 mb-3">
            <h6>🏢 Nhà xuất bản tài trợ</h6>
            <ul class="list-unstyled small">
              <li>NXB Giáo Dục Việt Nam</li>
              <li>NXB Kim Đồng</li>
              <li>NXB Trẻ</li>
              <li>NXB Văn Học</li>
            </ul>
          </div>
  
          <!-- Cột 3: Quy định & Chính sách -->
          <div class="col-md-3 mb-3">
            <h6>📄 Quy định & Chính sách</h6>
            <ul class="list-unstyled small">
              <li><a href="/rules" class="text-white text-decoration-none">Quy định mượn/trả</a></li>
              <li><a href="/privacy" class="text-white text-decoration-none">Chính sách bảo mật</a></li>
              <li><a href="/terms" class="text-white text-decoration-none">Điều khoản sử dụng</a></li>
            </ul>
          </div>
  
          <!-- Cột 4: Fanpage Facebook -->
          <div class="col-md-3 mb-3">
            <h6><font-awesome-icon :icon="['fab', 'facebook']" /> Kết nối với chúng tôi</h6>
            <div class="fb-page"
              data-href="https://www.facebook.com/CTUDHCT" 
              data-tabs="" 
              data-width="" 
              data-height="140" 
              data-small-header="false" 
              data-adapt-container-width="true" 
              data-hide-cover="false" 
              data-show-facepile="true">
              <blockquote cite="https://www.facebook.com/CTUDHCT" class="fb-xfbml-parse-ignore">
                <a href="https://www.facebook.com/CTUDHCT">Facebook</a>
              </blockquote>
            </div>
          </div>
  
        </div>
        <hr class="bg-secondary" />
        <p class="text-center small mt-2">&copy; 2025 Thư viện trực tuyến. All rights reserved.</p>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  
  onMounted(() => {
    // Kiểm tra nếu SDK đã tải xong thì yêu cầu quét lại các plugin
    if (window.FB && window.FB.XFBML) {
      window.FB.XFBML.parse()
    }
  })
  </script>
  
  
  <style scoped>
  p, li {
    margin: 0;
    margin-bottom: 0.3rem;
  }
  h6 {
    font-weight: bold;
    margin-bottom: 1rem;
  }
  </style>
  