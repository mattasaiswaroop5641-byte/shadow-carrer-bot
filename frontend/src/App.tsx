import { FormEvent, useMemo, useRef, useState, useEffect } from 'react';
import { sendChatMessage } from './api';
import type { CareerGraph, CareerRecommendation, ChatMessage, UserProfile } from './types';

// Interactive Graph Component
function CareerGraphView({ graph }: { graph: CareerGraph | null | undefined }) {
  const layout = useMemo(() => {
    if (!graph || graph.nodes.length === 0) {
      return { nodes: [], edges: [], width: 440, height: 260 };
    }

    const nodeWidth = 180;
    const nodeHeight = 44;
    const verticalGap = 70;

    const indexedNodes = graph.nodes.map((node, index) => {
      let x = 30;
      if (index === 0) x = 30;
      else if (node.type === 'matched_skill') x = 120;
      else if (node.type === 'career') x = 180;
      else if (node.type === 'missing_skill') x = 240;
      else x = 140;

      return {
        ...node,
        x,
        y: 20 + index * verticalGap,
        width: nodeWidth,
        height: nodeHeight,
      };
    });

    const nodeMap = new Map(indexedNodes.map((n) => [n.id, n]));

    const edges = graph.edges
      .map((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) return null;

        return {
          x1: source.x + source.width / 2,
          y1: source.y + source.height,
          x2: target.x + target.width / 2,
          y2: target.y,
          label: edge.label,
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);

    return {
      nodes: indexedNodes,
      edges,
      width: 460,
      height: Math.max(260, 40 + graph.nodes.length * verticalGap),
    };
  }, [graph]);

  if (!graph || layout.nodes.length === 0) {
    return <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '10px 0' }}>Graph will construct dynamically as you share your background.</p>;
  }

  return (
    <div className="graph-svg-container">
      <svg className="graph-svg" viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label="Career Roadmap Graph">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="#06b6d4" />
          </marker>
        </defs>
        {layout.edges.map((edge, idx) => (
          <path
            key={idx}
            d={`M ${edge.x1} ${edge.y1} C ${edge.x1} ${edge.y1 + 25}, ${edge.x2} ${edge.y2 - 25}, ${edge.x2} ${edge.y2}`}
            className="graph-edge-path"
            markerEnd="url(#arrowhead)"
          />
        ))}
        {layout.nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <rect
              rx="12"
              ry="12"
              width={node.width}
              height={node.height}
              className={`graph-node-rect ${node.id === 'user_profile' ? 'start-node' : ''} ${node.type === 'career' ? 'target-node' : ''}`}
            />
            <text x={node.width / 2} y={node.height / 2 + 4} textAnchor="middle" className="graph-node-text">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// Enhanced Markdown & Table Formatter
function MarkdownText({ text }: { text: string }) {
  const formattedHtml = useMemo(() => {
    let out = text;

    // Parse Markdown Tables
    if (out.includes('|')) {
      const lines = out.split('\n');
      let inTable = false;
      let tableHtml = '<div style="overflow-x:auto; margin:12px 0;"><table style="width:100%; border-collapse:collapse; font-size:0.84rem; background:rgba(0,0,0,0.2); border-radius:8px;">';
      const newLines: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('|') && line.endsWith('|')) {
          if (!inTable) {
            inTable = true;
          }
          if (line.includes('---')) continue; // skip separator
          const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          const isHeader = !tableHtml.includes('<tbody>') && i <= 3;
          
          tableHtml += '<tr>';
          cells.forEach((c) => {
            const tag = isHeader ? 'th' : 'td';
            const cellStyle = isHeader
              ? 'border:1px solid rgba(255,255,255,0.15); padding:8px 10px; background:rgba(99,102,241,0.15); color:#818cf8; text-align:left;'
              : 'border:1px solid rgba(255,255,255,0.08); padding:7px 10px; color:#f8fafc;';
            tableHtml += `<${tag} style="${cellStyle}">${c.trim()}</${tag}>`;
          });
          tableHtml += '</tr>';
        } else {
          if (inTable) {
            tableHtml += '</table></div>';
            newLines.push(tableHtml);
            tableHtml = '<div style="overflow-x:auto; margin:12px 0;"><table style="width:100%; border-collapse:collapse; font-size:0.84rem; background:rgba(0,0,0,0.2); border-radius:8px;">';
            inTable = false;
          }
          newLines.push(line);
        }
      }
      if (inTable) {
        tableHtml += '</table></div>';
        newLines.push(tableHtml);
      }
      out = newLines.join('\n');
    }

    // Headings
    out = out.replace(/^### (.*$)/gim, '<h4 style="margin:10px 0 4px; color:#7cc7ff; font-size:0.95rem;">$1</h4>');
    out = out.replace(/^## (.*$)/gim, '<h3 style="margin:12px 0 6px; color:#a7f3d0; font-size:1.05rem;">$1</h3>');
    out = out.replace(/^# (.*$)/gim, '<h2 style="margin:14px 0 8px; color:#f8fafc; font-size:1.15rem;">$1</h2>');

    // Bold & Italic
    out = out.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Bullets
    out = out.replace(/^\- (.*$)/gim, '<li style="margin-bottom:4px;">$1</li>');

    // Line breaks
    out = out.replace(/\n/g, '<br/>');
    return out;
  }, [text]);

  return <div dangerouslySetInnerHTML={{ __html: formattedHtml }} />;
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      content: "👋 **Hello! I'm your AI Career Guidance Mentor.**\n\nTell me your current qualification, the skills you already know, or the job role you want to target (e.g. *Full Stack Developer, QA Tester, Data Scientist*).",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile>({ skills: [], interests: [] });
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [whatToLearn, setWhatToLearn] = useState<string[]>([]);
  const [completedSkills, setCompletedSkills] = useState<Set<string>>(new Set());
  const [graph, setGraph] = useState<CareerGraph | null>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const streamEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }

  function toggleSkillChecked(skill: string) {
    setCompletedSkills(prev => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });
  }

  async function handleSend(textToSend?: string) {
    const rawText = textToSend || inputText;
    const trimmed = rawText.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.sender,
        content: m.content
      }));

      const res = await sendChatMessage(trimmed, userProfile, historyPayload);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);

      if (res.user_profile) {
        setUserProfile(res.user_profile);
      }
      if (res.recommendations) {
        setRecommendations(res.recommendations);
      }
      if (res.what_to_learn_next) {
        setWhatToLearn(res.what_to_learn_next);
      }
      if (res.graph) {
        setGraph(res.graph);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: "⚠️ *Unable to reach backend API. Make sure the Python backend is running on port 3001.*",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    handleSend();
  }

  function exportCareerReport() {
    let content = `# AI Career Blueprint Report\nGenerated on: ${new Date().toLocaleDateString()}\n\n`;
    content += `## 🎓 Your Profile\n- Qualification: ${userProfile.qualification || 'Not provided'}\n`;
    content += `- Known Skills: ${userProfile.skills.join(', ') || 'None provided'}\n`;
    content += `- Target Goal: ${userProfile.target_career || 'Exploring'}\n\n`;

    if (whatToLearn.length > 0) {
      content += `## 📚 Missing Skills to Master\n`;
      whatToLearn.forEach(s => {
        content += `- [${completedSkills.has(s) ? 'X' : ' '}] ${s}\n`;
      });
      content += '\n';
    }

    if (recommendations.length > 0) {
      content += `## 🎯 Recommended Career Tracks\n`;
      recommendations.forEach(r => {
        content += `### ${r.career} (${r.score}% Match)\n- Matched: ${r.matched_skills.join(', ') || 'None'}\n- Missing: ${r.missing_skills.join(', ') || 'None'}\n\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'career-guidance-report.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Background Ambient Orbs */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
      </div>

      <div className="app-container">
        {/* Top Header */}
        <header className="top-header glass-panel">
          <div className="brand-wrapper">
            <div className="brand-logo">✨</div>
            <div className="brand-text">
              <h1>Shadow Career Finder</h1>
              <span className="brand-badge">Career Intelligence & Roadmap Engine</span>
            </div>
          </div>
          <div className="header-right">
            <div className="status-chip">
              <span className="status-dot"></span>
              <span>Groq Powered</span>
            </div>
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              className="theme-toggle-btn"
              onClick={exportCareerReport}
              title="Export Career Plan as Markdown"
              style={{ width: 'auto', padding: '0 12px', fontSize: '0.78rem', fontWeight: 600 }}
            >
              📥 Export Report
            </button>
          </div>
        </header>

        {/* Split Layout Stage */}
        <main className="main-stage">
          {/* Left Column: Chat Conversation Stream */}
          <section className="chat-pane glass-panel">
            <div className="chat-header">
              <div className="advisor-info">
                <div className="advisor-avatar">👔</div>
                <div>
                  <div className="advisor-name">Alex Vance</div>
                  <div className="advisor-role">AI Career Strategist</div>
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Multi-Turn Active</span>
            </div>

            {/* Chat Stream */}
            <div className="chat-stream">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}>
                  <div className={`chat-avatar ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                    {msg.sender === 'user' ? 'You' : '✦'}
                  </div>
                  <div className="bubble-wrap" style={{ flex: 1 }}>
                    <div className="bubble-meta">
                      {msg.sender === 'user' ? 'You' : 'Career AI'} • {msg.timestamp}
                    </div>
                    <div className="bubble-card">
                      <MarkdownText text={msg.content} />
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="chat-bubble-row ai-row">
                  <div className="chat-avatar ai">✦</div>
                  <div className="bubble-wrap">
                    <div className="bubble-card" style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
                      Generating roadmap with Groq AI...
                    </div>
                  </div>
                </div>
              )}
              <div ref={streamEndRef} />
            </div>

            {/* Quick Starter Prompts */}
            <div className="quick-prompts-bar">
              <button
                className="prompt-chip"
                onClick={() => handleSend('I know Python and Java coding and I want to become a Full Stack Developer. What do I have to learn?')}
              >
                🚀 Python + Java ➔ Full Stack Dev
              </button>
              <button
                className="prompt-chip"
                onClick={() => handleSend('I am doing MCA and I want to become a software tester.')}
              >
                🧪 MCA ➔ QA & Testing
              </button>
              <button
                className="prompt-chip"
                onClick={() => handleSend('How can I prepare for Backend Developer interviews?')}
              >
                🎙️ Backend Interview Prep
              </button>
            </div>

            {/* Input Bar */}
            <div className="chat-input-container">
              <form onSubmit={handleFormSubmit} className="chat-input-bar">
                <textarea
                  className="chat-textarea"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  placeholder="Type your skills, degree, or dream role... (Press Enter to send)"
                />
                <button type="submit" className="chat-send-btn" disabled={loading || !inputText.trim()}>
                  ➤
                </button>
              </form>
            </div>
          </section>

          {/* Right Column: Career Intelligence Dashboard */}
          <section className="dashboard-pane glass-panel">
            {/* 1. Tracked Profile Widget */}
            <div className="tracker-box">
              <div className="tracker-header">
                <div className="tracker-title">
                  <span>👤</span>
                  <span>Tracked Profile State</span>
                </div>
                {userProfile.qualification && (
                  <span className="pill pill-blue">{userProfile.qualification} Degree</span>
                )}
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Identified Strengths & Skills:
                </div>
                <div className="pills-container">
                  {userProfile.skills && userProfile.skills.length > 0 ? (
                    userProfile.skills.map((s) => (
                      <span key={s} className="pill pill-green">✔ {s}</span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Share your skills (e.g. Python, SQL, Java) to track here</span>
                  )}
                </div>
              </div>

              {userProfile.target_career && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Target Career Goal:
                  </div>
                  <span className="pill pill-amber" style={{ marginTop: '4px' }}>🎯 {userProfile.target_career}</span>
                </div>
              )}
            </div>

            {/* 2. "What You Need to Learn Next" Interactive Checklist */}
            {whatToLearn && whatToLearn.length > 0 && (
              <div className="learn-box">
                <div className="learn-title">
                  <span>📚 What You Have to Learn Next</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                    {completedSkills.size}/{whatToLearn.length} Completed
                  </span>
                </div>
                <div className="learn-list">
                  {whatToLearn.map((skill) => {
                    const isChecked = completedSkills.has(skill);
                    return (
                      <div
                        key={skill}
                        className={`learn-item ${isChecked ? 'checked' : ''}`}
                        onClick={() => toggleSkillChecked(skill)}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSkillChecked(skill)}
                          className="learn-checkbox"
                        />
                        <span style={{ flex: 1 }}>{skill}</span>
                        <span style={{ fontSize: '0.68rem', color: isChecked ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                          {isChecked ? 'Mastered' : 'To Learn'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Top Matches */}
            {recommendations && recommendations.length > 0 && (
              <div>
                <div className="matches-section-title">
                  <span>🏆 Best Career Matches</span>
                </div>
                {recommendations.slice(0, 3).map((rec) => (
                  <article key={rec.career} className="match-card">
                    <div className="match-card-header">
                      <span className="match-role-name">{rec.career}</span>
                      <span className="match-score-badge">{rec.score}% Match</span>
                    </div>

                    <div className="match-progress-track">
                      <div className="match-progress-fill" style={{ width: `${rec.score}%` }}></div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      {rec.why.join(' • ')}
                    </div>

                    {rec.matched_skills && rec.matched_skills.length > 0 && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>
                        ✔ Matched: {rec.matched_skills.join(', ')}
                      </div>
                    )}

                    {rec.missing_skills && rec.missing_skills.length > 0 && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-rose)', marginTop: '2px' }}>
                        ❌ Gaps to learn: {rec.missing_skills.slice(0, 4).join(', ')}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}

            {/* 4. Visual Dynamic Graph */}
            <div className="graph-card">
              <div className="matches-section-title">
                <span>🗺️ Interactive Career Pathway Graph</span>
              </div>
              <CareerGraphView graph={graph} />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
