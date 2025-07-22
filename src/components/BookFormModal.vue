<template>
  <div class="modal fade" tabindex="-1" ref="modalRef" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <form @submit.prevent="submit">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa sách' : 'Thêm sách' }}</h5>
            <button type="button" class="btn-close" @click="closeDialog"></button>
          </div>

          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6" v-if="isEditMode">
                <label class="form-label">Mã sách</label>
                <input type="text" class="form-control" v-model="formData.MaSach" disabled />
              </div>

              <div class="col-md-6">
                <label class="form-label">Tên sách</label>
                <input type="text" class="form-control" v-model="formData.TenSach" />
                <div class="text-danger mt-1" v-if="formErrors.TenSach">{{ formErrors.TenSach }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Tác giả</label>
                <input type="text" class="form-control" v-model="formData.TacGia" />
                <div class="text-danger mt-1" v-if="formErrors.TacGia">{{ formErrors.TacGia }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Thể loại</label>
                <select class="form-select" v-model="formData.TheLoai">
                  <option>Công nghệ thông tin</option>
                  <option>Luật</option>
                  <option>Kinh tế</option>
                  <option>Kỹ thuật</option>
                  <option>Nông nghiệp, thủy sản</option>
                </select>
                <div class="text-danger mt-1" v-if="formErrors.TheLoai">{{ formErrors.TheLoai }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Nhà xuất bản</label>
                <select class="form-select" v-model="formData.MaNXB">
                  <option disabled value="">-- Chọn nhà xuất bản --</option>
                  <option v-for="publisher in publisherList" :key="publisher.MaNXB" :value="publisher.MaNXB">
                    {{ publisher.MaNXB }}
                  </option>
                </select>
                <div class="text-danger mt-1" v-if="formErrors.MaNXB">{{ formErrors.MaNXB }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Đơn giá</label>
                <input type="number" class="form-control" v-model="formData.DonGia" />
                <div class="text-danger mt-1" v-if="formErrors.DonGia">{{ formErrors.DonGia }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Số quyển</label>
                <input type="number" class="form-control" v-model="formData.SoQuyen" />
                <div class="text-danger mt-1" v-if="formErrors.SoQuyen">{{ formErrors.SoQuyen }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Năm xuất bản</label>
                <input type="number" class="form-control" v-model="formData.NamXuatBan" />
                <div class="text-danger mt-1" v-if="formErrors.NamXuatBan">{{ formErrors.NamXuatBan }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Ảnh bìa</label>
                <input type="file" class="form-control" @change="handleImageUpload" />
                <div class="text-danger mt-1" v-if="formErrors.BiaSach">{{ formErrors.BiaSach }}</div>
              </div>

              <div class="col-md-6" v-if="previewImage">
                <label class="form-label d-block">Xem trước</label>
                <img :src="previewImage" class="img-thumbnail" style="max-width: 100px;" />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDialog">Hủy</button>
            <button type="submit" class="btn btn-primary">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import PublisherService from '@/services/publisher.service'

// props mà component con nhận từ component cha
const props = defineProps({
  // v-model mặc định liên kết với modelValue
  modelValue: Boolean,
  book: Object,
  mode: String
})

// emit để gửi sự kiện và dữ liệu về component cha vì props chỉ để nhận dữ liệu 1 chiều
// update:modelValue để cập nhật giá trị của v-model
// save để gửi dữ liệu về component cha
const emit = defineEmits(['update:modelValue', 'save'])

const formData = ref({})
const previewImage = ref(null)
const modalRef = ref(null)
const publisherList = ref([])
let modalInstance = null

const isEditMode = computed(() => props.mode === 'edit')

const formErrors = ref({
  TenSach: '',
  TacGia: '',
  TheLoai: '',
  MaNXB: '',
  DonGia: '',
  SoQuyen: '',
  NamXuatBan: '',
   BiaSach: ''
})
// watch(nguồn cần theo dõi, callback(giá trị mới, giá trị cũ))
// () => props.modelValue là getter funtion để theo dõi sự thay đổi của props.modelValue
watch(() => props.modelValue, async (val/*giá trị mới, giá trị cũ*/) => {
  // val true/false để bật tắt modal
  if (val) {
    // Reset dữ liệu và lỗi form
    formData.value = props.book ? { ...props.book } : {} // props.book tồn tại thì sao chép, không thì khởi tạo rỗng
    Object.keys(formErrors.value).forEach(k => formErrors.value[k] = '')

    // Reset ảnh xem trước
    previewImage.value = props.book?.BiaSach ? getImageUrl(props.book.BiaSach) : null

    await nextTick()
    // Chưa có modal thì khởi tạo và hiển thị
    if (!modalInstance) {
      const bootstrap = await import('bootstrap')
      modalInstance = new bootstrap.Modal(modalRef.value)
    }
    modalInstance.show()
  } else {
    // Nếu có modal thì ẩn nó
    modalInstance?.hide()
  }
})

// sự kiện đóng modal
function closeDialog() {
  emit('update:modelValue', false)
}

// sự kiện submit form khi người dùng nhấn nút Lưu
function submit() {
  if (!validateForm()) return
  // Gửi dữ liệu về component cha thông qua sự kiện save để gọi hàm @save="handleSave"
  emit('save', formData.value)
  setTimeout(closeDialog, 50)
}

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    formData.value.BiaSach = file
    previewImage.value = URL.createObjectURL(file)
  }
}

function getImageUrl(path) {
  return `http://localhost:3000/${path}`
}

function validateForm() {
  Object.keys(formErrors.value).forEach(k => formErrors.value[k] = '')
  let isValid = true

  if (!formData.value.TenSach?.trim()) {
    formErrors.value.TenSach = 'Tên sách là bắt buộc.'
    isValid = false
  }

  if (!formData.value.TacGia || !formData.value.TacGia.trim()) {
    formErrors.value.TacGia = 'Tác giả là bắt buộc.'
    isValid = false
  } 

  if (!formData.value.TheLoai) {
    formErrors.value.TheLoai = 'Vui lòng chọn thể loại.'
    isValid = false
  }

  if (!formData.value.MaNXB) {
    formErrors.value.MaNXB = 'Vui lòng chọn nhà xuất bản.'
    isValid = false
  }

  if (formData.value.DonGia === undefined || formData.value.DonGia < 0) {
    formErrors.value.DonGia = 'Đơn giá không hợp lệ.'
    isValid = false
  }

  if (formData.value.SoQuyen === undefined || formData.value.SoQuyen < 1) {
    formErrors.value.SoQuyen = 'Số quyển phải lớn hơn 0.'
    isValid = false
  }

  const year = Number(formData.value.NamXuatBan)
  const currentYear = new Date().getFullYear()
  if (!year || year < 1900 || year > currentYear) {
    formErrors.value.NamXuatBan = `Năm xuất bản phải từ 1900 đến ${currentYear}.`
    isValid = false
  }

  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png']
  const maxImageSizeMB = 2
  if (formData.value.BiaSach instanceof File) {
    const file = formData.value.BiaSach
    if (!allowedImageTypes.includes(file.type)) {
      formErrors.value.BiaSach = 'Ảnh phải là định dạng jpg, jpeg hoặc png.'
      isValid = false
    }

    const sizeMB = file.size / 1024 / 1024
    if (sizeMB > maxImageSizeMB) {
      formErrors.value.BiaSach = 'Kích thước ảnh không được vượt quá 2MB.'
      isValid = false
    }
  }
  return isValid
}

onMounted(async () => {
  const bootstrap = await import('bootstrap')
  modalInstance = new bootstrap.Modal(modalRef.value)
  modalRef.value.addEventListener('hidden.bs.modal', () => {
    emit('update:modelValue', false)
  })

  try {
    const publishers = await PublisherService.getAll()
    publisherList.value = publishers
  } catch (e) {
    console.error('Lỗi khi lấy danh sách NXB:', e)
  }
})
</script>

<style scoped>
.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
.text-danger {
  color: red;
  font-size: 0.875rem;
}
</style>
