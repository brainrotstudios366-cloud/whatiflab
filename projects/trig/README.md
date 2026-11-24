# trig – Sinus, Kosinus, Tangens (YouTube lang 8:02 + 3 Shorts, Karoheft)
Engine = projects/pq (Karoheft 2D). Neue Helfer in h2.js: seg/dseg (Linien, gestrichelt), hi() (Seite farbig hervorheben),
arcA() (Winkelbogen mit Label), rsq() (rechter Winkel), tri(), treeScene() (Baum + Person), Einheitskreis mit animiertem Winkel + Live-Werten.
Farbcode: Gegenkathete blau, Ankathete orange, Hypotenuse rot, Winkel lila. h1.js: Bruch-Token kann Zähler/Nenner getrennt färben (cn/cd).
Gotchas:
- Speko-Stimme spricht hier schneller (~13 Zeichen/s) → erst 7:02; Kapitel ergänzt + Pausen 0.8 s → 8:02. Vorher Dauer schätzen!
- Wd(): 'sinus' steckt in 'Kosinus', 'ag' in 'Gaga' → eindeutige Teilstrings wählen.
- Caveat hat kein α → im Canvas ok (Fallback), in PIL/Thumbnail DejaVu nehmen.
- drawtext: auch der "Ganzes Video"-Text braucht textfile + Leerzeichen am Ende (sonst letzter Buchstabe weg).
- Parallele Speko-Aufrufe laufen trotzdem nacheinander; Zuordnung über Zeitstempel der tool-results-Dateien.
