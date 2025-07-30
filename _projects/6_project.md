---
layout: page
title: Kalman Filter State Estimation
description: Stochastic Kalman upgrade equations implemented to python
img:
importance: 4
category: work
math: true  # ✅ Enables MathJax if your theme supports it
---

## Kalman Filter Convergence
This project visualizes the convergence behavior of a Kalman filter applied to a linear dynamical system described by the stochastic equations:

\\[
x_{t+1} = A x_t + w_t, \quad y_t = C x_t + v_t
\\]

where \\( w_t \sim \mathcal{N}(0, I) \\) and \\( v_t \sim \mathcal{N}(0, 1) \\) are independent noise terms. The system aims to estimate the hidden state \\( x_t \\) through noisy observations \\( y_t \\), using a recursive update known as the **Kalman filter**.

### Estimator and Riccati Update

The Kalman filter updates the state estimate \\( \tilde{m}_t = \mathbb{E}[x_t \mid y_{0:t}] \\) recursively using:

\\[
\tilde{m}_t = A \tilde{m}_{t-1} + \Sigma_{t \mid t-1} C^\top \left(C \Sigma_{t \mid t-1} C^\top + V\right)^{-1} \left(y_t - C A \tilde{m}_{t-1}\right)
\\]


where \\( \Sigma_{t|t-1} \\) is the prediction covariance. The covariance update follows the Riccati recursion:

\\[
\Sigma_{t+1|t} = A \Sigma_{t|t-1} A^\top + W - (A \Sigma_{t|t-1} C^\top)(C \Sigma_{t|t-1} C^\top + V)^{-1}(C \Sigma_{t|t-1} A^\top).
\\]

Implementation of these iterations into Python is as follows:
```python
v_t = np.random.normal(0, 1, 1)
w_t = np.random.normal(0, 1, (np.size(A, 0), 1))
y = C @ x + v_t
x = A @ x + w_t
M = A @ M + sigma @ C_T * ((y - C @ A @ M) / (C @ sigma @ C_T + 1))
sigma = A @ sigma @ A.T + I - A @ sigma @ C_T * ((C * sigma @ A.T) / (C @ sigma @ C_T + 1))
```

### Simulation and Visualization

In the simulation, we use the following matrices as an example, they can be replaced with any N × N and N × 1 matrices:

```python
A = np.array([
    [0.8, 0,   0,   0,   0.2],
    [0,   0.1, 0.1, 0,   0],
    [0,   0,   0.3, 0,   0.1],
    [0,   0,   0,   0.1, 0],
    [0.1, 0.2, 0,   0,   0]
])

C = np.array([0.1, 0, 0, 0, 0.2])
```


The convergence of the filter is evaluated by tracking the following quantities over time:

- \\( \|x_t\| \\): Norm of the true state (orange line)  
- \\( \|\tilde{m}_t\| \\): Norm of the estimated state (green line)  
- \\( \|x_t - \tilde{m}_t\| \\): Estimation error (blue line)  
- \\( \|\Sigma_t\|_F \\): Frobenius norm of the covariance matrix (black line)

<div class="row justify-content-sm-center">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets//kalman_1.png" title="Kalman Filter – State Norms" class="img-fluid rounded z-depth-1" %}
  </div>
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid path="assets//kalman_2.png" title="Kalman Filter – Estimation Error" class="img-fluid rounded z-depth-1" %}
  </div>
</div>


The resulting plot illustrates how the estimator converges to the true state and how the uncertainty (captured by \\( \Sigma \\)) decreases over time.

> For convergence, it is important that all eigenvalues of matrix \\( A \\) lie strictly inside the unit circle.

**Author:** Şevket Kaan Alkır  
**Date:** July 2024
