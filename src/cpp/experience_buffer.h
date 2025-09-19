#pragma once

#include <vector>
#include <deque>
#include <random>
#include <Eigen/Dense>

namespace MusicAI {

struct Experience {
    Eigen::VectorXd state;
    int action;
    double reward;
    Eigen::VectorXd next_state;
    bool done;
    
    Experience(const Eigen::VectorXd& s, int a, double r, 
              const Eigen::VectorXd& ns, bool d)
        : state(s), action(a), reward(r), next_state(ns), done(d) {}
};

class ExperienceBuffer {
private:
    std::deque<Experience> buffer_;
    size_t max_size_;
    std::mt19937 rng_;
    
public:
    explicit ExperienceBuffer(size_t max_size = 10000);
    
    void add(const Experience& experience);
    std::vector<Experience> sample(size_t batch_size);
    
    size_t size() const { return buffer_.size(); }
    bool canSample(size_t batch_size) const { return buffer_.size() >= batch_size; }
    void clear() { buffer_.clear(); }
};

} // namespace MusicAI
