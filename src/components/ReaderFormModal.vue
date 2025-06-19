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
                <input type="text" class="form-control" v-model="formData.HoLot" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">Tên</label>
                <input type="text" class="form-control" v-model="formData.Ten" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">Ngày sinh</label>
                <input type="date" class="form-control" v-model="formData.NgaySinh" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Phái</label>
                <select class="form-select" v-model="formData.Phai">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label">Địa chỉ</label>
                <input type="text" class="form-control" v-model="formData.DiaChi" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Điện thoại</label>
                <input type="text" class="form-control" v-model="formData.DienThoai" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="formData.email" required />
              </div>

              <!-- Chỉ hiển thị mật khẩu khi tạo mới -->
              <div class="col-md-6" v-if="!isEditMode">
                <label class="form-label">Mật khẩu</label>
                <input type="password" class="form-control" v-model="formData.MatKhau" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Ảnh đại diện</label>
                <input type="file" class="form-control" @change="handleAvatarChange" />
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

watch(() => props.modelValue, async (val) => {
  if (val) {
    formData.value = props.reader ? { ...props.reader } : {}
    avatarFile.value = null
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

function submit() {
  const data = new FormData()
  for (const key in formData.value) {
    if (isEditMode.value && key === 'MatKhau') continue // Không gửi mật khẩu khi chỉnh sửa
    data.append(key, formData.value[key])
  }
  if (avatarFile.value) {
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
</style>
