# PhysicsCanvas Labs - Architecture Design

## Vision
Transform PhysicsCanvas from a single mechanics simulator into a comprehensive physics education platform with multiple specialized labs covering different areas of physics.

## Lab Structure

### Current State
- Single "Builder" mode with Matter.js mechanics simulation
- Tools: blocks, springs, pendulums, ramps
- Scene presets: free-fall, projectile, etc.

### Target State
Four specialized labs, each with domain-specific tools and visualizations:

1. **Mechanics Lab** (existing) - Classical mechanics with Matter.js
2. **Relativity Lab** - Special relativity & Minkowski spacetime
3. **Quantum Wave Lab** - Schrödinger equation & wave functions
4. **Uncertainty Lab** - Heisenberg uncertainty principle

---

## 1. Architecture Refactoring

### Route Structure
```
/                    → Home (Lab selector)
/mechanics           → Mechanics Lab (current builder)
/relativity          → Relativity Lab
/quantum-wave        → Quantum Wave Lab (Schrödinger)
/uncertainty         → Uncertainty Lab (Heisenberg)
```

### Component Structure
```typescript
// Generic lab interface
interface LabDefinition {
  id: 'mechanics' | 'relativity' | 'quantum-wave' | 'uncertainty';
  name: string;
  description: string;
  icon: string;
  route: string;
  toolsPanel: React.ComponentType<any>;
  canvasArea: React.ComponentType<any>;
  propertiesPanel: React.ComponentType<any>;
  controller: () => any; // Lab-specific state/logic hook
}
```

### Shared UI Shell
All labs share:
- Header with PhysicsCanvas branding
- Three-pane layout (tools | canvas | properties)
- Common styling and theme
- Navigation back to home

Lab-specific:
- Tool palette content
- Canvas rendering logic
- Properties panel content
- Control buttons (play/pause/reset semantics vary)

---

## 2. Mechanics Lab (Existing)

**Status**: ✅ Already implemented

**Keep as-is**:
- Matter.js physics engine
- Drag-and-drop tools
- Scene presets dropdown
- Object properties editing
- Simulation controls

**Minor changes**:
- Rename "Builder" → "Mechanics Lab"
- Add lab description: "Build forces & motion simulations using Newton's laws"
- Update routes from `/builder` to `/mechanics`

---

## 3. Relativity Lab - Minkowski Spacetime

### Learning Objectives
- Visualize spacetime diagrams
- Understand light cones and worldlines
- Explore relativity of simultaneity
- Calculate time dilation and length contraction
- Apply Lorentz transformations

### Tools Panel
```typescript
interface RelativityToolType {
  type: 'observer' | 'event' | 'light-pulse' | 'ruler' | 'clock';
  name: string;
  description: string;
}

const RELATIVITY_TOOLS = [
  { type: 'observer', name: 'Inertial Observer', description: 'Add reference frame' },
  { type: 'event', name: 'Event', description: 'Spacetime point' },
  { type: 'light-pulse', name: 'Light Pulse', description: 'Photon worldline at 45°' },
  { type: 'ruler', name: 'Ruler', description: 'Measure spatial interval' },
  { type: 'clock', name: 'Clock', description: 'Measure proper time' },
];
```

### Canvas Area
**Coordinate System**:
- Vertical axis: `ct` (time × speed of light)
- Horizontal axis: `x` (position)
- Grid with light cone guides (45° lines)
- Units: natural units (c = 1) or configurable

**Drawing Elements**:
```typescript
interface Observer {
  id: string;
  label: string;
  velocity: number;      // β = v/c, range: [-0.99, 0.99]
  color: string;
  worldline: Line;       // slope = 1/β
}

interface Event {
  id: string;
  label: string;
  t: number;             // lab frame time
  x: number;             // lab frame position
  marker: Point;
}

interface LightPulse {
  id: string;
  origin: Event;
  direction: 'forward' | 'backward';  // +45° or -45°
  worldline: Line;
}
```

**Rendering**:
- SVG or Canvas2D for clean vector graphics
- Axes with tick marks and labels
- Light cone overlay (optional toggle)
- Worldlines as straight lines with arrow heads
- Events as dots with labels
- Reference frame grid transformations (advanced)

### Properties Panel
**Selected Observer**:
```typescript
interface ObserverProperties {
  label: string;
  velocity: number;              // β slider: -0.99 to +0.99
  
  // Computed values:
  gamma: number;                 // γ = 1/√(1-β²)
  timeDilation: string;          // "Δt' = γΔt = 1.15Δt"
  lengthContraction: string;     // "L' = L/γ = 0.87L"
}
```

**Selected Event**:
```typescript
interface EventProperties {
  label: string;
  
  // Lab frame coordinates:
  t: number;
  x: number;
  
  // Transformed to selected observer's frame:
  tPrime: number;               // t' = γ(t - βx)
  xPrime: number;               // x' = γ(x - βt)
  
  // Display both frames side-by-side
}
```

**Lorentz Transform Formulas** (displayed):
```
t' = γ(t - vx/c²)
x' = γ(x - vt)

where γ = 1/√(1-v²/c²)
```

### Implementation Notes
```typescript
// Pure mathematical functions - no physics engine needed
function lorentzGamma(beta: number): number {
  return 1 / Math.sqrt(1 - beta * beta);
}

function lorentzTransform(
  t: number, 
  x: number, 
  beta: number
): { tPrime: number; xPrime: number } {
  const gamma = lorentzGamma(beta);
  return {
    tPrime: gamma * (t - beta * x),
    xPrime: gamma * (x - beta * t),
  };
}

// Canvas drawing
function drawWorldline(
  ctx: CanvasRenderingContext2D,
  observer: Observer,
  bounds: { tMin: number; tMax: number }
): void {
  const slope = 1 / observer.velocity; // dt/dx in spacetime diagram
  // Draw line from (x0, tMin) to (x0 + (tMax-tMin)*beta, tMax)
}

function drawLightCone(
  ctx: CanvasRenderingContext2D,
  origin: Event
): void {
  // Draw two 45° lines intersecting at origin
}
```

### Scene Presets
```typescript
const RELATIVITY_PRESETS = [
  'empty',
  'twinParadox',          // Two observers, one accelerates
  'simultaneity',         // Multiple events, different frames
  'lightClock',           // Vertical light bounce
  'lengthContraction',    // Moving ruler
];
```

---

## 4. Quantum Wave Lab - Schrödinger Equation

### Learning Objectives
- Visualize quantum wave functions
- Understand energy quantization
- See probability densities |ψ|²
- Explore how potential shapes affect eigenstates
- Introduce quantum tunneling (qualitatively)

### Tools Panel
```typescript
const QUANTUM_SYSTEMS = [
  { id: 'infiniteWell', name: 'Infinite Square Well', levels: 10 },
  { id: 'harmonicOscillator', name: 'Harmonic Oscillator', levels: 8 },
  { id: 'finiteWell', name: 'Finite Square Well', levels: 5 },
  { id: 'barrier', name: 'Potential Barrier (Tunneling)', levels: 1 },
  { id: 'doubleWell', name: 'Double Well', levels: 4 },
];
```

### Canvas Area
**Split View Layout**:
```
┌─────────────────────────────────┐
│  Potential V(x)                 │  ← Top 40%
│  _______________                │
│ |               |               │
│ |               |___            │
├─────────────────────────────────┤
│  Wave Function ψ(x)             │  ← Bottom 60%
│                                 │
│  Re(ψ) ─────                   │
│  Im(ψ) ─────                   │
│  |ψ|² █████                    │
└─────────────────────────────────┘
```

**Drawing Elements**:
```typescript
interface QuantumState {
  system: 'infiniteWell' | 'harmonicOscillator' | ...;
  energyLevel: number;        // n = 1, 2, 3, ...
  
  // Sampled data for plotting:
  xGrid: number[];            // Position samples
  potential: number[];        // V(x) at each x
  psiReal: number[];          // Re[ψ(x)]
  psiImag: number[];          // Im[ψ(x)]
  psiProbability: number[];   // |ψ(x)|²
  
  energy: number;             // E_n for this level
}
```

### Properties Panel
```typescript
interface QuantumProperties {
  systemName: string;
  energyLevel: number;        // n slider: 1 to maxLevels
  
  // Display options:
  showReal: boolean;
  showImaginary: boolean;
  showProbability: boolean;
  
  // System parameters:
  wellWidth?: number;         // L (for wells)
  barrierHeight?: number;     // V₀ (for barriers)
  omega?: number;             // ω (for oscillator)
  
  // Computed values:
  energy: string;             // "E₁ = 3.77 eV"
  normalization: string;      // "∫|ψ|²dx = 1.000"
}
```

### Implementation - Analytic Solutions

**Infinite Square Well** (0 to L):
```typescript
function infiniteWellWaveFunction(
  x: number,
  n: number,
  L: number
): { real: number; imag: number } {
  const psi = Math.sqrt(2 / L) * Math.sin((n * Math.PI * x) / L);
  return { real: psi, imag: 0 }; // Real-valued
}

function infiniteWellEnergy(n: number, L: number, m: number, hbar: number): number {
  return (n * n * Math.PI * Math.PI * hbar * hbar) / (2 * m * L * L);
}
```

**Harmonic Oscillator**:
```typescript
// Use first few Hermite polynomials
const hermitePolynomials = [
  (x: number) => 1,                                    // H₀
  (x: number) => 2 * x,                                // H₁
  (x: number) => 4 * x * x - 2,                        // H₂
  (x: number) => 8 * x * x * x - 12 * x,               // H₃
  (x: number) => 16 * x**4 - 48 * x**2 + 12,           // H₄
  // ... up to H₇ or H₉
];

function harmonicOscillatorWaveFunction(
  x: number,
  n: number,
  omega: number,
  m: number,
  hbar: number
): { real: number; imag: number } {
  const alpha = Math.sqrt(m * omega / hbar);
  const xi = alpha * x;
  const normalization = Math.pow(alpha / Math.sqrt(Math.PI), 0.5) / 
                        Math.sqrt(Math.pow(2, n) * factorial(n));
  const hermite = hermitePolynomials[n](xi);
  const gaussian = Math.exp(-xi * xi / 2);
  const psi = normalization * hermite * gaussian;
  return { real: psi, imag: 0 };
}

function harmonicOscillatorEnergy(n: number, omega: number, hbar: number): number {
  return hbar * omega * (n + 0.5);
}
```

**Rendering**:
- Use Chart.js or D3.js for clean line plots
- Or custom Canvas2D with antialiasing
- Color code: Re(ψ) = blue, Im(ψ) = red, |ψ|² = green/filled area

### Scene Presets
```typescript
const QUANTUM_PRESETS = [
  { system: 'infiniteWell', n: 1, label: 'Ground State' },
  { system: 'infiniteWell', n: 3, label: 'Third Excited State' },
  { system: 'harmonicOscillator', n: 2, label: 'Oscillator n=2' },
  { system: 'barrier', n: 1, label: 'Tunneling Demo' },
];
```

---

## 5. Uncertainty Lab - Heisenberg Principle

### Learning Objectives
- Visualize position-momentum trade-off
- Understand ΔxΔp ≥ ℏ/2 quantitatively
- Connect to wave-particle duality
- See Fourier transform relationship

### Tools Panel
```typescript
const UNCERTAINTY_DEMOS = [
  { id: 'gaussian', name: 'Gaussian Wave Packet', description: 'Pure Gaussian in x & p' },
  { id: 'slit', name: 'Single-Slit Diffraction', description: 'Position constraint → momentum spread' },
  { id: 'doubleGaussian', name: 'Double-Peak Packet', description: 'Non-minimal uncertainty' },
];
```

### Canvas Area
**Dual Plot Layout**:
```
┌──────────────────┬──────────────────┐
│                  │                  │
│   |ψ(x)|²        │   |φ(p)|²        │
│                  │                  │
│   Position       │   Momentum       │
│   Space          │   Space          │
│                  │                  │
└──────────────────┴──────────────────┘

         σₓ = 2.5 Å              σₚ = 0.42 ℏ/Å
         
         ΔxΔp = 1.05 ℏ ≥ 0.5 ℏ ✓
```

**Drawing Elements**:
```typescript
interface UncertaintyState {
  demo: 'gaussian' | 'slit' | 'doubleGaussian';
  
  // Position space:
  xGrid: number[];
  psiX: number[];        // |ψ(x)|²
  sigmaX: number;        // Position spread
  
  // Momentum space (Fourier transform):
  pGrid: number[];
  psiP: number[];        // |φ(p)|²
  sigmaP: number;        // Momentum spread
  
  // Uncertainty product:
  uncertaintyProduct: number;  // σₓ × σₚ
  minUncertainty: number;      // ℏ/2
}
```

### Properties Panel
```typescript
interface UncertaintyProperties {
  demoName: string;
  
  // Control:
  positionSpread: number;     // σₓ slider
  centerPosition?: number;    // x₀
  
  // For slit demo:
  slitWidth?: number;         // a
  wavelength?: number;        // λ
  
  // Display:
  sigmaX: string;             // "Δx = 2.50 Å"
  sigmaP: string;             // "Δp = 0.42 ℏ/Å"
  product: string;            // "ΔxΔp = 1.05 ℏ"
  ratio: string;              // "= 2.1 × (ℏ/2)"
  satisfiesHUP: boolean;      // Check if ≥ ℏ/2
}
```

### Implementation

**Gaussian Wave Packet**:
```typescript
function gaussianWavePacket(
  xGrid: number[],
  x0: number,
  sigmaX: number,
  k0: number = 0
): { psiX: number[]; sigmaX: number } {
  const psiX = xGrid.map(x => {
    const arg = -(x - x0) ** 2 / (2 * sigmaX ** 2);
    return Math.exp(arg) / Math.sqrt(Math.sqrt(2 * Math.PI) * sigmaX);
  });
  
  return { psiX: psiX.map(p => p * p), sigmaX };
}

function fourierTransform(
  xGrid: number[],
  psiX: number[]
): { pGrid: number[]; psiP: number[]; sigmaP: number } {
  // For Gaussian: analytic FT is also Gaussian
  // φ(p) ∝ exp(-p²σₓ²/2ℏ²)
  
  const sigmaP = HBAR / (2 * sigmaX); // For minimum uncertainty Gaussian
  
  const pGrid = linspace(-5 * sigmaP, 5 * sigmaP, xGrid.length);
  const psiP = pGrid.map(p => {
    const arg = -(p * sigmaX / HBAR) ** 2 / 2;
    return Math.exp(arg);
  });
  
  return { pGrid, psiP: psiP.map(p => p * p), sigmaP };
}
```

**Single-Slit Diffraction**:
```typescript
function singleSlitDiffraction(
  thetaGrid: number[],  // Angles
  slitWidth: number,    // a
  wavelength: number    // λ
): number[] {
  return thetaGrid.map(theta => {
    const beta = (Math.PI * slitWidth * Math.sin(theta)) / wavelength;
    if (Math.abs(beta) < 1e-6) return 1;
    const sinc = Math.sin(beta) / beta;
    return sinc * sinc; // Intensity ∝ sinc²
  });
}
```

**Uncertainty Calculation**:
```typescript
function calculateUncertainty(
  grid: number[],
  probability: number[]
): number {
  // σ = √(<x²> - <x>²)
  const dx = grid[1] - grid[0];
  const norm = probability.reduce((sum, p) => sum + p * dx, 0);
  const mean = probability.reduce((sum, p, i) => sum + p * grid[i] * dx, 0) / norm;
  const variance = probability.reduce(
    (sum, p, i) => sum + p * (grid[i] - mean) ** 2 * dx,
    0
  ) / norm;
  return Math.sqrt(variance);
}
```

### Scene Presets
```typescript
const UNCERTAINTY_PRESETS = [
  { demo: 'gaussian', sigmaX: 1.0, label: 'Minimum Uncertainty' },
  { demo: 'gaussian', sigmaX: 0.5, label: 'Narrow Position' },
  { demo: 'gaussian', sigmaX: 3.0, label: 'Wide Position' },
  { demo: 'slit', slitWidth: 1e-6, label: 'Narrow Slit' },
  { demo: 'slit', slitWidth: 5e-6, label: 'Wide Slit' },
];
```

---

## 6. Implementation Roadmap

### Phase 1: Architecture Refactoring (Week 1)
- [ ] Create lab definition interfaces
- [ ] Refactor routing: add React Router with `/mechanics`, `/relativity`, etc.
- [ ] Update Home page with lab selector cards
- [ ] Create generic `LabLayout` component
- [ ] Rename existing builder → Mechanics Lab
- [ ] Update navigation and breadcrumbs

### Phase 2: Relativity Lab MVP (Week 2)
- [ ] Create Relativity tools panel component
- [ ] Implement Minkowski canvas with grid and axes
- [ ] Add Observer and Event entities
- [ ] Implement Lorentz transform math
- [ ] Create Relativity properties panel
- [ ] Add basic presets (simultaneity, light cone)
- [ ] Test and polish interactions

### Phase 3: Quantum Wave Lab MVP (Week 3)
- [ ] Create Quantum tools panel with system selector
- [ ] Implement split-view canvas (potential + wavefunction)
- [ ] Add infinite square well solution
- [ ] Add harmonic oscillator solution
- [ ] Create energy level slider
- [ ] Implement plotting library integration
- [ ] Add display toggles (Re, Im, |ψ|²)
- [ ] Create presets for common states

### Phase 4: Uncertainty Lab MVP (Week 4)
- [ ] Create Uncertainty tools panel
- [ ] Implement dual-plot canvas (x-space & p-space)
- [ ] Add Gaussian wave packet with controls
- [ ] Implement Fourier transform visualization
- [ ] Add single-slit diffraction demo
- [ ] Display uncertainty product calculations
- [ ] Create interactive sliders
- [ ] Add presets and explanatory text

### Phase 5: Polish & Integration (Week 5)
- [ ] Add lab descriptions and learning objectives to each lab
- [ ] Implement "Reset to Preset" buttons
- [ ] Add keyboard shortcuts
- [ ] Create tutorial overlays / tooltips
- [ ] Write comprehensive documentation
- [ ] Add unit tests for mathematical functions
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] User testing and feedback iteration

---

## 7. Technical Dependencies

### New Libraries
```json
{
  "react-router-dom": "^6.x",      // Multi-route navigation
  "chart.js": "^4.x",              // Quantum & Uncertainty plotting
  "react-chartjs-2": "^5.x",       // React wrapper
  "fft.js": "^4.x",                // Fast Fourier Transform
  "mathjs": "^12.x"                // Advanced math functions (optional)
}
```

### File Structure
```
src/
├── labs/
│   ├── common/
│   │   ├── LabLayout.tsx
│   │   ├── LabCard.tsx
│   │   └── types.ts
│   ├── mechanics/              (existing builder refactored)
│   │   ├── MechanicsLab.tsx
│   │   ├── MechanicsTools.tsx
│   │   ├── MechanicsCanvas.tsx
│   │   ├── MechanicsProperties.tsx
│   │   └── useMechanicsController.ts
│   ├── relativity/
│   │   ├── RelativityLab.tsx
│   │   ├── RelativityTools.tsx
│   │   ├── MinkowskiCanvas.tsx
│   │   ├── RelativityProperties.tsx
│   │   ├── useRelativityController.ts
│   │   └── math/
│   │       ├── lorentz.ts
│   │       └── worldlines.ts
│   ├── quantum-wave/
│   │   ├── QuantumWaveLab.tsx
│   │   ├── QuantumTools.tsx
│   │   ├── WaveFunctionCanvas.tsx
│   │   ├── QuantumProperties.tsx
│   │   ├── useQuantumController.ts
│   │   └── solutions/
│   │       ├── infiniteWell.ts
│   │       ├── harmonicOscillator.ts
│   │       └── types.ts
│   └── uncertainty/
│       ├── UncertaintyLab.tsx
│       ├── UncertaintyTools.tsx
│       ├── DualPlotCanvas.tsx
│       ├── UncertaintyProperties.tsx
│       ├── useUncertaintyController.ts
│       └── math/
│           ├── gaussian.ts
│           ├── fourier.ts
│           └── uncertainty.ts
├── routes/
│   ├── HomePage.tsx           (lab selector)
│   ├── MechanicsPage.tsx
│   ├── RelativityPage.tsx
│   ├── QuantumWavePage.tsx
│   └── UncertaintyPage.tsx
└── App.tsx                    (router setup)
```

---

## 8. Design Mockups

### Home Page
```
┌─────────────────────────────────────────────┐
│  PhysicsCanvas                     [About]  │
├─────────────────────────────────────────────┤
│                                             │
│     Choose Your Physics Lab                 │
│                                             │
│  ┌────────┐  ┌────────┐  ┌────────┐       │
│  │ ⚙️ Mech │  │ 🌌 Rel  │  │ 🌊 QM   │       │
│  │ anics  │  │ ativity│  │ Wave   │       │
│  │        │  │        │  │        │       │
│  │ Forces │  │ Space- │  │ Schrö- │       │
│  │ Motion │  │ time   │  │ dinger │       │
│  └────────┘  └────────┘  └────────┘       │
│                                             │
│  ┌────────┐                                │
│  │ 📊 HUP  │                                │
│  │ Uncer- │                                │
│  │ tainty │                                │
│  └────────┘                                │
└─────────────────────────────────────────────┘
```

### Lab Layout (Generic)
```
┌───────────────────────────────────────────────────┐
│ PhysicsCanvas › [Lab Name]           [← Home]     │
├──────────┬──────────────────────────┬─────────────┤
│          │                          │             │
│  TOOLS   │        CANVAS            │ PROPERTIES  │
│          │                          │             │
│  [Tool1] │  [Main Visualization]    │ Selected:   │
│  [Tool2] │                          │  [Name]     │
│  [Tool3] │                          │             │
│          │                          │  [Controls] │
│  Presets │                          │             │
│  ▼ [↓]   │                          │  [Values]   │
│          │                          │             │
│          ├──────────────────────────┤             │
│          │  [▶ Play] [⏸ Pause]      │             │
│          │  [↻ Reset] [Gravity: ✓]  │             │
└──────────┴──────────────────────────┴─────────────┘
```

---

## 9. User Experience Considerations

### Teacher-Friendly Features
1. **Quick Presets**: One-click setups for common demonstrations
2. **Explanatory Text**: Brief descriptions of what students should observe
3. **Reset Button**: Always visible, returns to last preset state
4. **Numerical Values**: Display calculated quantities prominently
5. **Print/Export**: Save screenshots or parameter sets

### Student Engagement
1. **Interactive Sliders**: Immediate visual feedback on parameter changes
2. **Visual Clarity**: High contrast, clear labels, large fonts
3. **Guided Exploration**: Tooltips and hover effects
4. **Progressive Complexity**: Start simple, allow advanced features

### Accessibility
1. **Keyboard Navigation**: All controls accessible via keyboard
2. **Screen Reader Support**: Proper ARIA labels
3. **Color Blind Friendly**: Don't rely solely on color distinctions
4. **Responsive Design**: Works on tablets and smaller screens

---

## 10. Future Extensions (Post-MVP)

### Additional Labs
- **E&M Lab**: Electric fields, magnetic fields, circuits
- **Thermodynamics**: Statistical mechanics, heat transfer
- **Optics**: Ray tracing, interference, diffraction
- **Nuclear**: Decay chains, binding energy

### Advanced Features
- **Time Evolution**: Animate quantum wave packets, relativistic scenarios
- **3D Visualizations**: 3D quantum orbitals, 3D spacetime
- **Collaborative Mode**: Multiple users on same simulation
- **Data Export**: CSV download for further analysis
- **Custom Scenarios**: Teachers upload their own configurations
- **Assessment Integration**: LMS integration, problem sets

---

## Success Metrics

1. **Engagement**: Time spent per lab, interactions per session
2. **Learning**: Pre/post quiz scores, concept retention
3. **Adoption**: Number of teachers using platform, student reach
4. **Feedback**: User satisfaction scores, feature requests
5. **Performance**: Load times, frame rates, responsiveness

---

## Conclusion

This multi-lab architecture transforms PhysicsCanvas into a comprehensive physics education platform while maintaining code reusability and a consistent user experience. Each lab leverages domain-appropriate technologies (Matter.js for mechanics, pure math for relativity/quantum) within a shared UI framework.

The phased implementation approach allows incremental delivery of value while managing complexity. Starting with architecture refactoring ensures a solid foundation for the specialized labs.
