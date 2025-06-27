<template>
    <div :class="{
        'row mb-3': layout === 'horizontal',
        'd-flex flex-column gap-3': layout === 'vertical'
    }">
        <!-- Thể loại -->
        <div :class="layout === 'horizontal' ? 'col-md-3' : ''">
            <label class="form-label">Thể loại</label>
            <select v-model="localFilter.genre" class="form-select">
                <option value="">-- Tất cả --</option>
                <option v-for="item in genres" :key="item" :value="item">{{ item }}</option>
            </select>
        </div>

        <!-- Nhà xuất bản -->
        <div :class="layout === 'horizontal' ? 'col-md-3' : ''">
            <label class="form-label">Nhà xuất bản</label>
            <select v-model="localFilter.nxb" class="form-select">
                <option value="">-- Tất cả --</option>
                <option v-for="item in nxbs" :key="item" :value="item">{{ item }}</option>
            </select>
        </div>

        <!-- Năm xuất bản -->
        <div :class="layout === 'horizontal' ? 'col-md-3' : ''">
            <label class="form-label">Năm xuất bản</label>
            <input v-model="localFilter.year" type="number" class="form-control" placeholder="VD: 2020" />
        </div>

        <!-- Reset -->
        <div :class="[
            layout === 'horizontal' ? 'col-md-3 d-flex align-items-end justify-content-end' : '',
        ]">
            <button class="btn btn-secondary w-100" @click="resetFilters">Đặt lại bộ lọc</button>
        </div>
    </div>
</template>
  

<script setup>
import { computed } from 'vue';

const props = defineProps({
    genres: Array,
    nxbs: Array,
    modelValue: {
        type: Object,
        default: () => ({ genre: '', nxb: '', year: '' })
    },
    layout: {
        type: String,
        default: 'horizontal', // hoặc 'vertical', 'sidebar', 'inline'
        validator: (val) => ['horizontal', 'vertical'].includes(val)
    }
})


const emit = defineEmits(['update:modelValue']);

// Computed two-way binding
const localFilter = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});

function resetFilters() {
    localFilter.value.genre = '';
    localFilter.value.nxb = '';
    localFilter.value.year = '';
}

</script>

