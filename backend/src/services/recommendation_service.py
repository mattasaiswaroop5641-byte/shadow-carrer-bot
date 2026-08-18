from src.schemas import ChatRequest, ChatResponse
from src.services.career_matcher import score_careers
from src.services.graph_service import build_graph
from src.services.groq_service import generate_groq_reply
from src.services.nlp_extractor import is_only_greeting


def generate_smart_fallback(
    request: ChatRequest,
    user_profile,
    recommendations,
    what_to_learn: list[str]
) -> str:
    msg_lower = request.message.lower().strip()

    # 1. Greeting only
    if is_only_greeting(request.message):
        return (
            "👋 **Hello! I'm your AI Career Guidance Assistant.**\n\n"
            "Tell me about your background and goals! For example:\n"
            "- *'I am doing MCA and want to know my career options'*\n"
            "- *'I know Python and Java and want to become a Full Stack Developer'*\n"
            "- *'I want to get into QA / Software Testing'*"
        )

    # 2. User provided known skills & target goal (e.g. "ik py and java coding and i want to become a full stack dev")
    if user_profile.target_career and user_profile.skills:
        top_career = recommendations[0] if recommendations else None
        career_name = user_profile.target_career
        known = ", ".join(user_profile.skills)
        missing_text = "\n".join([f"- **{skill}**" for skill in what_to_learn[:5]])

        return (
            f"🎯 **Target Career Path: {career_name}**\n\n"
            f"✅ **Your Existing Strengths ({known}):**\n"
            f"Having mastery in {known} gives you a solid foundation in core programming logic, algorithms, and backend structures.\n\n"
            f"📚 **What You Need to Learn Next to Bridge the Gap:**\n"
            f"{missing_text}\n\n"
            f"💡 **Recommended 3-Step Strategy:**\n"
            f"1. **Modern UI Layer**: Learn HTML5/CSS3 and modern JavaScript (ES6+) to build responsive interfaces.\n"
            f"2. **Component Architecture**: Master **React** and state management to connect frontend components with your backend.\n"
            f"3. **Full Stack Integration**: Build end-to-end projects with RESTful APIs, SQL databases, and deploy them on the cloud."
        )

    # 3. User provided known skills without specific target
    if user_profile.skills and not user_profile.target_career:
        top_career = recommendations[0].career if recommendations else "Software Developer"
        matched_str = ", ".join(user_profile.skills)
        top_options = ", ".join([r.career for r in recommendations[:3]])
        return (
            f"⚡ **Great Skill Set! You have:** *{matched_str}*\n\n"
            f"Based on your skillset, the top career tracks with the highest market demand are:\n"
            f"1. **{top_career}** (Best Match)\n"
            f"2. **{recommendations[1].career if len(recommendations) > 1 else 'Backend Developer'}**\n\n"
            f"Which of these areas excites you most? Let me know so we can customize your step-by-step roadmap!"
        )

    # 4. User shared qualification/degree (e.g. "well im doing mca")
    if user_profile.qualification and not user_profile.skills and not user_profile.target_career:
        qual = user_profile.qualification
        return (
            f"🎓 **Great! With an {qual} degree, you have strong opportunities in tech.**\n\n"
            f"Top paths to explore:\n"
            f"- **Software / Full Stack Development** (High Demand)\n"
            f"- **Data Analytics & AI/ML**\n"
            f"- **QA & Automation Testing**\n"
            f"- **Cloud & Cybersecurity**\n\n"
            f"What specific programming languages (e.g., Python, Java, JavaScript, SQL) do you already know or enjoy?"
        )

    # 5. User expressed target role only (e.g. "i want to be a tester")
    if user_profile.target_career:
        career = recommendations[0] if recommendations else None
        career_name = user_profile.target_career
        missing_text = "\n".join([f"- **{s}**" for s in (career.missing_skills[:5] if career else [])])
        return (
            f"🎯 **Roadmap for {career_name}**\n\n"
            f"To build a strong profile for **{career_name}**, here are the key competencies you will need:\n"
            f"{missing_text}\n\n"
            f"What coding languages or testing tools do you already have experience with?"
        )

    # 6. Fallback general prompt
    return (
        "I'm here to help guide your career! Tell me what degree you're pursuing, your favorite programming languages, "
        "or your dream job (e.g. *Full Stack Developer, QA Tester, Data Scientist*)."
    )


def build_recommendation_response(request: ChatRequest) -> ChatResponse:
    matched_careers, user_profile, what_to_learn = score_careers(request)
    
    # Try Groq LLM first, else use intelligent contextual fallback
    groq_reply = generate_groq_reply(request, user_profile, matched_careers, what_to_learn)
    
    if groq_reply:
        answer = groq_reply
        source = "groq"
    else:
        answer = generate_smart_fallback(request, user_profile, matched_careers, what_to_learn)
        source = "rule-based"

    graph = build_graph(user_profile, matched_careers) if request.wants_graph else None

    return ChatResponse(
        answer=answer,
        recommendations=matched_careers,
        graph=graph,
        user_profile=user_profile,
        what_to_learn_next=what_to_learn,
        source=source
    )
