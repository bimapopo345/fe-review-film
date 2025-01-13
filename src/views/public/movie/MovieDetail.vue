<template>
  <div>
    <h2>Reviews</h2>
    <div v-if="movie?.reviews?.length">
      <div v-for="r in movie.reviews" :key="r.id">
        <strong>{{ r.rating }} ★</strong> - {{ r.critic }}
      </div>
    </div>

    <div v-else>No reviews yet.</div>

    <div v-if="isVerified">
      <h3>Write Review</h3>
      <form @submit.prevent="submitReview">
        <textarea v-model="review.critic" placeholder="Your comment"></textarea>
        <select v-model="review.rating">
          <option value="1">1</option>
          <option value="2">2</option>
          ...
          <option value="5">5</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { reviews } from "@/api";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const isVerified = auth.isVerified; // computed

const review = ref({
  critic: "",
  rating: 5,
});

const submitReview = async () => {
  try {
    await reviews.create({
      movie_id: movie.value.id,
      critic: review.value.critic,
      rating: review.value.rating,
    });
    // Refresh data movie
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
.movie-detail {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.movie-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.movie-poster img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.movie-info h1 {
  margin-bottom: 1rem;
  color: #333;
}

.movie-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #666;
}

.genres {
  display: flex;
  gap: 0.5rem;
}

.genre-tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.description {
  margin-bottom: 2rem;
  line-height: 1.6;
  color: #444;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.average-rating {
  text-align: center;
}

.rating-display {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.rating-number {
  font-size: 2rem;
  font-weight: bold;
  color: #4a90e2;
}

.rating-count {
  color: #666;
}

.write-review-btn,
.verify-email-btn,
.login-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
}

.write-review-btn {
  background: #28a745;
  color: white;
  border: none;
}

.write-review-btn:hover {
  background: #218838;
}

.verify-email-btn,
.login-btn {
  background: #4a90e2;
  color: white;
  display: inline-block;
}

.verify-email-btn:hover,
.login-btn:hover {
  background: #357abd;
}

.cast-section,
.reviews-section {
  margin-bottom: 3rem;
}

.cast-section h2,
.reviews-section h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.cast-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cast-photo {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.cast-info {
  padding: 1rem;
  text-align: center;
}

.cast-info h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.cast-info p {
  color: #666;
  font-size: 0.9rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.reviewer-info {
  display: flex;
  flex-direction: column;
}

.reviewer-name {
  font-weight: bold;
  color: #333;
}

.review-date {
  font-size: 0.9rem;
  color: #666;
}

.rating-stars {
  color: #ffc107;
  font-size: 1.2rem;
}

.review-comment {
  color: #444;
  line-height: 1.5;
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
.no-reviews {
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

@media (max-width: 768px) {
  .movie-header {
    grid-template-columns: 1fr;
  }

  .movie-poster {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
