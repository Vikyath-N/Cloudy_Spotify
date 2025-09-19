#include "experience_buffer.h"
#include <algorithm>
#include <random>
#include <numeric>

namespace MusicAI {

ExperienceBuffer::ExperienceBuffer(size_t max_size) 
    : max_size_(max_size), rng_(std::random_device{}()) {
    buffer_.reserve(max_size);
}

void ExperienceBuffer::add(const Experience& experience) {
    if (buffer_.size() >= max_size_) {
        // Remove oldest experience when buffer is full
        buffer_.pop_front();
    }
    buffer_.push_back(experience);
}

std::vector<Experience> ExperienceBuffer::sample(size_t batch_size) {
    if (buffer_.size() < batch_size) {
        // Return all available experiences if not enough for full batch
        return std::vector<Experience>(buffer_.begin(), buffer_.end());
    }
    
    std::vector<Experience> samples;
    samples.reserve(batch_size);
    
    // Create indices for sampling
    std::vector<size_t> indices(buffer_.size());
    std::iota(indices.begin(), indices.end(), 0);
    
    // Randomly shuffle and take first batch_size elements
    std::shuffle(indices.begin(), indices.end(), rng_);
    
    for (size_t i = 0; i < batch_size; ++i) {
        samples.push_back(buffer_[indices[i]]);
    }
    
    return samples;
}

} // namespace MusicAI
