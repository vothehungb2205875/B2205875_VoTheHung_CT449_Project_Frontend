<template>
  <div class="modal fade" tabindex="-1" ref="modalRef" data-bs-backdrop="static">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <form @submit.prevent="submit">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa độc giả' : 'Thêm độc giả' }}</h5>
            <button type="button" class="btn-close" @click="closeDialog"></button>
          </div>

          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6" v-if="isEditMode">
                <label class="form-label">Mã độc giả</label>
                <input type="text" class="form-control" v-model="formData.MaDocGia" disabled />
              </div>

              <div class="col-md-6">
                <label class="form-label">Họ lót</label>
                <input type="text" class="form-control" v-model="formData.HoLot" />
                <div class="text-danger mt-1" v-if="formErrors.HoLot">{{ formErrors.HoLot }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Tên</label>
                <input type="text" class="form-control" v-model="formData.Ten" />
                <div class="text-danger mt-1" v-if="formErrors.Ten">{{ formErrors.Ten }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Ngày sinh</label>
                <input type="date" class="form-control" v-model="formData.NgaySinh" />
                <div class="text-danger mt-1" v-if="formErrors.NgaySinh">{{ formErrors.NgaySinh }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Phái</label>
                <select class="form-select" v-model="formData.Phai">
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                <div class="text-danger mt-1" v-if="formErrors.Phai">{{ formErrors.Phai }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Địa chỉ</label>
                <input type="text" class="form-control" v-model="formData.DiaChi" />
                <div class="text-danger mt-1" v-if="formErrors.DiaChi">{{ formErrors.DiaChi }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Điện thoại</label>
                <input type="text" class="form-control" v-model="formData.DienThoai" />
                <div class="text-danger mt-1" v-if="formErrors.DienThoai">{{ formErrors.DienThoai }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="formData.email" />
                <div class="text-danger mt-1" v-if="formErrors.email">{{ formErrors.email }}</div>
              </div>

              <div class="col-md-6" v-if="!isEditMode">
                <label class="form-label">Mật khẩu</label>
                <input type="password" class="form-control" v-model="formData.MatKhau" />
                <div class="text-danger mt-1" v-if="formErrors.MatKhau">{{ formErrors.MatKhau }}</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Ảnh đại diện</label>
                <input type="file" class="form-control" @change="handleAvatarChange" />
                <div class="text-danger mt-1" v-if="formErrors.avatar">{{ formErrors.avatar }}</div>
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

const props = defineProps({
  modelValue: Boolean,
  reader: Object,
  mode: String
})
const emit = defineEmits(['update:modelValue', 'save'])

const formData = ref({})
const avatarFile = ref(null)
const modalRef = ref(null)
let modalInstance = null

const isEditMode = computed(() => props.mode === 'edit')

const formErrors = ref({
  HoLot: '',
  Ten: '',
  NgaySinh: '',
  Phai: '',
  DiaChi: '',
  DienThoai: '',
  email: '',
  MatKhau: '',
  avatar: ''
})

watch(() => props.modelValue, async (val) => {
  if (val) {
    formData.value = props.reader ? { ...props.reader } : {}
    avatarFile.value = null
    Object.keys(formErrors.value).forEach(k => formErrors.value[k] = '')
    await nextTick()
    if (!modalInstance) {
      const bootstrap = await import('bootstrap')
      modalInstance = new bootstrap.Modal(modalRef.value)
    }
    modalInstance.show()
  } else {
    modalInstance?.hide()
  }
})

function closeDialog() {
  emit('update:modelValue', false)
}

function handleAvatarChange(e) {
  avatarFile.value = e.target.files[0]
}

function validateForm() {
  Object.keys(formErrors.value).forEach(k => formErrors.value[k] = '')
  let isValid = true

  const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/u
  const phoneRegex = /^[0-9]{9,11}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const today = new Date().toISOString().split('T')[0]
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']

  // Họ lót
  if (!formData.value.HoLot || !nameRegex.test(formData.value.HoLot.trim())) {
    formErrors.value.HoLot = 'Họ lót không hợp lệ! Chỉ chứa chữ và khoảng trắng.'
    isValid = false
  }

  // Tên
  if (!formData.value.Ten || !nameRegex.test(formData.value.Ten.trim())) {
    formErrors.value.Ten = 'Tên không hợp lệ! Chỉ chứa chữ và khoảng trắng.'
    isValid = false
  }

  // Ngày sinh
  if (!formData.value.NgaySinh || formData.value.NgaySinh > today) {
    formErrors.value.NgaySinh = 'Ngày sinh không hợp lệ.'
    isValid = false
  }

  // Phái
  if (!formData.value.Phai) {
    formErrors.value.Phai = 'Vui lòng chọn giới tính.'
    isValid = false
  }

  // Địa chỉ
  if (!formData.value.DiaChi?.trim()) {
    formErrors.value.DiaChi = 'Địa chỉ là bắt buộc.'
    isValid = false
  }

  // Số điện thoại
  if (!formData.value.DienThoai || !phoneRegex.test(formData.value.DienThoai)) {
    formErrors.value.DienThoai = 'Số điện thoại không hợp lệ (9–11 số).'
    isValid = false
  }

  // Email
  if (!formData.value.email || !emailRegex.test(formData.value.email)) {
    formErrors.value.email = 'Email không hợp lệ.'
    isValid = false
  }

  // Mật khẩu (chỉ khi thêm mới)
  if (!isEditMode.value) {
    if (!formData.value.MatKhau || formData.value.MatKhau.length < 6) {
      formErrors.value.MatKhau = 'Mật khẩu tối thiểu 6 ký tự.'
      isValid = false
    }
  }

  // Ảnh đại diện (nếu chọn)
  if (avatarFile.value) {
    if (!allowedTypes.includes(avatarFile.value.type)) {
      formErrors.value.avatar = 'Ảnh phải là định dạng JPG, JPEG hoặc PNG.'
      isValid = false
    }
    if (avatarFile.value.size / 1024 / 1024 > 2) {
      formErrors.value.avatar = 'Ảnh vượt quá 2MB.'
      isValid = false
    }
  }

  return isValid
}


function submit() {
  if (!validateForm()) return

  const data = new FormData()
  for (const key in formData.value) {
    if (
      isEditMode.value &&
      (key === 'MatKhau' || key === 'createdAt')
    ) continue

    data.append(key, formData.value[key])
  }

  if (avatarFile?.value) {
    data.append('avatar', avatarFile.value)
  }

  emit('save', data)
  setTimeout(closeDialog, 50)
}

onMounted(async () => {
  const bootstrap = await import('bootstrap')
  modalInstance = new bootstrap.Modal(modalRef.value)
  modalRef.value.addEventListener('hidden.bs.modal', () => {
    emit('update:modelValue', false)
  })
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
