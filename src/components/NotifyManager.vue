<template>
    <div class="container py-4">
      <h4 class="mb-4">Quản lý Thông báo / Sự kiện</h4>
  
      <!-- Form thêm/sửa -->
      <form @submit.prevent="handleSubmit" class="mb-4 border p-3 rounded bg-light">
        <div class="mb-2">
          <label class="form-label">Nội dung</label>
          <input v-model="form.NoiDung" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Loại</label>
          <select v-model="form.Loai" class="form-select" required>
            <option value="thongbao">Thông báo</option>
            <option value="sukien">Sự kiện</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary me-2">
          {{ editingId ? "Cập nhật" : "Thêm mới" }}
        </button>
        <button type="button" @click="resetForm" class="btn btn-secondary" v-if="editingId">
          Hủy
        </button>
      </form>
  
      <!-- Danh sách thông báo -->
      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Nội dung</th>
            <th>Loại</th>
            <th>Ngày tạo</th>
            <th class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(notify, index) in notifys" :key="notify._id">
            <td>{{ index + 1 }}</td>
            <td>{{ notify.NoiDung }}</td>
            <td>
              <span class="badge bg-info" v-if="notify.Loai === 'thongbao'">Thông báo</span>
              <span class="badge bg-success" v-else>Sự kiện</span>
            </td>
            <td>{{ formatDate(notify.NgayTao) }}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary me-2" @click="editNotify(notify)">Sửa</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteNotify(notify._id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import NotifyService from "@/services/notify.service";
  import dayjs from "dayjs";
  import { toast } from 'vue3-toastify'
  
  const notifys = ref([]);
  const form = ref({
    NoiDung: "",
    Loai: "thongbao",
  });
  const editingId = ref(null);
  
  const fetchData = async () => {
    notifys.value = await NotifyService.getAll();
  };
  
  const handleSubmit = async () => {
    try {
      if (editingId.value) {
        await NotifyService.update(editingId.value, form.value);
        toast.success("Cập nhật thông báo thành công!");
      } else {
        await NotifyService.create(form.value);
        toast.success("Thêm thông báo mới thành công!");
      }
      await fetchData();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Thao tác không thành công!");
    }
  };

const deleteNotify = async (id) => {
  if (confirm("Bạn chắc chắn muốn xóa?")) {
    try {
      await NotifyService.delete(id);
      toast.success("Xóa thông báo thành công!");
      await fetchData();
    } catch {
      toast.error("Xóa thất bại.");
    }
  }
};

  
  const editNotify = (notify) => {
    editingId.value = notify._id;
    form.value = {
      NoiDung: notify.NoiDung,
      Loai: notify.Loai,
    };
  };
  
  const resetForm = () => {
    editingId.value = null;
    form.value = { NoiDung: "", Loai: "thongbao" };
  };
  
  const formatDate = (dateStr) => {
    return dayjs(dateStr).format("DD/MM/YYYY HH:mm");
  };
  
  onMounted(fetchData);
  </script>
  
  <style scoped>
  table th,
  table td {
    vertical-align: middle;
  }
  </style>
  