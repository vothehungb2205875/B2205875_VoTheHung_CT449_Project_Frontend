<template>
    <div class="modal fade" tabindex="-1" ref="modalRef" data-bs-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="submit">
            <div class="modal-header">
              <h5 class="modal-title">{{ isEditMode ? 'Chỉnh sửa NXB' : 'Thêm NXB' }}</h5>
              <button type="button" class="btn-close" @click="closeDialog"></button>
            </div>
  
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Mã NXB</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.MaNXB"
                  :disabled="isEditMode"
                />
                <div class="text-danger mt-1" v-if="formErrors.MaNXB">{{ formErrors.MaNXB }}</div>
              </div>
  
              <div class="mb-3">
                <label class="form-label">Tên nhà xuất bản</label>
                <input type="text" class="form-control" v-model="formData.TenNXB" />
                <div class="text-danger mt-1" v-if="formErrors.TenNXB">{{ formErrors.TenNXB }}</div>
              </div>
  
              <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <textarea class="form-control" rows="3" v-model="formData.DiaChi"></textarea>
                <div class="text-danger mt-1" v-if="formErrors.DiaChi">{{ formErrors.DiaChi }}</div>
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
    publisher: Object,
    mode: String
  })
  
  const emit = defineEmits(['update:modelValue', 'save'])
  
  const modalRef = ref(null)
  const formData = ref({})
  const formErrors = ref({
    MaNXB: '',
    TenNXB: '',
    DiaChi: ''
  })
  let modalInstance = null
  
  const isEditMode = computed(() => props.mode === 'edit')
  
  // Watch mở modal
  watch(() => props.modelValue, async (val) => {
    if (val) {
      formData.value = props.publisher ? { ...props.publisher } : {}
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
  
  // Đóng modal
  function closeDialog() {
    emit('update:modelValue', false)
  }
  
  // Submit form
  function submit() {
    if (!validateForm()) return
    emit('save', formData.value)
    setTimeout(closeDialog, 50)
  }
  
  // Validate dữ liệu
  function validateForm() {
    let isValid = true
    Object.keys(formErrors.value).forEach(k => formErrors.value[k] = '')
  
    if (!formData.value.MaNXB?.trim()) {
      formErrors.value.MaNXB = 'Mã NXB không được để trống.'
      isValid = false
    }
  
    if (!formData.value.TenNXB?.trim()) {
      formErrors.value.TenNXB = 'Tên NXB không được để trống.'
      isValid = false
    }
  
    if (!formData.value.DiaChi?.trim()) {
      formErrors.value.DiaChi = 'Địa chỉ không được để trống.'
      isValid = false
    }
  
    return isValid
  }
  
  // Khởi tạo modal
  onMounted(async () => {
    const bootstrap = await import('bootstrap')
    modalInstance = new bootstrap.Modal(modalRef.value)
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      emit('update:modelValue', false)
    })
  })
  </script>
  
  <style scoped>
  .text-danger {
    font-size: 0.875rem;
  }
  </style>
  