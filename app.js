/**
 * Career Navigation System for Data Talent Workforce
 * Command Q - Build for Bharat 2.0 Hackathon
 * Empirical data-driven analytics and career recommendation engines.
 */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initCounters();
    initBenchmarkCharts();
    initEngine1Psychometrics();
    initEngine2Skills();
    initEngine3Progression();
    initEngine4Company();
});

/* ==========================================================================
   1. PARTICLES & VISUAL EFFECTS
   ========================================================================== */
function initParticles() {
    const container = document.getElementById('bgParticles');
    if (!container) return;

    const count = 25;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 8 + 3;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const dur = Math.random() * 18 + 12;
        const dx = (Math.random() * 80 - 40) + 'px';
        const dy = (Math.random() * 80 - 40) + 'px';

        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = x + '%';
        p.style.top = y + '%';
        p.style.setProperty('--dur', dur + 's');
        p.style.setProperty('--dx', dx);
        p.style.setProperty('--dy', dy);
        p.style.opacity = (Math.random() * 0.08 + 0.02).toString();

        container.appendChild(p);
    }
}

/* ==========================================================================
   2. NAVBAR & NAVIGATION
   ========================================================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
            toggle.classList.toggle('open');
        });

        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                links.classList.remove('open');
                toggle.classList.remove('open');
            });
        });
    }

    // Scroll active link highlight & navbar glass elevation
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(sec => {
            const secH = sec.offsetHeight;
            const secT = sec.offsetTop - 120;
            const secId = sec.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${secId}"]`);
            if (link) {
                if (scrollY >= secT && scrollY < secT + secH) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    });
}

/* ==========================================================================
   3. ANIMATED COUNTERS
   ========================================================================== */
function initCounters() {
    const statCounters = document.querySelectorAll('.stat-number[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                if (isNaN(target)) return;

                let start = 0;
                const duration = 1800;
                const startTime = performance.now();

                function updateCounter(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutQuart
                    const ease = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(ease * target);
                    el.textContent = current.toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target.toLocaleString();
                    }
                }

                requestAnimationFrame(updateCounter);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    statCounters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   4. EMPIRICAL BENCHMARK CHARTS
   ========================================================================== */
function initBenchmarkCharts() {
    // Common ChartJS Dark Theme defaults
    Chart.defaults.color = '#9ca3c2';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 20, 40, 0.95)';
    Chart.defaults.plugins.tooltip.titleColor = '#e8eaf6';
    Chart.defaults.plugins.tooltip.bodyColor = '#9ca3c2';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(99, 102, 241, 0.3)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;

    // --- Chart 1: SDS Trait Effect Sizes ---
    const ctxSds = document.getElementById('chartSdsEffects');
    if (ctxSds) {
        new Chart(ctxSds, {
            type: 'bar',
            data: {
                labels: [
                    'Conscientiousness',
                    'Openness',
                    'Extraversion',
                    'Agreeableness',
                    'Neuroticism'
                ],
                datasets: [{
                    label: "Cohen's d (Senior Leadership)",
                    data: [1.815, 1.774, 1.115, 0.595, -0.012],
                    backgroundColor: [
                        '#6366f1',
                        '#06b6d4',
                        '#8b5cf6',
                        '#3b82f6',
                        '#64748b'
                    ],
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        title: { display: true, text: "Effect Size (Cohen's d)" }
                    },
                    y: {
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            afterLabel: (ctx) => {
                                const pVals = ['p < 0.001 (***)', 'p < 0.001 (***)', 'p < 0.001 (***)', 'p = 0.004 (**)', 'p = 0.454 (ns)'];
                                return `Significance: ${pVals[ctx.dataIndex]}\nAUC: ${['0.878', '0.885', '0.783', '0.652', '0.534'][ctx.dataIndex]}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // --- Chart 2: JDS Skill Effect Sizes ---
    const ctxJds = document.getElementById('chartJdsEffects');
    if (ctxJds) {
        new Chart(ctxJds, {
            type: 'bar',
            data: {
                labels: [
                    'Storytelling & Dashboards',
                    'Math & Statistics',
                    'Coding Skills',
                    'AI & Machine Learning',
                    'Big Data Skills'
                ],
                datasets: [{
                    label: "Cohen's d (Junior Promotion Hike)",
                    data: [1.302, 1.202, 0.976, 0.863, 0.223],
                    backgroundColor: [
                        '#06b6d4',
                        '#6366f1',
                        '#10b981',
                        '#a78bfa',
                        '#64748b'
                    ],
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        title: { display: true, text: "Effect Size (Cohen's d)" }
                    },
                    y: {
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            afterLabel: (ctx) => {
                                const details = [
                                    'AUC: 0.794 | OR: 3.06 | Top internal differentiator',
                                    'AUC: 0.775 | Strong statistical foundation',
                                    'AUC: 0.744 | Core hygiene skill',
                                    'AUC: 0.682 | Algorithmic proficiency',
                                    'AUC: 0.561 | Statistically non-significant for juniors (p=0.217)'
                                ];
                                return details[ctx.dataIndex];
                            }
                        }
                    }
                }
            }
        });
    }

    // --- Chart 3: Model Benchmarks ---
    const ctxBench = document.getElementById('chartModelBenchmarks');
    if (ctxBench) {
        new Chart(ctxBench, {
            type: 'bar',
            data: {
                labels: ['Baseline (Majority)', 'Decision Tree (d=3)', 'Random Forest', 'Logistic Regression'],
                datasets: [
                    {
                        label: 'SDS Senior Success (AUC)',
                        data: [0.500, 0.942, 0.996, 0.964],
                        backgroundColor: '#6366f1',
                        borderRadius: 6
                    },
                    {
                        label: 'JDS Salary Hike (AUC)',
                        data: [0.500, 0.800, 0.875, 0.903],
                        backgroundColor: '#06b6d4',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        min: 0.4,
                        max: 1.05,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        title: { display: true, text: 'Cross-Validated ROC-AUC' }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 12, padding: 16 }
                    }
                }
            }
        });
    }

    // --- Chart 4: Salary Premium by Role Family ---
    const ctxSalary = document.getElementById('chartSalaryPremium');
    if (ctxSalary) {
        new Chart(ctxSalary, {
            type: 'bar',
            data: {
                labels: ['Data Analyst', 'Business Analyst', 'Data Scientist', 'Data Engineer', 'Data Architect'],
                datasets: [
                    {
                        label: 'Junior / Mid Median (LPA)',
                        data: [5.0, 8.3, 12.85, 10.85, 0],
                        backgroundColor: 'rgba(99, 102, 241, 0.65)',
                        borderRadius: 6
                    },
                    {
                        label: 'Senior Median (LPA)',
                        data: [8.6, 13.0, 21.2, 17.6, 24.25],
                        backgroundColor: '#06b6d4',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        title: { display: true, text: 'Median Advertised Salary (₹ Lakhs/Year)' }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 12, padding: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: (ctx) => {
                                const premiums = ['+72.0% Senior Premium', '+56.6% Senior Premium', '+65.0% Senior Premium', '+62.2% Senior Premium', 'Senior Only Track (24.25 LPA)'];
                                return premiums[ctx.dataIndex];
                            }
                        }
                    }
                }
            }
        });
    }

    // --- Chart 5: Skill Demand Evolution Across Seniority ---
    const ctxDemand = document.getElementById('chartSkillDemand');
    if (ctxDemand) {
        new Chart(ctxDemand, {
            type: 'line',
            data: {
                labels: ['Junior (0-3 yrs)', 'Mid-Level (3-7 yrs)', 'Senior (7+ yrs)'],
                datasets: [
                    {
                        label: 'Big Data (+119.5% Surge)',
                        data: [7.7, 14.4, 16.9],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 3,
                        pointRadius: 5,
                        tension: 0.3
                    },
                    {
                        label: 'Coding Skills',
                        data: [28.0, 37.3, 34.5],
                        borderColor: '#10b981',
                        borderWidth: 2,
                        pointRadius: 4,
                        tension: 0.3
                    },
                    {
                        label: 'Math & Stats',
                        data: [19.4, 21.2, 21.9],
                        borderColor: '#6366f1',
                        borderWidth: 2,
                        pointRadius: 4,
                        tension: 0.3
                    },
                    {
                        label: 'AI & Machine Learning',
                        data: [14.4, 18.3, 17.0],
                        borderColor: '#a78bfa',
                        borderWidth: 2,
                        pointRadius: 4,
                        tension: 0.3
                    },
                    {
                        label: 'Storytelling (-35.8% Paradox)',
                        data: [10.6, 11.9, 6.8],
                        borderColor: '#06b6d4',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointRadius: 4,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        title: { display: true, text: 'Job Posting Mention Share (%)' }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 12, padding: 12, font: { size: 11 } }
                    }
                }
            }
        });
    }

    // --- Chart 6: Junior Clusters & Hike Rates ---
    const ctxClusters = document.getElementById('chartClusters');
    if (ctxClusters) {
        new Chart(ctxClusters, {
            type: 'bar',
            data: {
                labels: [
                    'Cluster 1: Balanced All-Rounders (n=78)',
                    'Cluster 2: ML-Only Specialists (n=38)',
                    'Cluster 0: Low Proficiency Profile (n=23)'
                ],
                datasets: [{
                    label: 'High Salary Hike Rate (%)',
                    data: [83.3, 18.4, 4.3],
                    backgroundColor: [
                        '#10b981',
                        '#ef4444',
                        '#64748b'
                    ],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        max: 100,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        title: { display: true, text: 'Salary Hike Probability (%)' }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            afterLabel: (ctx) => {
                                const desc = [
                                    'Math: 4.72, Code: 4.82, ML: 4.83, Story: 4.88 -> 83.3% success!',
                                    'ML: 4.84, but Code: 3.33, Story: 3.69 -> Stagnation (18.4%)',
                                    'Average across skills ~3.5 -> 4.3% success'
                                ];
                                return desc[ctx.dataIndex];
                            }
                        }
                    }
                }
            }
        });
    }
}

/* ==========================================================================
   5. ENGINE 1: PSYCHOMETRIC FIT ENGINE
   ========================================================================== */
let radarChartInstance = null;

function initEngine1Psychometrics() {
    // Slider values sync
    ['conscientiousness', 'openness', 'extraversion', 'neuroticism', 'agreeableness'].forEach(trait => {
        const slider = document.getElementById(trait);
        const valSpan = document.getElementById(`${trait}-val`);
        if (slider && valSpan) {
            slider.addEventListener('input', () => {
                valSpan.textContent = slider.value;
            });
        }
    });

    const btn = document.getElementById('btnPsychometric');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const c = parseFloat(document.getElementById('conscientiousness').value);
        const o = parseFloat(document.getElementById('openness').value);
        const e = parseFloat(document.getElementById('extraversion').value);
        const n = parseFloat(document.getElementById('neuroticism').value);
        const a = parseFloat(document.getElementById('agreeableness').value);

        // Empirical senior benchmarks from SDS (high performers):
        // C: 53.68, O: 48.49, E: 48.86, N: 36.13, A: 47.72
        // Normalization ranges (17 to 68)
        const cNorm = (c - 17) / (68 - 17);
        const oNorm = (o - 17) / (68 - 17);
        const eNorm = (e - 17) / (68 - 17);
        const aNorm = (a - 17) / (68 - 17);
        // For Neuroticism, moderate/low is optimal (~36 = 0.37 norm)
        const nDistance = Math.abs(n - 36.13) / (68 - 17);
        const nNorm = Math.max(0, 1 - nDistance);

        // Weights matching empirical logistic regression & Cohen's d:
        // C (0.30), O (0.29), E (0.19), N (0.12), A (0.10)
        const composite = (cNorm * 0.30 + oNorm * 0.29 + eNorm * 0.19 + nNorm * 0.12 + aNorm * 0.10) * 100;
        const finalScore = Math.min(99, Math.max(12, Math.round(composite)));

        // Display results
        const resDiv = document.getElementById('psychResults');
        resDiv.style.display = 'block';
        resDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Animate score counter
        animateValue(document.getElementById('fitScore'), 0, finalScore, 1000);

        // Animate SVG circle
        const circle = document.getElementById('scoreArc');
        if (circle) {
            const circumference = 534; // 2 * pi * 85
            const offset = circumference - (circumference * finalScore / 100);
            circle.style.transition = 'stroke-dashoffset 1.2s ease-out';
            circle.style.strokeDashoffset = offset;
        }

        // Breakdown items
        const breakdownDiv = document.getElementById('traitBreakdown');
        breakdownDiv.innerHTML = `
            <div class="breakdown-item">
                <span class="trait-name">Conscientiousness (Target: 54)</span>
                <span class="trait-contribution">${c >= 50 ? '✦ Optimal Leadership Match' : c >= 40 ? 'Moderate Alignment' : 'Development Need'} (${c}/68)</span>
            </div>
            <div class="breakdown-item">
                <span class="trait-name">Openness to Experience (Target: 48)</span>
                <span class="trait-contribution">${o >= 46 ? '✦ High Exploratory Capacity' : o >= 38 ? 'Acceptable Foundation' : 'Rigid Pattern Risk'} (${o}/68)</span>
            </div>
            <div class="breakdown-item">
                <span class="trait-name">Extraversion (Target: 49)</span>
                <span class="trait-contribution">${e >= 45 ? '✦ Executive Influence' : 'Collaborative Working'} (${e}/68)</span>
            </div>
            <div class="breakdown-item">
                <span class="trait-name">Emotional Stability (Target: ~36)</span>
                <span class="trait-contribution">${n <= 40 ? '✦ High Resilience' : 'Stress Sensitive'} (${n}/68)</span>
            </div>
            <div class="breakdown-item">
                <span class="trait-name">Agreeableness (Target: 48)</span>
                <span class="trait-contribution">${a >= 42 ? 'Team Harmonizer' : 'Independent Driver'} (${a}/68)</span>
            </div>
        `;

        // Qualitative interpretation
        const interpDiv = document.getElementById('fitInterpretation');
        let interpText = '';
        if (finalScore >= 80) {
            interpText = `<strong>High Senior Leadership Alignment:</strong> Your psychological profile mirrors the empirical archetype of senior data leaders (ROC-AUC 0.96). Your strong Conscientiousness (d=1.81) guarantees rigorous delivery, while elevated Openness (d=1.77) equips you for architectural innovation in ambiguous environments.`;
        } else if (finalScore >= 60) {
            interpText = `<strong>Mid-Tier Progression Potential:</strong> Strong execution capabilities. To reach senior executive tiers, focus behavioral growth on <em>Conscientiousness</em> (rigorous systematic governance) and <em>Openness</em> (proactive experimentation with unvetted algorithms and architecture).`;
        } else {
            interpText = `<strong>Execution Specialist Profile:</strong> Highly aligned with structured, individual-contributor technical workflows. Senior leadership roles require developing executive resilience and stakeholder orientation to overcome high-ambiguity delivery hurdles.`;
        }
        interpDiv.innerHTML = interpText;

        // Radar chart
        const ctxRadar = document.getElementById('chartRadar');
        if (ctxRadar) {
            if (radarChartInstance) radarChartInstance.destroy();
            radarChartInstance = new Chart(ctxRadar, {
                type: 'radar',
                data: {
                    labels: ['Conscientiousness', 'Openness', 'Extraversion', 'Agreeableness', 'Emotional Stability'],
                    datasets: [
                        {
                            label: 'Your Trait Profile',
                            data: [c, o, e, a, Math.max(17, 68 - n + 36)], // Invert neuroticism for visual clarity
                            backgroundColor: 'rgba(6, 182, 212, 0.25)',
                            borderColor: '#06b6d4',
                            pointBackgroundColor: '#06b6d4',
                            pointBorderColor: '#fff',
                            borderWidth: 2
                        },
                        {
                            label: 'Senior High-Performer Benchmark',
                            data: [53.7, 48.5, 48.9, 47.7, 52.0],
                            backgroundColor: 'rgba(99, 102, 241, 0.15)',
                            borderColor: '#6366f1',
                            pointBackgroundColor: '#6366f1',
                            pointBorderColor: '#fff',
                            borderWidth: 1.5,
                            borderDash: [4, 4]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            min: 15,
                            max: 68,
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            grid: { color: 'rgba(255, 255, 255, 0.08)' },
                            pointLabels: { color: '#9ca3c2', font: { size: 10 } },
                            ticks: { display: false }
                        }
                    },
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 10, padding: 10 } }
                    }
                }
            });
        }
    });
}

/* ==========================================================================
   6. ENGINE 2: STRATEGIC SKILLS RECOMMENDATION ENGINE
   ========================================================================== */
let quadrantChartInstance = null;

function initEngine2Skills() {
    ['skill_math', 'skill_coding', 'skill_ml', 'skill_storytelling', 'skill_bigdata'].forEach(id => {
        const slider = document.getElementById(id);
        const valSpan = document.getElementById(`${id}-val`);
        if (slider && valSpan) {
            slider.addEventListener('input', () => {
                valSpan.textContent = Number(slider.value).toFixed(1);
            });
        }
    });

    const btn = document.getElementById('btnSkills');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const math = parseFloat(document.getElementById('skill_math').value);
        const coding = parseFloat(document.getElementById('skill_coding').value);
        const ml = parseFloat(document.getElementById('skill_ml').value);
        const story = parseFloat(document.getElementById('skill_storytelling').value);
        const bigdata = parseFloat(document.getElementById('skill_bigdata').value);

        const resDiv = document.getElementById('skillResults');
        resDiv.style.display = 'block';
        resDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Strategic quadrant chart:
        // X = Market Demand Share (%), Y = Cohen's d Internal Promotion Effect
        const skillsMeta = [
            { name: 'Dashboard & Storytelling', demand: 7.1, d: 1.30, user: story, quad: 'Hidden Gem', color: '#06b6d4' },
            { name: 'Math & Statistics', demand: 12.8, d: 1.20, user: math, quad: 'Core Pillar', color: '#6366f1' },
            { name: 'Coding', demand: 24.0, d: 0.98, user: coding, quad: 'Core Pillar', color: '#10b981' },
            { name: 'AI & Machine Learning', demand: 7.6, d: 0.86, user: ml, quad: 'Specialized', color: '#a78bfa' },
            { name: 'Big Data Infrastructure', demand: 5.6, d: 0.22, user: bigdata, quad: 'Timing-Gated', color: '#f59e0b' }
        ];

        const ctxQuad = document.getElementById('chartQuadrant');
        if (ctxQuad) {
            if (quadrantChartInstance) quadrantChartInstance.destroy();
            quadrantChartInstance = new Chart(ctxQuad, {
                type: 'bubble',
                data: {
                    datasets: skillsMeta.map(s => ({
                        label: s.name,
                        data: [{ x: s.demand, y: s.d, r: Math.max(6, s.user * 4.5) }],
                        backgroundColor: s.color,
                        borderColor: '#fff',
                        borderWidth: 1
                    }))
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            min: 0,
                            max: 30,
                            title: { display: true, text: 'Market Demand Share in Postings (%)' },
                            grid: { color: 'rgba(255, 255, 255, 0.05)' }
                        },
                        y: {
                            min: 0,
                            max: 1.5,
                            title: { display: true, text: "Internal Promotion Effect Size (Cohen's d)" },
                            grid: { color: 'rgba(255, 255, 255, 0.05)' }
                        }
                    },
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 8, font: { size: 10 } } },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {
                                    const s = skillsMeta[ctx.datasetIndex];
                                    return `${s.name}: Effect d=${s.d}, Demand=${s.demand}%, Your Score=${s.user.toFixed(1)}/5.0`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Skill priority list & strategic classification
        const listDiv = document.getElementById('skillPriorityList');
        const sorted = [...skillsMeta].sort((a, b) => {
            // Gap weight: (5.0 - user) * Cohen's d
            const gapA = (5.0 - a.user) * a.d;
            const gapB = (5.0 - b.user) * b.d;
            return gapB - gapA;
        });

        listDiv.innerHTML = sorted.map((s, idx) => {
            let strategyClass = 'strategy-upskill';
            let strategyText = 'Priority Upskill';
            let advice = '';

            if (s.name.includes('Storytelling')) {
                strategyClass = s.user >= 4.2 ? 'strategy-maintain' : 'strategy-upskill';
                strategyText = s.user >= 4.2 ? 'Maintained Moat' : 'Hidden Gem Unlock';
                advice = 'High internal return (+2 Rank Gap). Focus on translating model metrics to executive P&L decisions.';
            } else if (s.name.includes('Big Data')) {
                strategyClass = 'strategy-defer';
                strategyText = 'Stage-Gated';
                advice = 'Low junior lift (d=0.22). Defer until Year 3+ when infrastructure complexity scales.';
            } else if (s.name.includes('AI & ML')) {
                strategyClass = s.user >= 4.0 ? 'strategy-maintain' : 'strategy-specialized';
                strategyText = s.user >= 4.0 ? 'Core Strength' : 'Algorithmic Depth';
                advice = 'Ensure coupled with coding foundations to avoid the 18.4% Specialization Trap.';
            } else {
                strategyClass = s.user >= 4.3 ? 'strategy-maintain' : 'strategy-upskill';
                strategyText = s.user >= 4.3 ? 'Mastered' : 'Core Foundation';
                advice = 'Essential prerequisite for any technical leadership advancement.';
            }

            return `
                <div class="skill-priority-item" style="border-left-color: ${s.color};">
                    <div class="priority-rank">#${idx + 1}</div>
                    <div class="priority-info">
                        <div class="skill-name">${s.name}</div>
                        <div class="skill-detail">${advice}</div>
                    </div>
                    <div class="priority-score">${s.user.toFixed(1)} / 5.0</div>
                    <span class="priority-strategy ${strategyClass}">${strategyText}</span>
                </div>
            `;
        }).join('');

        // Empirical cluster matching:
        // Cluster 0: [3.81, 3.64, 3.97, 3.23, 3.69] (Hike Rate: 4.3%)
        // Cluster 1: [3.83, 4.72, 4.82, 4.83, 4.88] (Hike Rate: 83.3%)
        // Cluster 2: [3.91, 3.81, 3.33, 4.84, 3.69] (Hike Rate: 18.4%)
        const userVector = [bigdata, math, coding, ml, story];
        const c0 = [3.81, 3.64, 3.97, 3.23, 3.69];
        const c1 = [3.83, 4.72, 4.82, 4.83, 4.88];
        const c2 = [3.91, 3.81, 3.33, 4.84, 3.69];

        const dist = (v1, v2) => Math.sqrt(v1.reduce((sum, val, i) => sum + Math.pow(val - v2[i], 2), 0));
        const d0 = dist(userVector, c0);
        const d1 = dist(userVector, c1);
        const d2 = dist(userVector, c2);

        let matchCluster = 1;
        let clusterName = 'Cluster 1: Balanced All-Rounder';
        let hikeRate = '83.3%';
        let badgeColor = '#10b981';
        let clusterDesc = 'Congratulations! Your profile closely mirrors the highest-performing balanced cluster. Balanced proficiency across Math, Coding, ML, and Storytelling yields maximum promotion velocity.';

        if (d2 < d1 && d2 < d0) {
            matchCluster = 2;
            clusterName = 'Cluster 2: ML-Only Specialist (Specialization Trap)';
            hikeRate = '18.4%';
            badgeColor = '#ef4444';
            clusterDesc = 'Warning: You are in danger of the "Specialization Trap". Deep ML skill without equivalent investment in software engineering and executive storytelling drastically impedes career progression.';
        } else if (d0 < d1 && d0 < d2) {
            matchCluster = 0;
            clusterName = 'Cluster 0: Developing Foundation';
            hikeRate = '4.3%';
            badgeColor = '#f59e0b';
            clusterDesc = 'Your skill proficiencies indicate an early-stage profile. Prioritize mastering Coding and Math fundamentals before branching into advanced algorithmic research.';
        }

        const matchDiv = document.getElementById('clusterMatch');
        matchDiv.style.border = `1px solid ${badgeColor}`;
        matchDiv.style.background = `rgba(15, 20, 40, 0.8)`;
        matchDiv.innerHTML = `
            <h4 style="color: ${badgeColor};">Empirical Archetype Match: ${clusterName}</h4>
            <p>${clusterDesc}</p>
            <div class="cluster-indicator" style="color: ${badgeColor};">
                <span>Predicted Promotion Hike Rate:</span>
                <strong>${hikeRate}</strong>
            </div>
        `;
    });
}

/* ==========================================================================
   7. ENGINE 3: PROGRESSION PATH OPTIMIZER
   ========================================================================== */
let salaryCurveChartInstance = null;

function initEngine3Progression() {
    const expSlider = document.getElementById('experience');
    const expVal = document.getElementById('experience-val');
    if (expSlider && expVal) {
        expSlider.addEventListener('input', () => {
            expVal.textContent = expSlider.value;
        });
    }

    const btn = document.getElementById('btnProgression');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const exp = parseFloat(document.getElementById('experience').value);
        const role = document.getElementById('roleFamily').value;

        const resDiv = document.getElementById('progressionResults');
        resDiv.style.display = 'block';
        resDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Role multiplier based on empirical market medians
        // Base: Salary = 7.20 + 5.30 * ln(exp + 1)
        const roleMultipliers = {
            data_analyst: 0.72,
            business_analyst: 0.85,
            data_scientist: 1.25,
            data_engineer: 1.12,
            data_architect: 1.55
        };
        const mult = roleMultipliers[role] || 1.0;

        function calcSalary(y) {
            return (7.20 + 5.30 * Math.log(y + 1)) * mult;
        }

        const currentSalary = calcSalary(exp);

        // Determine career stage
        let stageName = 'Junior Professional';
        let stageClass = 'stage-junior';
        let stageWindow = '0–3 Years';
        let stageMilestone = 'Master coding foundations & exploratory analysis. Deliver executive-ready storytelling.';

        if (exp >= 7) {
            stageName = 'Senior / Principal Leadership';
            stageClass = 'stage-senior';
            stageWindow = '7+ Years';
            stageMilestone = 'Architectural governance, cross-organizational strategy, and high Conscientiousness/Openness delivery.';
        } else if (exp >= 3) {
            stageName = 'Mid-Career Practitioner';
            stageClass = 'stage-mid';
            stageWindow = '3–7 Years';
            stageMilestone = 'Transition from single-node scripts to distributed pipelines. High-impact enterprise ownership.';
        }

        const stageDiv = document.getElementById('careerStage');
        stageDiv.innerHTML = `
            <div class="stage-badge ${stageClass}">${stageName}</div>
            <div class="stage-info">
                <div class="stage-title">${stageWindow} • Current Benchmark: ₹${currentSalary.toFixed(1)} LPA</div>
                <div class="stage-salary">${stageMilestone}</div>
            </div>
        `;

        // Salary Curve Chart
        const years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15];
        const salaries = years.map(y => Number(calcSalary(y).toFixed(1)));

        const ctxCurve = document.getElementById('chartSalaryCurve');
        if (ctxCurve) {
            if (salaryCurveChartInstance) salaryCurveChartInstance.destroy();
            salaryCurveChartInstance = new Chart(ctxCurve, {
                type: 'line',
                data: {
                    labels: years.map(y => `${y} yrs`),
                    datasets: [
                        {
                            label: `Projected Median Salary (LPA)`,
                            data: salaries,
                            borderColor: '#6366f1',
                            backgroundColor: 'rgba(99, 102, 241, 0.12)',
                            fill: true,
                            tension: 0.35,
                            borderWidth: 3,
                            pointRadius: years.map(y => y === Math.round(exp) ? 7 : 3),
                            pointBackgroundColor: years.map(y => y === Math.round(exp) ? '#06b6d4' : '#6366f1')
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                        y: {
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            title: { display: true, text: 'Advertised Salary (₹ LPA)' }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (ctx) => `Salary: ₹${ctx.parsed.y} LPA`
                            }
                        }
                    }
                }
            });
        }

        // Timeline items
        const timelineDiv = document.getElementById('progressionTimeline');
        timelineDiv.innerHTML = `
            <div class="timeline-item ${exp < 3 ? 'active-stage' : ''}">
                <div class="timeline-years">0–3 yrs</div>
                <div class="timeline-desc">
                    <strong>Foundational Execution:</strong> High velocity in Python/SQL + Math/Stats. Master executive presentations to capture the Storytelling Paradox premium.
                </div>
            </div>
            <div class="timeline-item ${exp >= 3 && exp < 7 ? 'active-stage' : ''}">
                <div class="timeline-years">3–7 yrs</div>
                <div class="timeline-desc">
                    <strong>Infrastructure Inflection:</strong> Big Data demand jumps +119.5%. Integrate Spark, cloud architectures, and production MLOps to prepare for senior promotion.
                </div>
            </div>
            <div class="timeline-item ${exp >= 7 ? 'active-stage' : ''}">
                <div class="timeline-years">7+ yrs</div>
                <div class="timeline-desc">
                    <strong>Enterprise Leadership:</strong> Individual skill premiums flatten (Bridge 3). Progression is powered by organizational ownership and leadership personality fit.
                </div>
            </div>
        `;

        // Skill sequencing recommendation
        const seqDiv = document.getElementById('skillSequence');
        let currentFocus = [];
        let nextFocus = [];
        let laterFocus = [];

        if (exp < 3) {
            currentFocus = ['Coding (Python/SQL)', 'Math & Statistics', 'Dashboard Storytelling'];
            nextFocus = ['Machine Learning Algorithms', 'Data Engineering Basics'];
            laterFocus = ['Distributed Big Data (Spark)', 'System Architecture'];
        } else if (exp < 7) {
            currentFocus = ['Distributed Systems (Spark/Cloud)', 'Production MLOps', 'Cross-functional Communication'];
            nextFocus = ['Architectural Governance', 'Team Mentorship'];
            laterFocus = ['Executive Roadmapping', 'Budgeting & P&L'];
        } else {
            currentFocus = ['Architectural Governance', 'Conscientious Delivery', 'Open Exploratory Strategy'];
            nextFocus = ['Organizational Influence', 'Enterprise Strategy'];
            laterFocus = ['Boardroom Advisory'];
        }

        seqDiv.innerHTML = `
            <h4>Stage-Gated Upskilling Focus:</h4>
            <div class="sequence-items">
                ${currentFocus.map(s => `<span class="seq-item seq-now">Current: ${s}</span>`).join('')}
                ${nextFocus.map(s => `<span class="seq-item seq-next">Next: ${s}</span>`).join('')}
                ${laterFocus.map(s => `<span class="seq-item seq-later">Later: ${s}</span>`).join('')}
            </div>
        `;
    });
}

/* ==========================================================================
   8. ENGINE 4: MULTI-ATTRIBUTE COMPANY MATCHING
   ========================================================================== */
let companyChartInstance = null;

function initEngine4Company() {
    const expSlider = document.getElementById('companyExp');
    const expVal = document.getElementById('companyExp-val');
    if (expSlider && expVal) {
        expSlider.addEventListener('input', () => {
            expVal.textContent = expSlider.value;
        });
    }

    const salSlider = document.getElementById('salaryPriority');
    const salVal = document.getElementById('salaryPriority-val');
    if (salSlider && salVal) {
        salSlider.addEventListener('input', () => {
            salVal.textContent = `${salSlider.value}%`;
        });
    }

    // Empirical top employers from dsj_core.csv
    const employers = [
        { name: 'Amazon', postings: 9, openings: 1279, medSal: 20.10, medExp: 2.0, minSal: 5.2, maxSal: 41.5 },
        { name: 'Deloitte', postings: 10, openings: 1714, medSal: 12.75, medExp: 2.5, minSal: 7.6, maxSal: 27.6 },
        { name: 'IBM', postings: 10, openings: 2480, medSal: 11.75, medExp: 3.0, minSal: 7.6, maxSal: 24.4 },
        { name: 'L&T Infotech', postings: 9, openings: 1873, medSal: 11.60, medExp: 2.0, minSal: 5.7, maxSal: 24.8 },
        { name: 'DXC Technology', postings: 10, openings: 1076, medSal: 11.00, medExp: 3.5, minSal: 5.4, maxSal: 19.8 },
        { name: 'Accenture', postings: 10, openings: 5425, medSal: 10.10, medExp: 2.5, minSal: 5.2, maxSal: 24.6 },
        { name: 'Evalueserve', postings: 3, openings: 1698, medSal: 9.80, medExp: 2.0, minSal: 6.5, maxSal: 12.5 },
        { name: 'HCL Technologies', postings: 10, openings: 1783, medSal: 9.40, medExp: 2.0, minSal: 4.5, maxSal: 23.1 },
        { name: 'Cognizant', postings: 10, openings: 3813, medSal: 9.20, medExp: 2.0, minSal: 5.5, maxSal: 19.6 },
        { name: 'Wipro', postings: 10, openings: 2566, medSal: 9.15, medExp: 2.0, minSal: 4.8, maxSal: 20.2 },
        { name: 'Infosys', postings: 10, openings: 1686, medSal: 9.10, medExp: 2.0, minSal: 5.5, maxSal: 19.8 },
        { name: 'Capgemini', postings: 10, openings: 1994, medSal: 8.85, medExp: 2.0, minSal: 4.6, maxSal: 22.6 },
        { name: 'Tech Mahindra', postings: 10, openings: 1830, medSal: 7.60, medExp: 2.0, minSal: 4.6, maxSal: 17.3 },
        { name: 'Genpact', postings: 8, openings: 2147, medSal: 7.40, medExp: 2.5, minSal: 4.7, maxSal: 26.1 },
        { name: 'TCS', postings: 10, openings: 9064, medSal: 7.30, medExp: 2.5, minSal: 4.7, maxSal: 19.9 }
    ];

    const btn = document.getElementById('btnCompany');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const userExp = parseFloat(document.getElementById('companyExp').value);
        const salWeight = parseFloat(document.getElementById('salaryPriority').value) / 100;
        const expWeight = 1 - salWeight;

        const resDiv = document.getElementById('companyResults');
        resDiv.style.display = 'block';
        resDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Scoring algorithm:
        // Experience Fit (Gaussian bell curve around median required exp)
        // Salary Score (normalized to max salary 20.1)
        // Liquidity Bonus (log openings)
        const scored = employers.map(emp => {
            const expDelta = Math.abs(userExp - emp.medExp);
            const expFit = Math.exp(-0.25 * expDelta * expDelta);
            const salFit = Math.min(1.0, emp.medSal / 20.10);
            const liquidity = Math.min(1.0, Math.log10(emp.openings) / 4.0);

            // Combined score
            const rawScore = (expFit * expWeight * 0.55) + (salFit * salWeight * 0.35) + (liquidity * 0.10);
            const matchPct = Math.min(99, Math.max(35, Math.round(rawScore * 100)));

            return {
                ...emp,
                matchPct,
                expFit,
                salFit
            };
        }).sort((a, b) => b.matchPct - a.matchPct);

        const topMatches = scored.slice(0, 6);

        // Render company list
        const listDiv = document.getElementById('companyList');
        listDiv.innerHTML = topMatches.map((c, idx) => `
            <div class="company-item">
                <div class="company-rank">#${idx + 1}</div>
                <div class="company-info">
                    <div class="company-name">${c.name}</div>
                    <div class="company-detail">${c.openings.toLocaleString()} Openings • Median ₹${c.medSal.toFixed(1)} LPA • Exp req: ~${c.medExp.toFixed(1)} yrs</div>
                </div>
                <div class="company-score">${c.matchPct}%</div>
            </div>
        `).join('');

        // Chart
        const ctxComp = document.getElementById('chartCompany');
        if (ctxComp) {
            if (companyChartInstance) companyChartInstance.destroy();
            companyChartInstance = new Chart(ctxComp, {
                type: 'bar',
                data: {
                    labels: topMatches.map(c => c.name),
                    datasets: [{
                        label: 'Match Compatibility Score (%)',
                        data: topMatches.map(c => c.matchPct),
                        backgroundColor: [
                            '#06b6d4',
                            '#6366f1',
                            '#10b981',
                            '#a78bfa',
                            '#3b82f6',
                            '#f59e0b'
                        ],
                        borderRadius: 6
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            min: 0,
                            max: 100,
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            title: { display: true, text: 'Multi-Attribute Compatibility (%)' }
                        },
                        y: { grid: { display: false } }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    });
}

/* ==========================================================================
   HELPER UTILITIES
   ========================================================================== */
function animateValue(obj, start, end, duration) {
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        obj.innerHTML = Math.floor(ease * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end;
        }
    };
    window.requestAnimationFrame(step);
}
