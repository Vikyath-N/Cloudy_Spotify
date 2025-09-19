cmake_minimum_required(VERSION 3.16)
project(MusicRecommendationEngine)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find Eigen3
find_package(Eigen3 3.3 REQUIRED NO_MODULE)

# Include directories
include_directories(${CMAKE_CURRENT_SOURCE_DIR})

# Source files
set(SOURCES
    music_rl_engine.cpp
    neural_network.cpp
    experience_buffer.cpp
    music_environment.cpp
)

# Create library for WebAssembly compilation
add_library(music_engine ${SOURCES})
target_link_libraries(music_engine Eigen3::Eigen)

# Emscripten specific settings
if(EMSCRIPTEN)
    set_target_properties(music_engine PROPERTIES
        COMPILE_FLAGS "-O3 -s WASM=1"
        LINK_FLAGS "-O3 -s WASM=1 -s EXPORTED_FUNCTIONS='[\"_predict\", \"_train\", \"_getActivations\", \"_initialize\"]' -s EXPORTED_RUNTIME_METHODS='[\"ccall\", \"cwrap\"]' --bind"
    )
endif()

# Regular executable for testing
if(NOT EMSCRIPTEN)
    add_executable(test_engine test_main.cpp)
    target_link_libraries(test_engine music_engine)
endif()
