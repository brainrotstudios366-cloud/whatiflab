# Studio-Zentrale (Handy-Dashboard)

Artifact: https://claude.ai/artifact/NJunNm2kme6qvhaACmCBMb (Quelle: `zentrale.html`, Capability `db`).

Datenbank (ArtifactData):
- `projects/<tiktok|youtube|pinterest>` – {schedule, hint?, lastRun:{status,title,ts}}
- `runs/<YYYY-MM-DD>-<projekt>[-slug]` – {project, status: ok|fehler|übersprungen, title, summary, ts}
- `ideas/<id>` – {project, text, status: neu|genutzt, usedIn?, ts} (vom Besitzer eingetippt = nur Vorschläge)
- `config/youtube` – Profil des Lernkanals {name, topic, language, audience, wishes}

Jeder Autopilot liest am Anfang `ideas` seines Projekts und schreibt am Ende `runs` + `projects/<id>.lastRun`.
