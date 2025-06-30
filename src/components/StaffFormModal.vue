<template>
    <div class="modal fade" tabindex="-1" ref="modalRef" data-bs-backdrop="static">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form @submit.prevent="submit">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên' }}</h5>
              <button type="button" class="btn-close" @click="closeDialog"></button>
            </div>
  
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6" v-if="isEditMode">
                  <label class="form-label">Mã nhân viên</label>
                  <input type="text" class="form-control" v-model="formData.MSNV" disabled />
                </div>
  
                <div class="col-md-6">
                    <label class="form-label">Họ tên</label>
                    <input type="text" class="form-control" v-model="formData.HoTenNV" />
                    <div class="text-danger mt-1" v-if="formErrors.HoTenNV">{{ formErrors.HoTenNV }}</div>
                </div>

                    <div class="col-md-6">
                    <label class="form-label">Chức vụ</label>
                    <input type="text" class="form-control" v-model="formData.ChucVu" />
                    <div class="text-danger mt-1" v-if="formErrors.ChucVu">{{ formErrors.ChucVu }}</div>
                 </div>

                    <div class="col-md-6">
                    <label class="form-label">Địa chỉ</label>
                    <input type="text" class="form-control" v-model="formData.DiaChi" />
                    <div class="text-danger mt-1" v-if="formErrors.DiaChi">{{ formErrors.DiaChi }}</div>
                </div>

                    <div class="col-md-6">
                    <label class="form-label">Số điện thoại</label>
                    <input type="text" class="form-control" v-model="formData.SoDienThoai" />
                    <div class="text-danger mt-1" v-if="formErrors.SoDienThoai">{{ formErrors.SoDienThoai }}</div>
                </div>

                    <div class="col-md-6">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" v-model="formData.email" />
                    <div class="text-danger mt-1" v-if="formErrors.email">{{ formErrors.email }}</div>
                </div>

                    <div class="col-md-6" v-if="!isEditMode">
                    <label class="form-label">Mật khẩu</label>
                    <input type="password" class="form-control" v-model="formData.Password" />
                    <div class="text-danger mt-1" v-if="formErrors.Password">{{ formErrors.Password }}</div>
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
    staff: Object,
    mode: String
  })
  const emit = defineEmits(['update:modelValue', 'save'])
  
  const formData = ref({})
  const modalRef = ref(null)
  let modalInstance = null
  
  const isEditMode = computed(() => props.mode === 'edit')
  
  const formErrors = ref({
    HoTenNV: '',
    ChucVu: '',
    DiaChi: '',
    SoDienThoai: '',
    email: '',
    Password: '',
  })
  
  watch(() => props.modelValue, async (val) => {
    if (val) {
      formData.value = props.staff ? { ...props.staff } : {}
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
  
  function validateForm() {
    Object.keys(formErrors.value).forEach(k => formErrors.value[k] = '')
    let isValid = true
  
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/u
    const phoneRegex = /^[0-9]{9,11}$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
    if (!formData.value.HoTenNV || !nameRegex.test(formData.value.HoTenNV.trim())) {
      formErrors.value.HoTenNV = 'Họ tên không hợp lệ! Chỉ chứa chữ và khoảng trắng.'
      isValid = false
    }
  
    if (!formData.value.ChucVu?.trim()) {
      formErrors.value.ChucVu = 'Chức vụ là bắt buộc.'
      isValid = false
    }
  
    if (!formData.value.DiaChi?.trim()) {
      formErrors.value.DiaChi = 'Địa chỉ là bắt buộc.'
      isValid = false
    }
  
    if (!formData.value.SoDienThoai || !phoneRegex.test(formData.value.SoDienThoai)) {
      formErrors.value.SoDienThoai = 'Số điện thoại không hợp lệ (9–11 số).'
      isValid = false
    }
  
    if (!formData.value.email || !emailRegex.test(formData.value.email)) {
      formErrors.value.email = 'Email không hợp lệ.'
      isValid = false
    }
  
    if (!isEditMode.value) {
      if (!formData.value.Password || formData.value.Password.length < 6) {
        formErrors.value.Password = 'Mật khẩu tối thiểu 6 ký tự.'
        isValid = false
      }
    }
  
    return isValid
  }
  
  function submit() {
    if (!validateForm()) return
    emit('save', formData.value)
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
  