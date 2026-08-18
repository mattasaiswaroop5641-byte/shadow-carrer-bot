from src.data.career_map import CAREER_MAP
from src.schemas import CareerRecommendation, ChatRequest, LearningMilestone, UserProfile
from src.services.nlp_extractor import extract_profile_entities, is_only_greeting


def score_careers(request: ChatRequest) -> tuple[list[CareerRecommendation], UserProfile, list[str]]:
    # Merge existing payload with NLP extraction from the new message
    existing = {
        "qualification": request.qualification,
        "skills": list(request.skills),
        "target_career": request.target_career or request.domain,
        "domain": request.domain or request.target_career,
        "interests": list(request.interests)
    }
    extracted_profile = extract_profile_entities(request.message, existing)
    
    user_profile = UserProfile(
        qualification=extracted_profile.get("qualification"),
        skills=extracted_profile.get("skills", []),
        target_career=extracted_profile.get("target_career"),
        domain=extracted_profile.get("domain"),
        interests=extracted_profile.get("interests", [])
    )

    if is_only_greeting(request.message) and not user_profile.skills and not user_profile.target_career and not user_profile.qualification:
        return [], user_profile, []

    user_skills_set = {s.lower() for s in user_profile.skills}
    target_career_name = (user_profile.target_career or "").strip().lower()
    user_qual = (user_profile.qualification or "").strip().lower()

    scored_careers: list[CareerRecommendation] = []
    seen_career_names = set()

    for career in CAREER_MAP:
        career_name = career["name"]
        if career_name in seen_career_names:
            continue

        matched_skills: list[str] = []
        missing_skills: list[str] = []
        why: list[str] = []
        score = 0

        # 1. Skill Matching
        total_career_skills = len(career["skills"])
        for skill in career["skills"]:
            if skill.lower() in user_skills_set or any(user_s in skill.lower() for user_s in user_skills_set):
                matched_skills.append(skill)
            else:
                missing_skills.append(skill)

        if matched_skills:
            skill_ratio = len(matched_skills) / max(total_career_skills, 1)
            score += int(skill_ratio * 50) + 15
            why.append(f"Matches your known skills: {', '.join(matched_skills[:3])}")

        # 2. Target Goal / Domain Matching
        career_aliases = [a.lower() for a in career.get("aliases", [])] + [career_name.lower()]
        is_target_hit = False
        if target_career_name:
            if any(alias in target_career_name or target_career_name in alias for alias in career_aliases):
                score += 35
                why.append(f"Aligns directly with your target goal: {career_name}")
                is_target_hit = True
            elif career.get("category", "").lower() in target_career_name:
                score += 20
                why.append(f"In your target domain: {career['category']}")

        # 3. Qualification Match
        qualifications = {q.lower() for q in career.get("qualifications", [])}
        if user_qual:
            if user_qual in qualifications or "any degree" in qualifications or "any" in qualifications:
                score += 15
                why.append(f"Matches your educational background: {user_profile.qualification}")

        # If user has no skills yet but set a target role, give base baseline score
        if not matched_skills and is_target_hit:
            score = max(score, 45)

        if score > 0:
            roadmaps = [
                LearningMilestone(phase=m["phase"], skills=m["skills"])
                for m in career.get("learning_roadmap", [])
            ]
            scored_careers.append(
                CareerRecommendation(
                    career=career_name,
                    category=career.get("category", "Software Engineering"),
                    score=min(score, 98),
                    matched_skills=matched_skills,
                    missing_skills=missing_skills,
                    why=why or ["Relevant path matching your profile"],
                    learning_roadmap=roadmaps
                )
            )
            seen_career_names.add(career_name)

    # Sort descending by score
    scored_careers.sort(key=lambda x: x.score, reverse=True)

    # Determine prioritized "What to learn next" for the top recommendation
    what_to_learn: list[str] = []
    if scored_careers:
        top_rec = scored_careers[0]
        what_to_learn = top_rec.missing_skills[:6]

    return scored_careers[:5], user_profile, what_to_learn
