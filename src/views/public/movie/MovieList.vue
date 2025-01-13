<template>
  <div class="movie-list">
    <h1>Movies</h1>

    <div v-if="loading" class="loading">Loading movies...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else-if="movieData.length" class="movie-grid">
      <router-link
        v-for="m in movieData"
        :key="m.id"
        :to="{ name: 'movie-detail', params: { id: m.id } }"
        class="movie-card"
      >
        <img
          :src="m.poster || '/placeholder-movie.jpg'"
          alt="poster"
          class="movie-poster"
        />
        <div class="movie-info">
          <h3>{{ m.title }}</h3>
          <p>Year: {{ m.year }}</p>
          <p class="summary">
            {{ truncateText(m.summary, 80) }}
          </p>
          <span class="genre">
            {{ m.genre?.name }}
          </span>
          <div class="view-details">View Details →</div>
        </div>
      </router-link>
    </div>

    <div v-else class="no-results">No movies found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { movies, handleApiError } from "@/api";

const movieData = ref([]);
const loading = ref(false);
const error = ref(null);

const truncateText = (text, length) => {
  if (!text) return "";
  return text.length <= length ? text : text.substring(0, length) + "...";
};

const fetchMovies = async () => {
  try {
    loading.value = true;
    const res = await movies.getAll();
    // => res.data = { message: "...", data: [ ... ] }
    movieData.value = res.data.data;
  } catch (err) {
    error.value = handleApiError(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchMovies);
</script>

<style scoped>
.movie-list {
  padding: 2rem;
}

.movie-list h1 {
  margin-bottom: 2rem;
  color: #333;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-box {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.genre-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 150px;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.movie-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-poster {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.movie-info {
  padding: 1.5rem;
}

.movie-info h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.movie-year {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.movie-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.genre-tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}

.movie-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.movie-actions {
  display: flex;
  gap: 1rem;
}

.view-details,
.review-btn {
  flex: 1;
  text-align: center;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-details {
  background: #4a90e2;
  color: white;
  text-decoration: none;
}

.view-details:hover {
  background: #357abd;
}

.review-btn {
  background: #28a745;
  color: white;
  border: none;
}

.review-btn:hover {
  background: #218838;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-content h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: #555;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.submit-btn,
.cancel-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn {
  background: #28a745;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #218838;
}

.cancel-btn {
  background: #dc3545;
  color: white;
}

.cancel-btn:hover {
  background: #c82333;
}

.loading,
.error-message,
.no-results {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

.error-message {
  background: #f8d7da;
  color: #dc3545;
}
</style>
