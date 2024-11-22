# NLP Setup

This document provides guidance on setting up your environment to run NLP tasks effectively.

The Python environment is meant to be run with CUDA with Pytorch. Ensure you have at least 5GB available for Models.

---

## 1. Environment Setup

### 1.1 Prerequisites

Before proceeding, ensure you have **CUDA** installed and a **compatible NVIDIA GPU** to enable GPU acceleration for deep learning frameworks. 

- Install [CUDA Toolkit](https://developer.nvidia.com/cuda-downloads) and verify compatibility with your GPU.
- After installation, verify that your GPU supports CUDA by running:
  ```bash
  nvidia-smi
  ```
  Make sure CUDA and cuDNN versions are compatible with Pytorch.

### 1.2 Python Environment Setup
Instead of manual installations, it's recommended to use a requirements.txt file to set up dependencies. Follow the steps below:

  1. Create a Python Virtual Environment:
  ```bash
  python -m venv nlp-env
  source nlp-env/bin/activate  # On Windows, use nlp-env\Scripts\activate`
  ```

  2. Install Dedpendencies:
  ```bash
  pip install -r requirements.txt
  ```

## 2. Running Flask

### 2.1 Start Flask Server
  1. Set Up Flask Environment Variables: On Linux/Mac:
  ```bash
  export FLASK_APP=src/app.py
  ```
  On Windows:
  ```bash
  $env:FLASK_APP = "src/app.py"
  ```

  2. Run Flask (from /NLP/src):
  ```bash
  python -m flask run --host=0.0.0.0 --port=5000
  ```
  Alternative command:
  ```bash
  flask run --host=0.0.0.0 --port=5000
  ```