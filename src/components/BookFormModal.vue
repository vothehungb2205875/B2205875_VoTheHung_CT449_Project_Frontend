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
                <input type="text" class="form-control" v-model="formData.TenSach" required />
              </div>

              <div class="col-md-6">
                <label class="form-label">Tác giả</label>
                <input type="text" class="form-control" v-model="formData.TacGia" />
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
              </div>

              <div class="col-md-6">
                <label class="form-label">Nhà xuất bản</label>
                <select class="form-select" v-model="formData.MaNXB" required>
                  <option disabled value="">-- Chọn nhà xuất bản --</option>
                  <option v-for="publisher in publisherList" :key="publisher.MaNXB" :value="publisher.MaNXB">
                    {{ publisher.MaNXB }}
                  </option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label">Đơn giá</label>
                <input type="number" class="form-control" v-model="formData.DonGia" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Số quyển</label>
                <input type="number" class="form-control" v-model="formData.SoQuyen" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Năm xuất bản</label>
                <input type="number" class="form-control" v-model="formData.NamXuatBan" />
              </div>

              <div class="col-md-6">
                <label class="form-label">Ảnh bìa</label>
                <input type="file" class="form-control" @change="handleImageUpload" />
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

const props = defineProps({
  modelValue: Boolean,
  book: Object,
  mode: String
})
const emit = defineEmits(['update:modelValue', 'save']) // emit để gửi sự kiện từ component con tới cha

const formData = ref({})
const previewImage = ref(null)
const modalRef = ref(null)
let modalInstance = null
const publisherList = ref([])

const isEditMode = computed(() => props.mode === 'edit')

watch(() => props.modelValue, async (val) => {
  if (val) {
    formData.value = props.book ? { ...props.book } : {}
    previewImage.value = props.book?.BiaSach ? getImageUrl(props.book.BiaSach) : null

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

function submit() {
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
</style>
