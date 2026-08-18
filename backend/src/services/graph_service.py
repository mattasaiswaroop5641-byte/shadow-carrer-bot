from src.schemas import CareerGraph, CareerRecommendation, GraphEdge, GraphNode, UserProfile


def build_graph(user_profile: UserProfile, recommendations: list[CareerRecommendation]) -> CareerGraph:
    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []

    # 1. Root Profile Node
    qual_part = f"{user_profile.qualification}" if user_profile.qualification else "Profile"
    target_part = f" → {user_profile.target_career}" if user_profile.target_career else ""
    root_label = f"🎓 {qual_part}{target_part}".strip()
    if root_label == "🎓 Profile":
        root_label = "🚀 Career Explorer"

    nodes.append(GraphNode(id="user_profile", label=root_label, type="start"))

    # 2. Known Strengths Node
    if user_profile.skills:
        skills_summary = ", ".join(user_profile.skills[:3])
        if len(user_profile.skills) > 3:
            skills_summary += f" +{len(user_profile.skills)-3}"
        nodes.append(GraphNode(id="known_skills", label=f"⚡ Strengths: {skills_summary}", type="matched_skill"))
        edges.append(GraphEdge(source="user_profile", target="known_skills", label="Has"))

    # Connect to career recommendations
    connect_from = "known_skills" if user_profile.skills else "user_profile"

    if recommendations:
        for idx, rec in enumerate(recommendations[:4], start=1):
            career_node_id = f"career_{idx}"
            label_text = f"🎯 {rec.career} ({rec.score}%)"
            nodes.append(GraphNode(id=career_node_id, label=label_text, type="career"))
            edges.append(GraphEdge(source=connect_from, target=career_node_id, label=f"{rec.score}% Match"))

            # If this is the top path and has missing skills, attach a "Next to Learn" node
            if idx == 1 and rec.missing_skills:
                learn_summary = ", ".join(rec.missing_skills[:3])
                learn_node_id = "learn_next"
                nodes.append(GraphNode(id=learn_node_id, label=f"📚 Learn: {learn_summary}", type="missing_skill"))
                edges.append(GraphEdge(source=career_node_id, target=learn_node_id, label="Next Milestones"))
    else:
        nodes.append(GraphNode(id="empty_state", label="🔍 Share your goal & skills", type="default"))
        edges.append(GraphEdge(source="user_profile", target="empty_state"))

    return CareerGraph(nodes=nodes, edges=edges)
