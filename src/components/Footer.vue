<template>
    <footer class="footer text-white pt-4 pb-2">
      <div class="container">
        <div class="row text-start">
  
          <!-- Cột 1: Thông tin liên hệ -->
          <div class="col-md-3 mb-3">
            <h6>Thông tin liên hệ</h6>
            <p><font-awesome-icon icon="location-dot" class="me-2" /> Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ</p>
            <p><font-awesome-icon icon="phone" class="me-2" /> 0292 3831 530</p>
            <p><font-awesome-icon icon="fax" class="me-2" /> (0292) 3 831 130</p>
            <p><font-awesome-icon icon="envelope" class="me-2" /> tthl@ctu.edu.vn</p>
          </div>

          <!-- Cột 2: Nhà xuất bản tài trợ -->
          <div class="col-md-3 mb-3">
            <h6>Nhà xuất bản tài trợ</h6>
            <ul class="list-unstyled small">
              <li>NXB ĐHQG HCM</li>
              <li>NXB ĐHQG HN</li>
              <li>NXB ĐHCT</li>
            </ul>
          </div>
  
          <!-- Cột 3: Quy định & Chính sách -->
          <div class="col-md-3 mb-3">
            <h6>Quy định & Chính sách</h6>
            <ul class="list-unstyled small">
              <router-link to="/Q&A" class="nav-link text-white">Quy định mượn/trả</router-link>
              <router-link to="/Q&A" class="nav-link text-white">Chính sách bảo mật</router-link>
              <router-link to="/Q&A" class="nav-link text-white">Điều khoản sử dụng</router-link>
            </ul>
          </div>
  
          <!-- Cột 4: Fanpage Facebook -->
          <div class="col-md-3 mb-3">
            <h6><font-awesome-icon :icon="['fab', 'facebook']" /> Kết nối với chúng tôi</h6>
            <div class="fb-page"
              data-href="https://www.facebook.com/CTUDHCT" 
              data-tabs="" 
              data-width="250" 
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
  .footer {
    background-color: #0E346F;
  }
  
  </style>
  