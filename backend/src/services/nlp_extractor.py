import re

# Comprehensive list of standard skills and variations
SKILL_SYNONYMS: dict[str, list[str]] = {
    "Python": ["python", "py", "python3"],
    "Java": ["java", "core java", "advance java"],
    "C++": ["c++", "cpp"],
    "C": [" c ", "c language", "c programming"],
    "C#": ["c#", "csharp", ".net", "dotnet"],
    "JavaScript": ["javascript", "js", "ecmascript"],
    "TypeScript": ["typescript", "ts"],
    "React": ["react", "reactjs", "react.js"],
    "Node.js": ["node", "nodejs", "node.js", "express", "expressjs"],
    "HTML": ["html", "html5"],
    "CSS": ["css", "css3", "tailwind", "bootstrap", "sass"],
    "SQL": ["sql", "mysql", "postgres", "postgresql", "oracle", "sqlite", "database", "databases"],
    "MongoDB": ["mongodb", "mongo", "nosql"],
    "Redis": ["redis"],
    "Git": ["git", "github", "gitlab"],
    "Docker": ["docker", "containerization"],
    "Kubernetes": ["kubernetes", "k8s"],
    "AWS": ["aws", "amazon web services", "cloud"],
    "Azure": ["azure", "microsoft azure"],
    "Linux": ["linux", "unix", "bash", "shell scripting", "shell"],
    "Selenium": ["selenium", "webdriver"],
    "Playwright": ["playwright"],
    "Cypress": ["cypress"],
    "Manual Testing": ["manual testing", "test cases", "bug reporting", "jira", "black box testing", "qa testing"],
    "API Testing": ["api testing", "postman", "rest assured"],
    "Figma": ["figma", "wireframing", "prototyping"],
    "Excel": ["excel", "advanced excel", "spreadsheets", "vlookup"],
    "Power BI": ["power bi", "powerbi"],
    "Tableau": ["tableau"],
    "Statistics": ["statistics", "probability", "stats", "math"],
    "Machine Learning": ["machine learning", "ml", "scikit-learn", "sklearn"],
    "Deep Learning": ["deep learning", "dl", "neural networks", "cnn", "rnn"],
    "PyTorch": ["pytorch", "torch"],
    "TensorFlow": ["tensorflow", "keras"],
    "Pandas": ["pandas", "numpy"],
    "Networking": ["networking", "network", "tcp/ip", "osi model", "routing", "switching"],
    "Cryptography": ["cryptography", "encryption", "hashing"],
    "Ethical Hacking": ["ethical hacking", "penetration testing", "pen testing", "kali linux"],
    "SIEM (Splunk)": ["splunk", "siem", "soc"],
    "Wireshark": ["wireshark", "packet analysis"],
    "Security": ["security", "cybersecurity", "infosec", "vulnerability scanning"]
}

# Domain & Goal mapping
GOAL_KEYWORDS: dict[str, list[str]] = {
    "Full Stack Developer": ["full stack", "fullstack", "full stack dev", "full stack developer", "web developer", "web development", "full stack web"],
    "Backend Developer": ["backend", "back end", "backend dev", "backend developer", "server side", "api developer"],
    "Frontend Developer": ["frontend", "front end", "frontend dev", "frontend developer", "ui developer", "react developer"],
    "QA / Automation Tester": ["tester", "testing", "software tester", "qa", "qa engineer", "automation tester", "test automation", "quality assurance", "manual tester"],
    "Data Analyst": ["data analyst", "data analytics", "business data analyst", "bi analyst"],
    "Data Scientist": ["data scientist", "data science", "ds"],
    "AI/ML Engineer": ["ai engineer", "ml engineer", "ai/ml engineer", "machine learning engineer", "ai developer", "artificial intelligence"],
    "Cybersecurity Analyst": ["cybersecurity", "security", "cyber security analyst", "ethical hacker", "soc analyst", "cyber analyst", "infosec"],
    "Cloud & DevOps Engineer": ["cloud engineer", "devops", "devops engineer", "cloud architect", "sre", "aws engineer"],
    "UI/UX Designer": ["ui/ux", "ui ux", "ux designer", "ui designer", "product designer", "design", "designer"]
}

GREETINGS = {"hi", "hello", "hey", "hola", "greetings", "good morning", "good evening", "good afternoon", "gm", "gn"}

QUALIFICATION_REGEX = re.compile(
    r'\b(mca|bca|b\.?\s*tech|b\.?\s*e(?![a-z])|bsc|msc|mba|bcom|bba|m\.?\s*tech|diploma|bachelor(?:\'s)?|master(?:\'s)?)\b',
    re.IGNORECASE
)


def clean_text(text: str) -> str:
    return " " + text.lower().strip() + " "


def is_only_greeting(message: str) -> bool:
    cleaned = re.sub(r'[^\w\s]', '', message.lower()).strip()
    return cleaned in GREETINGS or cleaned in {"hi there", "hello bot", "hey bot", "hi bot"}


def extract_qualification(text: str) -> str | None:
    # Check for degrees with word boundary, explicitly avoiding English verb "to be"
    # Negative lookbehind to ensure it's not "to be", "will be", "should be", "would be", "could be", "can be"
    if re.search(r'\b(want to be|to be|will be|can be|should be|must be|gonna be)\b', text, re.IGNORECASE):
        # Strip out the auxiliary verb phrase before searching for qualification
        subbed = re.sub(r'\b(want to be|to be|will be|can be|should be|must be|gonna be)\b', '', text, flags=re.IGNORECASE)
        match = QUALIFICATION_REGEX.search(subbed)
        if match:
            raw = match.group(1).upper().replace(".", "").replace(" ", "")
            return raw
        return None

    match = QUALIFICATION_REGEX.search(text)
    if match:
        raw = match.group(1).upper().replace(".", "").replace(" ", "")
        # If it matched "BE" without periods, verify it's not used as a common verb in context
        if raw == "BE":
            if not re.search(r'\b(in be|doing be|studying be|completed be|be degree|b\.e)\b', text, re.IGNORECASE):
                return None
        return raw
    return None


def extract_skills(text: str) -> list[str]:
    found_skills: set[str] = set()
    cleaned = clean_text(text)

    # Detect skills via patterns like "ik X and Y", "my skills are X", "i know X"
    for canonical_name, variations in SKILL_SYNONYMS.items():
        for var in variations:
            pattern = r'(?:\b|_)' + re.escape(var) + r'(?:\b|_)'
            if re.search(pattern, cleaned):
                found_skills.add(canonical_name)
                break

    return sorted(list(found_skills))


def extract_target_career(text: str) -> str | None:
    cleaned = clean_text(text)

    # Check explicit patterns like "want to become a X", "want to be a X", "interested in X", "target is X"
    for role_name, aliases in GOAL_KEYWORDS.items():
        for alias in aliases:
            # Word boundary search
            pattern = r'\b' + re.escape(alias) + r'\b'
            if re.search(pattern, cleaned):
                return role_name

    return None


def extract_profile_entities(message: str, existing_profile: dict | None = None) -> dict:
    profile = existing_profile.copy() if existing_profile else {
        "qualification": None,
        "skills": [],
        "target_career": None,
        "domain": None,
        "interests": []
    }

    if is_only_greeting(message):
        return profile

    # Extract Qualification
    new_qual = extract_qualification(message)
    if new_qual:
        profile["qualification"] = new_qual

    # Extract Skills and merge uniquely
    new_skills = extract_skills(message)
    if new_skills:
        current_skills = set(profile.get("skills", []))
        current_skills.update(new_skills)
        profile["skills"] = sorted(list(current_skills))

    # Extract Target Career / Domain
    new_target = extract_target_career(message)
    if new_target:
        profile["target_career"] = new_target
        profile["domain"] = new_target

    # Extract Interests
    interests = []
    if "testing" in message.lower():
        interests.append("testing")
    if "coding" in message.lower() or "development" in message.lower():
        interests.append("coding")
    if "security" in message.lower() or "cyber" in message.lower():
        interests.append("security")
    if "design" in message.lower() or "ui" in message.lower():
        interests.append("design")
    if "data" in message.lower() or "analytics" in message.lower():
        interests.append("data")

    if interests:
        current_interests = set(profile.get("interests", []))
        current_interests.update(interests)
        profile["interests"] = sorted(list(current_interests))

    return profile
