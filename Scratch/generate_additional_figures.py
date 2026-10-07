"""
Generate additional figures and analysis tables for the enhanced submission.
These complement the existing DD_Foundation_Analysis outputs.
"""
import os, csv, math

OUT_DIR = 'figures'
os.makedirs(OUT_DIR, exist_ok=True)

# =============================================================================
# 1. Read the CSV tables we already have (no pandas dependency)
# =============================================================================
def read_csv_dict(path):
    with open(path, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

jds_effects = read_csv_dict('table_jds_effects.csv')
sds_effects = read_csv_dict('table_sds_effects.csv')
skill_premium = read_csv_dict('table_skill_salary_premium.csv')
dsj_premium = read_csv_dict('table_dsj_senior_premium.csv')
bridge_market = read_csv_dict('bridge_market_by_seniority.csv')
bridge_skill_demand = read_csv_dict('bridge_skill_demand_by_seniority.csv')
bridge_skill_align = read_csv_dict('bridge_skill_alignment.csv')
bridge_personality = read_csv_dict('bridge_personality_proxy.csv')

# Pretty name helper
def pretty(s):
    return s.replace('_', ' ').replace('skills', '').strip().title()

# =============================================================================
# 2. FIGURE: Cross-Validation Model Comparison (Bar Chart)
#    Data from the executed notebook outputs
# =============================================================================
try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    import matplotlib.patches as mpatches
    import numpy as np

    HAS_MPL = True
except ImportError:
    HAS_MPL = False
    print("matplotlib not available; will generate placeholder data files instead")

if HAS_MPL:
    plt.rcParams.update({
        'font.size': 10,
        'figure.dpi': 150,
        'savefig.bbox': 'tight',
        'savefig.pad_inches': 0.15,
    })

    # --- Figure: CV Model Benchmarks (JDS + SDS side by side) ---
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))

    jds_models = ['Baseline\n(majority)', 'Logistic\n(standardised)', 'Decision Tree\n(depth 3)', 'Random\nForest']
    jds_auc   = [0.500, 0.903, 0.800, 0.875]
    jds_auc_sd= [0.000, 0.053, 0.082, 0.059]
    jds_acc   = [0.525, 0.857, 0.782, 0.824]

    x = np.arange(len(jds_models))
    w = 0.35

    ax = axes[0]
    b1 = ax.bar(x - w/2, jds_auc, w, label='ROC-AUC', color='#2196F3', yerr=jds_auc_sd, capsize=3)
    b2 = ax.bar(x + w/2, jds_acc, w, label='Accuracy', color='#FF9800')
    ax.set_xticks(x)
    ax.set_xticklabels(jds_models, fontsize=8)
    ax.set_ylim(0, 1.1)
    ax.set_ylabel('Score')
    ax.set_title('JDS: Salary Hike Classification (N=139)\n5-Fold × 10 Repeats', fontweight='bold')
    ax.legend(loc='upper left', fontsize=8)
    ax.axhline(y=0.5, color='gray', linestyle='--', linewidth=0.8, alpha=0.5)
    for bar in b1:
        ax.annotate(f'{bar.get_height():.3f}', (bar.get_x() + bar.get_width()/2, bar.get_height()+0.02),
                    ha='center', va='bottom', fontsize=7)
    for bar in b2:
        ax.annotate(f'{bar.get_height():.3f}', (bar.get_x() + bar.get_width()/2, bar.get_height()+0.02),
                    ha='center', va='bottom', fontsize=7)

    sds_models = jds_models
    sds_auc   = [0.500, 0.964, 0.942, 0.996]
    sds_auc_sd= [0.000, 0.033, 0.039, 0.008]
    sds_acc   = [0.528, 0.927, 0.934, 0.949]

    ax = axes[1]
    b1 = ax.bar(x - w/2, sds_auc, w, label='ROC-AUC', color='#4CAF50', yerr=sds_auc_sd, capsize=3)
    b2 = ax.bar(x + w/2, sds_acc, w, label='Accuracy', color='#E91E63')
    ax.set_xticks(x)
    ax.set_xticklabels(sds_models, fontsize=8)
    ax.set_ylim(0, 1.1)
    ax.set_ylabel('Score')
    ax.set_title('SDS: Success Classification (N=161)\n5-Fold × 10 Repeats', fontweight='bold')
    ax.legend(loc='upper left', fontsize=8)
    ax.axhline(y=0.5, color='gray', linestyle='--', linewidth=0.8, alpha=0.5)
    for bar in b1:
        ax.annotate(f'{bar.get_height():.3f}', (bar.get_x() + bar.get_width()/2, bar.get_height()+0.02),
                    ha='center', va='bottom', fontsize=7)
    for bar in b2:
        ax.annotate(f'{bar.get_height():.3f}', (bar.get_x() + bar.get_width()/2, bar.get_height()+0.02),
                    ha='center', va='bottom', fontsize=7)

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, 'cv_model_benchmarks.png'))
    plt.close()
    print("Saved cv_model_benchmarks.png")

    # --- Figure: Salary Regression Model Comparison ---
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))

    dsj_reg_models = ['Baseline\n(mean)', 'Ridge', 'Gradient\nBoosting']
    dsj_r2  = [-0.002, 0.571, 0.552]
    dsj_mae = [0.487, 0.305, 0.311]

    ax = axes[0]
    x = np.arange(len(dsj_reg_models))
    b1 = ax.bar(x - w/2, dsj_r2, w, label='CV R²', color='#3F51B5')
    b2 = ax.bar(x + w/2, dsj_mae, w, label='CV MAE (log LPA)', color='#FF5722')
    ax.set_xticks(x)
    ax.set_xticklabels(dsj_reg_models, fontsize=9)
    ax.set_ylim(-0.1, 0.7)
    ax.set_ylabel('Score')
    ax.set_title('DataScience Jobs: Salary Model\n(target = log avg_salary_lpa)', fontweight='bold')
    ax.legend(fontsize=8)
    ax.axhline(y=0, color='gray', linestyle='--', linewidth=0.8, alpha=0.5)
    for bar in b1:
        ax.annotate(f'{bar.get_height():.3f}', (bar.get_x() + bar.get_width()/2, bar.get_height()+0.01),
                    ha='center', va='bottom', fontsize=8)
    for bar in b2:
        ax.annotate(f'{bar.get_height():.3f}', (bar.get_x() + bar.get_width()/2, bar.get_height()+0.01),
                    ha='center', va='bottom', fontsize=8)

    an_reg_models = dsj_reg_models
    an_r2  = [-0.001, 0.439, 0.444]
    an_mae = [6.972, 5.022, 4.989]

    ax = axes[1]
    b1 = ax.bar(x - w/2, an_r2, w, label='CV R²', color='#009688')
    b2_ax = ax.twinx()
    b2 = b2_ax.bar(x + w/2, an_mae, w, label='CV MAE (LPA)', color='#795548')
    ax.set_xticks(x)
    ax.set_xticklabels(an_reg_models, fontsize=9)
    ax.set_ylim(-0.1, 0.6)
    ax.set_ylabel('R²')
    b2_ax.set_ylabel('MAE (LPA)')
    b2_ax.set_ylim(0, 9)
    ax.set_title('Analytics Jobs: Salary Model\n(target = salary_mid LPA)', fontweight='bold')
    ax.legend(loc='upper left', fontsize=8)
    b2_ax.legend(loc='upper right', fontsize=8)
    ax.axhline(y=0, color='gray', linestyle='--', linewidth=0.8, alpha=0.5)

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, 'salary_regression_benchmarks.png'))
    plt.close()
    print("Saved salary_regression_benchmarks.png")

    # --- Figure: Permutation Importance (Side by side for DS Jobs + Analytics Jobs) ---
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))

    # DS Jobs
    dsj_feats = ['min_experience', 'role_family', 'log_jobs', 'is_senior_title', 'large_recruiter']
    dsj_imp   = [0.504, 0.435, 0.044, 0.018, 0.004]
    ax = axes[0]
    colors_dsj = ['#2196F3' if v > 0.1 else '#90CAF9' for v in dsj_imp]
    bars = ax.barh(dsj_feats[::-1], dsj_imp[::-1], color=colors_dsj[::-1], edgecolor='white')
    ax.set_xlabel('Permutation Importance (ΔR²)')
    ax.set_title('DS Jobs: Salary Drivers\n(Ridge, R²=0.571)', fontweight='bold')
    for bar, val in zip(bars, dsj_imp[::-1]):
        ax.text(bar.get_width() + 0.005, bar.get_y() + bar.get_height()/2, f'{val:.3f}',
                va='center', fontsize=9)

    # Analytics Jobs
    an_feats = ['exp_min_yrs', 'role_family', 'location_group', 'skill_ai_ml', 'n_skill_dims',
                'skill_math_stats', 'is_metro', 'skill_coding', 'skill_storytelling', 'skill_big_data']
    an_imp   = [0.798, 0.021, 0.014, 0.004, 0.004, 0.003, 0.001, 0.000, 0.000, -0.000]
    ax = axes[1]
    colors_an = ['#4CAF50' if v > 0.01 else '#C8E6C9' for v in an_imp]
    bars = ax.barh(an_feats[::-1], an_imp[::-1], color=colors_an[::-1], edgecolor='white')
    ax.set_xlabel('Permutation Importance (ΔR²)')
    ax.set_title('Analytics Jobs: Salary Drivers\n(Gradient Boosting, R²=0.444)', fontweight='bold')
    for bar, val in zip(bars, an_imp[::-1]):
        ax.text(max(bar.get_width(), 0) + 0.005, bar.get_y() + bar.get_height()/2, f'{val:.3f}',
                va='center', fontsize=8)

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, 'salary_permutation_importance.png'))
    plt.close()
    print("Saved salary_permutation_importance.png")

    # --- Figure: Senior Salary Premium by Role Family ---
    roles = []
    jr_sal = []
    sr_sal = []
    premium_pct = []
    for row in dsj_premium:
        rf = row['role_family']
        j = row['Junior/Mid']
        s = row['Senior']
        p = row['senior_premium_pct']
        if j and s and p:
            roles.append(rf)
            jr_sal.append(float(j))
            sr_sal.append(float(s))
            premium_pct.append(float(p))

    fig, ax = plt.subplots(figsize=(10, 5))
    x = np.arange(len(roles))
    w = 0.35
    b1 = ax.bar(x - w/2, jr_sal, w, label='Junior/Mid Median', color='#64B5F6', edgecolor='white')
    b2 = ax.bar(x + w/2, sr_sal, w, label='Senior Median', color='#1565C0', edgecolor='white')
    ax.set_xticks(x)
    ax.set_xticklabels(roles, fontsize=9)
    ax.set_ylabel('Median Salary (LPA)')
    ax.set_title('Seniority Salary Premium by Role Family', fontweight='bold', fontsize=13)
    ax.legend()

    for i, pct in enumerate(premium_pct):
        max_h = max(jr_sal[i], sr_sal[i])
        ax.annotate(f'+{pct:.0f}%', (x[i], max_h + 0.5), ha='center', fontsize=9, fontweight='bold', color='#D32F2F')

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, 'seniority_salary_premium.png'))
    plt.close()
    print("Saved seniority_salary_premium.png")

    # --- Figure: JDS Cluster Profile Heatmap ---
    cluster_data = {
        'Cluster 0\n(Low, n=23)': [3.81, 3.64, 3.97, 3.23, 3.69],
        'Cluster 1\n(Balanced, n=78)': [3.83, 4.72, 4.82, 4.83, 4.88],
        'Cluster 2\n(ML-Only, n=38)': [3.91, 3.81, 3.33, 4.84, 3.69],
    }
    cluster_hike = [4.3, 83.3, 18.4]
    skill_labels = ['Big Data', 'Math/Stats', 'Coding', 'AI/ML', 'Storytelling']

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4.5), gridspec_kw={'width_ratios': [3, 1]})

    data_matrix = np.array(list(cluster_data.values()))
    im = ax1.imshow(data_matrix, cmap='YlOrRd', aspect='auto', vmin=3.0, vmax=5.0)
    ax1.set_xticks(np.arange(len(skill_labels)))
    ax1.set_xticklabels(skill_labels, fontsize=9)
    ax1.set_yticks(np.arange(len(cluster_data)))
    ax1.set_yticklabels(list(cluster_data.keys()), fontsize=9)
    ax1.set_title('JDS Cluster Mean Skill Profiles', fontweight='bold')

    for i in range(data_matrix.shape[0]):
        for j in range(data_matrix.shape[1]):
            color = 'white' if data_matrix[i, j] > 4.3 else 'black'
            ax1.text(j, i, f'{data_matrix[i,j]:.2f}', ha='center', va='center', fontsize=10, color=color)

    cbar = plt.colorbar(im, ax=ax1, fraction=0.046, pad=0.04)
    cbar.set_label('Mean Score (1-5)')

    colors_hike = ['#EF5350', '#66BB6A', '#FFA726']
    bars = ax2.barh(list(cluster_data.keys()), cluster_hike, color=colors_hike, edgecolor='white')
    ax2.set_xlabel('% High Hike')
    ax2.set_title('Promotion Rate', fontweight='bold')
    ax2.set_xlim(0, 100)
    for bar, val in zip(bars, cluster_hike):
        ax2.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2, f'{val:.1f}%',
                 va='center', fontsize=10, fontweight='bold')

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, 'jds_cluster_profiles.png'))
    plt.close()
    print("Saved jds_cluster_profiles.png")

    # --- Figure: Big Data Demand Inflection across Seniority ---
    skills_to_plot = {
        'Coding':        [0.280, 0.373, 0.345],
        'Math/Stats':    [0.194, 0.212, 0.219],
        'AI/ML':         [0.144, 0.183, 0.170],
        'Dashboard':     [0.106, 0.119, 0.068],
        'Big Data':      [0.077, 0.144, 0.169],
    }
    seniority_levels = ['Junior', 'Mid', 'Senior']
    colors_skills = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#F44336']

    fig, ax = plt.subplots(figsize=(9, 5))
    for (skill, vals), color in zip(skills_to_plot.items(), colors_skills):
        lw = 3.0 if skill == 'Big Data' else 1.5
        ls = '-' if skill == 'Big Data' else '--'
        marker = 'o' if skill == 'Big Data' else 's'
        ax.plot(seniority_levels, [v*100 for v in vals], marker=marker, linewidth=lw, linestyle=ls,
                color=color, label=skill, markersize=8)

    ax.set_ylabel('Demand Rate (% of Core Data Postings)')
    ax.set_title('Skill Demand Evolution Across Seniority\n(Big Data triples from Junior to Senior)', fontweight='bold')
    ax.legend(loc='upper left', framealpha=0.9)
    ax.set_ylim(0, 42)
    ax.grid(axis='y', alpha=0.3)

    # Annotate the Big Data inflection
    ax.annotate('Big Data\n+119% growth', xy=(2, 16.9), xytext=(1.5, 28),
                arrowprops=dict(arrowstyle='->', color='#F44336', lw=2),
                fontsize=10, fontweight='bold', color='#F44336')

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, 'skill_demand_evolution.png'))
    plt.close()
    print("Saved skill_demand_evolution.png")

    # --- Figure: Sensitivity Analysis (Logistic AUC with/without flagged rows) ---
    fig, ax = plt.subplots(figsize=(8, 4))
    datasets = ['JDS\n(N=139 → 113)', 'SDS\n(N=161 → 143)']
    auc_all     = [0.903, 0.964]
    auc_cleaned = [0.875, 0.955]

    x = np.arange(len(datasets))
    w = 0.3
    b1 = ax.bar(x - w/2, auc_all, w, label='All rows', color='#42A5F5', edgecolor='white')
    b2 = ax.bar(x + w/2, auc_cleaned, w, label='Excl. flagged rows', color='#EF5350', edgecolor='white')
    ax.set_xticks(x)
    ax.set_xticklabels(datasets, fontsize=10)
    ax.set_ylabel('Logistic Regression CV ROC-AUC')
    ax.set_title('Sensitivity Analysis: Robustness to Data Quality Flags', fontweight='bold')
    ax.set_ylim(0.8, 1.0)
    ax.legend(fontsize=9)
    for bar in b1:
        ax.annotate(f'{bar.get_height():.3f}', (bar.get_x() + bar.get_width()/2, bar.get_height()+0.003),
                    ha='center', fontsize=10, fontweight='bold')
    for bar in b2:
        ax.annotate(f'{bar.get_height():.3f}', (bar.get_x() + bar.get_width()/2, bar.get_height()+0.003),
                    ha='center', fontsize=10, fontweight='bold')

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, 'sensitivity_analysis.png'))
    plt.close()
    print("Saved sensitivity_analysis.png")

    # --- Figure: Logistic Regression Coefficients (Odds Ratios) ---
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))

    # JDS Logistic Coefficients
    jds_feat_names = ['Math/Stats', 'Storytelling', 'AI/ML', 'Big Data', 'Coding']
    jds_odds = [3.612, 3.057, 2.143, 1.980, 1.704]

    ax = axes[0]
    colors_jds = ['#1565C0' if o > 2.5 else '#64B5F6' for o in jds_odds]
    bars = ax.barh(jds_feat_names[::-1], jds_odds[::-1], color=colors_jds[::-1], edgecolor='white')
    ax.axvline(x=1.0, color='gray', linestyle='--', linewidth=0.8, alpha=0.7)
    ax.set_xlabel('Odds Ratio per 1 SD')
    ax.set_title('JDS: Logistic Regression\nOdds Ratios (per 1 SD)', fontweight='bold')
    for bar, val in zip(bars, jds_odds[::-1]):
        ax.text(bar.get_width() + 0.05, bar.get_y() + bar.get_height()/2, f'{val:.2f}×',
                va='center', fontsize=10, fontweight='bold')

    # SDS Logistic Coefficients
    sds_feat_names = ['Conscientiousness', 'Openness', 'Extraversion', 'Neuroticism', 'Agreeableness']
    sds_odds = [8.114, 7.717, 2.595, 2.222, 1.873]

    ax = axes[1]
    colors_sds = ['#2E7D32' if o > 3.0 else '#A5D6A7' for o in sds_odds]
    bars = ax.barh(sds_feat_names[::-1], sds_odds[::-1], color=colors_sds[::-1], edgecolor='white')
    ax.axvline(x=1.0, color='gray', linestyle='--', linewidth=0.8, alpha=0.7)
    ax.set_xlabel('Odds Ratio per 1 SD')
    ax.set_title('SDS: Logistic Regression\nOdds Ratios (per 1 SD)', fontweight='bold')
    for bar, val in zip(bars, sds_odds[::-1]):
        ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2, f'{val:.2f}×',
                va='center', fontsize=10, fontweight='bold')

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, 'logistic_odds_ratios.png'))
    plt.close()
    print("Saved logistic_odds_ratios.png")

    # --- Figure: Prototype System Architecture ---
    fig, ax = plt.subplots(figsize=(12, 7))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis('off')
    ax.set_title('Career Navigation System: Analytical Engine Architecture', fontweight='bold', fontsize=14, pad=20)

    # Input layer
    input_boxes = [
        (0.5, 6.5, 'User Profile\n(Role, Experience)'),
        (0.5, 5.0, 'Big Five\nSelf-Assessment'),
        (0.5, 3.5, 'Skill Ratings\n(1-5 Scale)'),
    ]
    for x, y, label in input_boxes:
        rect = mpatches.FancyBboxPatch((x, y), 2.2, 1.0, boxstyle="round,pad=0.1",
                                        facecolor='#E3F2FD', edgecolor='#1565C0', linewidth=2)
        ax.add_patch(rect)
        ax.text(x+1.1, y+0.5, label, ha='center', va='center', fontsize=8, fontweight='bold')

    # Engine layer
    engines = [
        (4.0, 6.5, 'Engine 1:\nRole Track\nNorming', '#FFF9C4', '#F57F17'),
        (4.0, 5.0, 'Engine 2:\nPsychometric\nFit (d-weights)', '#E8F5E9', '#2E7D32'),
        (4.0, 3.5, 'Engine 3:\nSkills Quadrant\n(Rank Gap)', '#FCE4EC', '#C62828'),
        (4.0, 2.0, 'Engine 4:\nCompany Match\n(ExpFit×Salary)', '#E8EAF6', '#283593'),
    ]
    for x, y, label, fc, ec in engines:
        rect = mpatches.FancyBboxPatch((x, y), 2.5, 1.0, boxstyle="round,pad=0.1",
                                        facecolor=fc, edgecolor=ec, linewidth=2)
        ax.add_patch(rect)
        ax.text(x+1.25, y+0.5, label, ha='center', va='center', fontsize=7, fontweight='bold')

    # Data sources
    data_sources = [
        (7.8, 6.5, 'SDS Effects\n(d=1.81, AUC=0.88)', '#C8E6C9'),
        (7.8, 5.0, 'JDS Effects\n(d=1.30, AUC=0.79)', '#BBDEFB'),
        (7.8, 3.5, 'Market Bridge\n(14,749 postings)', '#FFE0B2'),
        (7.8, 2.0, 'DSJ Core\n(1,595 postings)', '#D1C4E9'),
    ]
    for x, y, label, fc in data_sources:
        rect = mpatches.FancyBboxPatch((x, y), 2.5, 1.0, boxstyle="round,pad=0.1",
                                        facecolor=fc, edgecolor='#616161', linewidth=1.5)
        ax.add_patch(rect)
        ax.text(x+1.25, y+0.5, label, ha='center', va='center', fontsize=7)

    # Output layer
    outputs = [
        (4.0, 0.3, 'Fit Score\n0-100', '#A5D6A7'),
        (6.0, 0.3, 'Skill Path\nPriority List', '#90CAF9'),
        (8.0, 0.3, 'Company\nRankings', '#CE93D8'),
    ]
    for x, y, label, fc in outputs:
        rect = mpatches.FancyBboxPatch((x, y), 1.8, 0.9, boxstyle="round,pad=0.1",
                                        facecolor=fc, edgecolor='#424242', linewidth=2)
        ax.add_patch(rect)
        ax.text(x+0.9, y+0.45, label, ha='center', va='center', fontsize=8, fontweight='bold')

    # Arrows: inputs -> engines
    for sy in [7.0, 5.5, 4.0]:
        ax.annotate('', xy=(4.0, sy-0.3), xytext=(2.7, sy),
                    arrowprops=dict(arrowstyle='->', color='#455A64', lw=1.5))

    # Arrows: data -> engines
    for sy in [7.0, 5.5, 4.0, 2.5]:
        ax.annotate('', xy=(6.5, sy-0.3), xytext=(7.8, sy),
                    arrowprops=dict(arrowstyle='->', color='#455A64', lw=1.5))

    # Arrows: engines -> outputs
    ax.annotate('', xy=(5.0, 1.2), xytext=(5.0, 2.0),
                arrowprops=dict(arrowstyle='->', color='#1B5E20', lw=2))
    ax.annotate('', xy=(6.9, 1.2), xytext=(6.5, 2.0),
                arrowprops=dict(arrowstyle='->', color='#0D47A1', lw=2))
    ax.annotate('', xy=(8.9, 1.2), xytext=(6.5, 2.5),
                arrowprops=dict(arrowstyle='->', color='#4A148C', lw=2))

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, 'prototype_architecture.png'))
    plt.close()
    print("Saved prototype_architecture.png")

    print("\n=== All additional figures generated successfully ===")
    print(f"Total files in {OUT_DIR}/:", len(os.listdir(OUT_DIR)))

else:
    print("Skipping figure generation (matplotlib not installed).")
    print("Install with: pip install matplotlib numpy")
