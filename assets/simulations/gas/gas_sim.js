// script.js

// ——— Parameters & State ———
const N    = 200;
const size = (N + 2) * (N + 2);
const dt   = 0.01;

const simParams = {
  // wind field
  windType:   'Custom',       // 'Uniform' | 'Vortex' | 'Sinusoidal' | 'Custom'
  windForce:   7,             // capped 0–20
  windAngle:   0,             // degrees for Uniform
  dynF:       'sin(pi*x)*cos(pi*y)', // dx/dt = f(x,y)
  dynG:      'x-y',           // dy/dt = g(x,y)

  // injection
  injectionDensity: 1000,
  injectionRadius:   4,

  // damping
  velDamping:   0.99,
  densDamping:  0.99,

  // fluid properties
  diff:     0,
  visc:     0.0001,

  // arrow visuals
  arrowSpacing:   4,
  arrowScale:     5,
  arrowLineWidth: 1.5,
  arrowHueMax:    240,

  // display toggles
  showField:     true,
  clearEquilibria: true,      // toggle for clearing equilibria

  // reset callback
  reset: () => {
    u.fill(0);
    v.fill(0);
    dens.fill(0);
  }
};

// ——— Field Arrays ———
let u     = new Float32Array(size),
    v     = new Float32Array(size),
    u0    = new Float32Array(size),
    v0    = new Float32Array(size),
    dens  = new Float32Array(size),
    dens0 = new Float32Array(size),
    p     = new Float32Array(size),
    div   = new Float32Array(size),
    windU = new Float32Array(size),
    windV = new Float32Array(size);

// Math.js nodes
let fNode = null, gNode = null;

// ——— Canvas Setup ———
const offCanvas = document.createElement('canvas');
offCanvas.width  = N;
offCanvas.height = N;
const offCtx     = offCanvas.getContext('2d');

const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');
function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false;
}
window.addEventListener('resize', resize);
resize();

const densityImage = offCtx.createImageData(N, N);

// ——— Debounce Helper ———
function debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

// ——— Helpers & Solver ———
function IX(i,j) {
  return i + (N + 2) * j;
}

function setBoundary(b, x) {
  for (let i = 1; i <= N; i++) {
    x[IX(0 ,i)]   = b===1 ? -x[IX(1, i)]   : x[IX(1, i)];
    x[IX(N+1,i)]  = b===1 ? -x[IX(N, i)]   : x[IX(N, i)];
    x[IX(i,0 )]   = b===2 ? -x[IX(i, 1)]   : x[IX(i, 1)];
    x[IX(i,N+1)]  = b===2 ? -x[IX(i, N)]   : x[IX(i, N)];
  }
  x[IX(0 ,0 )]     = 0.5 * (x[IX(1,0 )]   + x[IX(0 ,1)]);
  x[IX(0 ,N+1)]    = 0.5 * (x[IX(1,N+1)] + x[IX(0 ,N )]);
  x[IX(N+1,0 )]    = 0.5 * (x[IX(N,0 )]   + x[IX(N+1,1)]);
  x[IX(N+1,N+1)]   = 0.5 * (x[IX(N,N+1)] + x[IX(N+1,N)]);
}

function linSolve(x, x0, a, c) {
  for (let k = 0; k < 20; k++) {
    for (let j = 1; j <= N; j++) {
      for (let i = 1; i <= N; i++) {
        x[IX(i,j)] = (x0[IX(i,j)]
          + a * ( x[IX(i-1,j)] + x[IX(i+1,j)]
                + x[IX(i,j-1)] + x[IX(i,j+1)] )
          ) / c;
      }
    }
    setBoundary(0, x);
  }
}

function diffuse(b, x, x0, diff) {
  const a = dt * diff * N * N;
  linSolve(x, x0, a, 1 + 4 * a);
  setBoundary(b, x);
}

function advect(b, d, d0, uArr, vArr) {
  const dt0 = dt * N;
  for (let j = 1; j <= N; j++) {
    for (let i = 1; i <= N; i++) {
      let x = i - dt0 * uArr[IX(i,j)];
      let y = j - dt0 * vArr[IX(i,j)];
      x = Math.max(0.5, Math.min(N + 0.5, x));
      y = Math.max(0.5, Math.min(N + 0.5, y));
      const i0 = Math.floor(x),
            j0 = Math.floor(y),
            i1 = i0 + 1,
            j1 = j0 + 1,
            s1 = x - i0,
            s0 = 1 - s1,
            t1 = y - j0,
            t0 = 1 - t1;
      d[IX(i,j)] =
        s0 * (t0 * d0[IX(i0,j0)] + t1 * d0[IX(i0,j1)]) +
        s1 * (t0 * d0[IX(i1,j0)] + t1 * d0[IX(i1,j1)]);
    }
  }
  setBoundary(b, d);
}

function project(uArr, vArr, pArr, divArr) {
  const h = 1 / N;
  for (let j = 1; j <= N; j++) {
    for (let i = 1; i <= N; i++) {
      divArr[IX(i,j)] = -0.5 * h * (
        uArr[IX(i+1,j)] - uArr[IX(i-1,j)] +
        vArr[IX(i,j+1)] - vArr[IX(i,j-1)]
      );
      pArr[IX(i,j)] = 0;
    }
  }
  setBoundary(0, divArr);
  setBoundary(0, pArr);
  linSolve(pArr, divArr, 1, 4);
  for (let j = 1; j <= N; j++) {
    for (let i = 1; i <= N; i++) {
      uArr[IX(i,j)] -= 0.5 * (pArr[IX(i+1,j)] - pArr[IX(i-1,j)]) / h;
      vArr[IX(i,j)] -= 0.5 * (pArr[IX(i,j+1)] - pArr[IX(i,j-1)]) / h;
    }
  }
  setBoundary(1, uArr);
  setBoundary(2, vArr);
}

// ——— Build Wind Field ———
function updateWindField() {
  const wf = Math.min(Math.max(simParams.windForce, 0), 20);
  const rad  = simParams.windAngle * Math.PI/180,
        cosA = Math.cos(rad), sinA = Math.sin(rad);

  if (simParams.windType === 'Custom') {
    try {
      fNode = math.compile(simParams.dynF);
      gNode = math.compile(simParams.dynG);
    } catch (e) {
      console.error('Parse error:', e);
      return;
    }
  }

  for (let j = 1; j <= N; j++) {
    for (let i = 1; i <= N; i++) {
      const k = IX(i,j),
            x = ((i-1)/(N-1))*2 - 1,
            y = ((j-1)/(N-1))*2 - 1;
      switch (simParams.windType) {
        case 'Uniform':
          windU[k] = cosA * wf;
          windV[k] = sinA * wf; break;
        case 'Vortex': {
          const cx = (N+1)/2, cy = cx,
                dx = i - cx, dy = j - cy,
                len = Math.hypot(dx,dy) || 1;
          windU[k] = -dy/len * wf;
          windV[k] =  dx/len * wf; break;
        }
        case 'Sinusoidal':
          windU[k] = Math.sin(Math.PI * x) * wf;
          windV[k] = Math.cos(Math.PI * y) * wf; break;
        case 'Custom':
          windU[k] = fNode.evaluate({x,y}) * wf;
          windV[k] = gNode.evaluate({x,y}) * wf; break;
      }
    }
  }
}

// ——— Mouse Injection ———
let isMouseDown=false, lastFx=0, lastFy=0;
canvas.addEventListener('mousedown', e => {
  isMouseDown = true;
  const r = canvas.getBoundingClientRect();
  lastFx = (e.clientX - r.left) * (N / r.width);
  lastFy = (e.clientY - r.top)  * (N / r.height);
});
canvas.addEventListener('mouseup',   () => isMouseDown=false);
canvas.addEventListener('mousemove', e => {
  if (!isMouseDown) return;
  const r  = canvas.getBoundingClientRect();
  const fx = (e.clientX - r.left) * (N / r.width);
  const fy = (e.clientY - r.top)  * (N / r.height);
  const i  = Math.max(0, Math.min(N-1, Math.floor(fx)));
  const j  = Math.max(0, Math.min(N-1, Math.floor(fy)));
  for (let dj=-simParams.injectionRadius; dj<=simParams.injectionRadius; dj++){
    for (let di=-simParams.injectionRadius; di<=simParams.injectionRadius; di++){
      const ii=i+di, jj=j+dj;
      if (ii<0||ii>=N||jj<0||jj>=N) continue;
      const idx=IX(ii+1,jj+1);
      dens[idx]+=simParams.injectionDensity;
      u[idx]+=(fx-lastFx)*0.5;
      v[idx]+=(fy-lastFy)*0.5;
    }
  }
  lastFx=fx; lastFy=fy;
});

// ——— GUI Controls ———
const gui = new dat.GUI();
const debUpdate = debounce(updateWindField, 50);

// windType control with onChange to enable/disable dyn controls
const windTypeCtrl = gui.add(simParams, 'windType', ['Uniform','Vortex','Sinusoidal','Custom'])
  .name('Wind Type')
  .onChange(val => {
    debUpdate();
    updateDynCtrls(val);
  });

// capture dyn controllers
const dynFCtrl = gui.add(simParams, 'dynF').name('dx/dt = f(x,y)').onFinishChange(debUpdate);
const dynGCtrl = gui.add(simParams, 'dynG').name('dy/dt = g(x,y)').onFinishChange(debUpdate);

gui.add(simParams, 'windForce', 0,20).step(0.1).name('Wind Force').onChange(debUpdate);
gui.add(simParams, 'showField').name('Show Field ');
gui.add(simParams, 'clearEquilibria').name('Exclude Equilibrium');
gui.add(simParams, 'reset').name('Reset');

const adv = gui.addFolder('Advanced Simulation Options');
adv.add(simParams, 'injectionDensity', 0,2000).step(1).name('Injection Density');
adv.add(simParams, 'injectionRadius',  0,  10).step(1).name('Injection Radius');
adv.add(simParams, 'velDamping',    0.90,1.00).step(0.001).name('Vel. Damping');
adv.add(simParams, 'densDamping',   0.90,1.00).step(0.001).name('Dens. Damping');
adv.add(simParams, 'diff',           0.0,0.02).step(0.0001).name('Diffusion');
adv.add(simParams, 'visc',           0.0,0.001).step(0.0001).name('Viscosity');

function updateDynCtrls(val) {
  const isCustom = val === 'Custom';
  [dynFCtrl, dynGCtrl].forEach(ctrl => {
    ctrl.domElement.parentElement.style.pointerEvents = isCustom ? '' : 'none';
    ctrl.domElement.parentElement.style.opacity       = isCustom ? '1' : '0.5';
  });
}
// initialize enable/disable
updateDynCtrls(simParams.windType);

updateWindField();

// ——— Rendering & Loop ———
function renderDensity() {
  const data = densityImage.data;
  let off = 0;
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++, off += 4) {
      const c = Math.min(255, dens[IX(i+1,j+1)]);
      data[off] = data[off+1] = data[off+2] = c;
      data[off+3] = 255;
    }
  }
  offCtx.putImageData(densityImage, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(offCanvas, 0, 0, canvas.width, canvas.height);
}

function drawField() {
  const cw = canvas.width, ch = canvas.height;
  const step = simParams.arrowSpacing;
  const len  = step * simParams.arrowScale;
  const hueMax = simParams.arrowHueMax;
  ctx.lineWidth = simParams.arrowLineWidth;
  for (let j = step/2; j < N; j += step) {
    for (let i = step/2; i < N; i += step) {
      const k  = IX(i+1,j+1);
      const ux = windU[k], vy = windV[k];
      const mag = Math.hypot(ux, vy);
      if (mag < 0.005) continue;
      const x0 = (i/N)*cw, y0 = (j/N)*ch;
      const dx = ux/mag, dy = vy/mag;
      const x1 = x0 + dx*len, y1 = y0 + dy*len;
      const hue = Math.floor(hueMax * (mag / simParams.windForce));
      ctx.strokeStyle = `hsl(${hue},100%,50%)`;
      ctx.fillStyle   = `hsl(${hue},100%,50%)`;
      ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x1,y1);
      ctx.lineTo(x1 - dx*5 - dy*3, y1 - dy*5 + dx*3);
      ctx.lineTo(x1 - dx*5 + dy*3, y1 - dy*5 - dx*3);
      ctx.closePath(); ctx.fill();
    }
  }
}

function drawAxes() {
  const cw = canvas.width, ch = canvas.height;
  const cx = cw/2, cy = ch/2;
  ctx.save();
  ctx.strokeStyle = 'white'; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, cy); ctx.lineTo(cw, cy);
  ctx.moveTo(cx, 0); ctx.lineTo(cx, ch);
  ctx.stroke();
  ctx.fillStyle = 'white'; ctx.font = '12px sans-serif';
  [-64, -32, 32, 64].forEach(t => {
    const x_px = cx + t*(cw/N), y_px = cy - t*(ch/N);
    ctx.beginPath(); ctx.moveTo(x_px, cy-5); ctx.lineTo(x_px, cy+5); ctx.stroke();
    ctx.fillText(t, x_px-10, cy+20);
    ctx.beginPath(); ctx.moveTo(cx-5, y_px); ctx.lineTo(cx+5, y_px); ctx.stroke();
    ctx.fillText(t, cx+8, y_px+4);
  });
  ctx.restore();
}

function step() {
  // solver
  for (let k = 0; k < size; k++){
    u[k] += windU[k] * dt;
    v[k] += windV[k] * dt;
  }
  diffuse(1, u0, u, simParams.visc);
  diffuse(2, v0, v, simParams.visc);
  project(u0, v0, u, v);
  advect(1, u, u0, u0, v0);
  advect(2, v, v0, u0, v0);
  project(u, v, u0, v0);
  diffuse(0, dens0, dens, simParams.diff);
  advect(0, dens, dens0, u, v);

  // damping
  for (let k = 0; k < size; k++){
    u[k]   *= simParams.velDamping;
    v[k]   *= simParams.velDamping;
    dens[k]*= simParams.densDamping;
  }

  // boundary damping
  const edgeDamp = 0.5;
  for (let i = 1; i <= N; i++) {
    dens[IX(i,1)] *= edgeDamp;
    dens[IX(i,N)] *= edgeDamp;
    dens[IX(1,i)] *= edgeDamp;
    dens[IX(N,i)] *= edgeDamp;
  }

  // clear equilibria
  if (simParams.clearEquilibria) {
    for (let j = 2; j < N; j++) {
      for (let i = 2; i < N; i++) {
        const U_lr = windU[IX(i-1,j)] * windU[IX(i+1,j)] <= 0;
        const V_ud = windV[IX(i,  j-1)] * windV[IX(i,  j+1)] <= 0;
        const U_ud = windU[IX(i,  j-1)] * windU[IX(i,  j+1)] <= 0;
        const V_lr = windV[IX(i-1,j)] * windV[IX(i+1,j)] <= 0;
        if ((U_lr && V_ud) || (U_ud && V_lr)) {
          dens[IX(i, j)] = 0;
        }
      }
    }
  }

  renderDensity();
  if (simParams.showField) {
    drawField();
    drawAxes();
  }
  requestAnimationFrame(step);
}

step();
