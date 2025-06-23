<template>
    <div class="container py-5">
      <h2 class="text-center fw-bold mb-4">Câu hỏi thường gặp</h2>
      <div class="accordion mb-5" id="faqAccordion">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="accordion-item"
        >
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              :class="{ collapsed: activeIndex !== index }"
              type="button"
              @click="toggle(index)"
            >
              {{ faq.question }}
            </button>
          </h2>
          <div
            class="accordion-collapse collapse"
            :class="{ show: activeIndex === index }"
          >
            <div class="accordion-body">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
  
      <!-- Quy định và Chính sách -->
      <div class="policy-section">
        <h3 class="fw-bold mb-3 text-center">Quy định & Chính sách</h3>
        <ul class="list-group">
          <li class="list-group-item" v-for="(policy, i) in policies" :key="i">
            <h6 class="fw-semibold">{{ policy.title }}</h6>
            <p class="text-muted small mb-0">{{ policy.description }}</p>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref } from 'vue'

const faqs = ref([
  {
    question: 'Làm sao để mượn sách?',
    answer: 'Bạn có thể mượn sách trực tiếp tại thư viện hoặc qua hệ thống mượn sách trực tuyến.'
  },
  {
    question: 'Thời hạn mượn tối đa là bao lâu?',
    answer: 'Thời hạn mượn tối đa là một tuần kể từ ngày đăng ký mượn.'
  },
  {
    question: 'Làm cách nào để hủy đăng ký mượn?',
    answer: 'Vào mục Thông tin cá nhân -> Xem lịch sử mượn -> Hủy đăng ký.'
  },
  {
    question: 'Nếu làm mất sách thì phải làm gì?',
    answer: 'Liên hệ thư viện hoặc nhắn tin cho CTLIB để được hướng dẫn xử lý.'
  },
  {
    question: 'Có thể mua sách không?',
    answer: 'CTLIB là hệ thống thư viện trực tuyến chỉ hộ trợ mượn sách, nếu cần mua sách có thể nhắn tin cho CTLIB để được hướng dẫn.'
  }
])

const policies = ref([
  {
    title: 'Chính sách mượn sách',
    description: 'Sinh viên chỉ được mượn đồng thời tối đa 3 quyển.'
  },
  {
    title: 'Quy định trả sách trễ',
    description: 'Phạt 5.000đ/ngày/cuốn nếu quá hạn trả sách.'
  },
  {
    title: 'Chính sách bảo mật',
    description: 'Thông tin cá nhân của người dùng được bảo mật tuyệt đối.'
  }
])

const activeIndex = ref(null)
function toggle(index) {
  activeIndex.value = activeIndex.value === index ? null : index
}
  </script>
  
<style scoped>
.accordion-button {
  cursor: pointer;
}

.policy-section {
  border-top: 1px solid #ddd;
  padding-top: 30px;
  margin-top: 40px;
}
</style>
