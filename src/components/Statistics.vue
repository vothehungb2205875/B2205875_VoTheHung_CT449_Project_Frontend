<template>
    <div>
      <h2>Thống kê</h2>
      <p>Tổng số sách: {{ bookCount }}</p>
      <p>Tổng số độc giả: {{ readerCount }}</p>
      <p>Số lượt mượn sách: {{ borrowCount }}</p>
    </div>
  </template>
  
  <script>
  export default {
    computed: {
      bookCount() {
        return 10; // Giả lập
      },
      readerCount() {
        return 5; // Giả lập
      },
      borrowCount() {
        return 7; // Giả lập
      }
    }
  };
  </script>
  