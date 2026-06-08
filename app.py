from flask import Flask, render_template, jsonify
import requests
import json

app = Flask(__name__)

# ── Portfolio Data ──────────────────────────────────────────────────────────

PROFILE = {
    "name": "Yash Donga",
    "title": "AI & ML Engineer",
    "subtitle": "Building Intelligent Systems | Python Developer | Data Scientist",
    "email": "dongayash864@gmail.com",
    "phone": "+91 6352151281",
    "github": "https://github.com/yash-dong025",
    "github_username": "yash-dong025",
    "linkedin": "https://linkedin.com/in/yash-donga-1b4041285",
    "location": "India",
    "bio": (
        "Passionate AI & ML engineer pursuing B.Tech in Artificial Intelligence "
        "and Machine Learning at CHARUSAT. I love building intelligent systems "
        "that solve real-world problems — from profit prediction engines to "
        "AI-powered travel planners. Currently exploring the intersection of "
        "machine learning, data science, and full-stack development."
    ),
}

SKILLS = {
    "Languages": [
        {"name": "Python", "level": 92},
        {"name": "C++", "level": 75},
        {"name": "C", "level": 72},
        {"name": "SQL", "level": 80},
    ],
    "Web Development": [
        {"name": "HTML / CSS", "level": 85},
        {"name": "Flask", "level": 88},
        {"name": "Streamlit", "level": 90},
    ],
    "AI & Machine Learning": [
        {"name": "Machine Learning", "level": 88},
        {"name": "Deep Learning", "level": 78},
        {"name": "Regression & Classification", "level": 90},
        {"name": "TensorFlow", "level": 72},
        {"name": "Scikit-learn", "level": 88},
    ],
    "Data & Visualization": [
        {"name": "NumPy / Pandas", "level": 92},
        {"name": "Matplotlib / Seaborn", "level": 85},
        {"name": "Tableau / Power BI", "level": 78},
    ],
    "Tools": [
        {"name": "Git", "level": 82},
        {"name": "Jupyter Notebook", "level": 90},
        {"name": "Google Colab", "level": 88},
        {"name": "Kaggle", "level": 80},
    ],
}

EXPERIENCE = [
    {
        "role": "Machine Learning Intern",
        "company": "Exposys Data Labs",
        "location": "Remote, India",
        "period": "May 2025 – June 2025",
        "icon": "fa-solid fa-brain",
        "color": "#7c3aed",
        "points": [
            "Developed a Profit Prediction System using Random Forest Regressor achieving high accuracy on real-world datasets.",
            "Built and deployed a Flask-based ML web app for real-time profit prediction with an intuitive UI.",
            "Preprocessed datasets with feature encoding and normalization techniques to significantly improve model performance.",
        ],
    }
]

PROJECTS = [
    {
        "title": "Car Price Prediction System",
        "date": "Aug 2025",
        "icon": "fa-solid fa-car",
        "color": "#06b6d4",
        "gradient": "linear-gradient(135deg, #0891b2, #7c3aed)",
        "description": (
            "A machine learning model to predict used car prices based on features "
            "such as brand, year, fuel type, transmission, and mileage."
        ),
        "tech": ["Python", "Scikit-learn", "Flask", "Streamlit", "Pandas"],
        "points": [
            "Performed data preprocessing, feature encoding, and outlier handling to improve prediction accuracy.",
            "Trained Linear Regression and Random Forest Regressor models using Scikit-learn.",
            "Built a user-friendly web interface for real-time car price estimation.",
        ],
        "github": "https://github.com/yash-dong025",
    },
    {
        "title": "Sentiment Analysis Dashboard",
        "date": "May 2025",
        "icon": "fa-solid fa-chart-bar",
        "color": "#10b981",
        "gradient": "linear-gradient(135deg, #059669, #0891b2)",
        "description": (
            "An interactive Power BI dashboard for customer sentiment visualization "
            "and strategic KPI tracking."
        ),
        "tech": ["Power BI", "Python", "NLP", "Data Analysis"],
        "points": [
            "Built an interactive dashboard in Power BI for customer sentiment visualization.",
            "Created KPIs, filters, and trends to aid strategic planning and business decisions.",
        ],
        "github": "https://github.com/yash-dong025",
    },
    {
        "title": "AI-Powered Travel Planning Agent",
        "date": "Jan 2026",
        "icon": "fa-solid fa-plane",
        "color": "#f59e0b",
        "gradient": "linear-gradient(135deg, #d97706, #dc2626)",
        "description": (
            "An intelligent itinerary generator leveraging OpenAI API, Streamlit, "
            "Google Maps, and Weather APIs for personalized travel planning."
        ),
        "tech": ["Python", "OpenAI API", "Streamlit", "Google Maps API", "Weather API"],
        "points": [
            "Developed an intelligent itinerary generator using OpenAI API and external APIs.",
            "Integrated Google Maps and Weather APIs for real-time location and forecast data.",
            "Generated day-wise travel plans, hotel recommendations, and automated packing lists.",
            "Enabled PDF export of personalized travel itineraries with a user-friendly interface.",
        ],
        "github": "https://github.com/yash-dong025/Real-Time-AI-Travel-Planner-master",
        "featured": True,
    },
]

EDUCATION = [
    {
        "degree": "Bachelor of Technology",
        "field": "Artificial Intelligence and Machine Learning",
        "minor": "Data Science and Machine Learning",
        "institution": "Charotar University of Science and Technology (CHARUSAT)",
        "period": "2023 – 2027",
        "status": "Ongoing",
        "icon": "fa-solid fa-graduation-cap",
    }
]

CERTIFICATIONS = [
    {
        "name": "Data Structures and Algorithms in Java",
        "issuer": "NPTEL",
        "icon": "fa-solid fa-trophy",
        "color": "#f59e0b",
        "url": "https://drive.google.com/file/d/1bumYvGqHkkaQqru1aAxGKe2aO9l4dvhw/view?usp=sharing",   # ← paste your NPTEL certificate link here
    },
    {
        "name": "Data Analysis using Python",
        "issuer": "Samatrix",
        "icon": "fa-solid fa-chart-line",
        "color": "#06b6d4",
        "url": "https://drive.google.com/file/d/1NPzz1A2JbaMJMAPw-MA2bKEGWkVx-dRI/view?usp=sharing",  # ← paste your Samatrix certificate link here
    },
    {
        "name": "Machine Learning with Python",
        "issuer": "IBM (Coursera)",
        "icon": "fa-solid fa-robot",
        "color": "#7c3aed",
        "url": "https://drive.google.com/file/d/17OFS6xsPPxw_XYJ-dftCUWeowXVs_-Mw/view?usp=sharing",  # ← paste your Coursera certificate link here
    },
    {
        "name": "Frontend Development with React",
        "issuer": "Packt (Coursera)",
        "icon": "fa-brands fa-react",
        "color": "#10b981",
        "url": "https://drive.google.com/file/d/1ZAh2RIE9w4rZEVCJtrLS9LZ7BfZwWxip/view?usp=sharing",  # ← paste your Coursera certificate link here
    },
]

STATS = [
    {"label": "Projects Built",  "value": "10+", "icon": "fa-solid fa-rocket"},
    {"label": "Certifications",   "value": "4",   "icon": "fa-solid fa-medal"},
    {"label": "Technologies",    "value": "15+", "icon": "fa-solid fa-bolt"},
    {"label": "GitHub Repos",    "value": "15+", "icon": "fa-brands fa-github"},
]

# ── Routes ──────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template(
        "index.html",
        profile=PROFILE,
        skills=SKILLS,
        experience=EXPERIENCE,
        projects=PROJECTS,
        education=EDUCATION,
        certifications=CERTIFICATIONS,
        stats=STATS,
    )


@app.route("/api/github-repos")
def github_repos():
    """Fetch GitHub repos dynamically via API."""
    username = PROFILE["github_username"]
    try:
        response = requests.get(
            f"https://api.github.com/users/{username}/repos",
            params={"per_page": 30, "sort": "updated"},
            headers={"Accept": "application/vnd.github+json"},
            timeout=8,
        )
        if response.status_code == 200:
            repos = response.json()
            # Filter and shape the data
            filtered = [
                {
                    "name": r["name"],
                    "description": r.get("description") or "No description provided.",
                    "url": r["html_url"],
                    "stars": r["stargazers_count"],
                    "forks": r["forks_count"],
                    "language": r.get("language") or "N/A",
                    "updated": r["updated_at"][:10],
                    "topics": r.get("topics", []),
                }
                for r in repos
                if not r["fork"]
            ]
            return jsonify({"success": True, "repos": filtered})
        else:
            return jsonify({"success": False, "repos": [], "error": "GitHub API error"}), 502
    except Exception as e:
        return jsonify({"success": False, "repos": [], "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
