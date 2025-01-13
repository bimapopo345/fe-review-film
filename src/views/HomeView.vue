<template>
  <div class="home">
    <section class="hero">
      <h1>Welcome to Movie Review</h1>
      <p>Discover, review, and share your favorite movies</p>
    </section>

    <section class="featured-movies" v-if="!loading">
      <h2>Featured Movies</h2>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else-if="moviesList.length" class="movie-grid">
        <div
          v-for="movie in moviesList.slice(0, 6)"
          :key="movie.id"
          class="movie-card"
        >
          <img
            :src="movie.poster || '/placeholder-movie.jpg'"
            :alt="movie.title"
            class="movie-poster"
          />
          <div class="movie-info">
            <h3>{{ movie.title }}</h3>
            <p class="movie-year">Year: {{ movie.year }}</p>
            <div class="movie-genre">
              <span class="genre-tag">{{ movie.genre?.name }}</span>
            </div>
            <router-link
              :to="{
                name: 'movie-detail',
                params: { id: movie.id },
              }"
              class="view-details"
            >
              View Details
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="no-movies">No movies available at the moment.</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { movies, handleApiError } from "@/api";

const moviesList = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  try {
    loading.value = true;
    const res = await movies.getAll();
    moviesList.value = res.data; // array
  } catch (err) {
    error.value = handleApiError(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(to right, #4a90e2, #357abd);
  color: white;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.featured-movies {
  margin-bottom: 3rem;
}

.featured-movies h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
  height: 300px;
  object-fit: cover;
}

.movie-info {
  padding: 1rem;
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

.genre-tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}

.view-details {
  display: inline-block;
  background: #4a90e2;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.view-details:hover {
  background: #357abd;
}

.error-message {
  color: #dc3545;
  text-align: center;
  padding: 1rem;
  background: #f8d7da;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.no-movies {
  text-align: center;
  padding: 2rem;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
}
</style>
