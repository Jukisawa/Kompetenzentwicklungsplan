/* =========================================================================
   KONFIGURATION
   Hier trägst du deine echten Jahre, Termine, Kategorien, Gruppen und
   Fragen ein. Alles andere (app.js) funktioniert automatisch damit.

   STRUKTUR:
   Kategorie
     └── Gruppe (wird einzeln über "Weiter" durchgeklickt)
           └── Frage(n)

   Eine Kategorie kann eine oder mehrere Gruppen enthalten. Der Ablauf
   geht Kategorie für Kategorie durch, innerhalb einer Kategorie Gruppe
   für Gruppe.
   ========================================================================= */

// ---- Jahre / Freischaltung -------------------------------------------
// startDate: ab wann der Fortschrittsbalken zu füllen beginnt
// targetDate: an diesem Datum wird der Button freigeschaltet (Uhrzeit 00:00)
// color: Hintergrund-/Füllfarbe des Buttons
const YEARS = [
  { id: 1, label: "1. Jahr", color: "#e5484d", startDate: "2025-01-01", targetDate: "2025-06-01" },
  { id: 2, label: "2. Jahr", color: "#f2b705", startDate: "2025-06-01", targetDate: "2026-08-01" },
  { id: 3, label: "3. Jahr", color: "#2fae60", startDate: "2026-01-01", targetDate: "2027-06-01" },
  { id: 4, label: "4. Jahr", color: "#3b82f6", startDate: "2026-01-01", targetDate: "2028-01-01" },
];

// ---- Kategorien, Gruppen und Fragen --------------------------------------
// Jede Kategorie entspricht genau einer Ecke im Spinnendiagramm (Durchschnitt
// über alle Fragen aller Gruppen dieser Kategorie).
// Jede Frage braucht eine eindeutige id (über alle Kategorien hinweg).
const CATEGORIES = [
  {
    "name": "1. Ich habe eine berufliche Identität und professionelle Perspektive entwickelt.",
    "groups": [
      {
        "name": "Berufliche Identität",
        "questions": [
          {
            "id": "q1",
            "text": "Ich kenne den Einfluss meiner eigenen Persönlichkeit und meiner Biografie auf meine Berufsausübung."
          },
          {
            "id": "q2",
            "text": "Ich arbeite auf Grundlage eines humanistischen Menschenbildes und demokratischen Grundwerten."
          },
          {
            "id": "q3",
            "text": "Ich achte auf die Bedürfnisse der Menschen, mit denen ich zusammenarbeite, und gestalte Hilfeleistung in Form der Assistenz aus."
          },
          {
            "id": "q4",
            "text": "Ich vernetze mich mit anderen Professionen und kenne die Wichtigkeit von Interdisziplinarität."
          }
        ]
      },
      {
        "name": "Berufsfeld Heilerziehungspflege",
        "questions": [
          {
            "id": "q5",
            "text": "Ich kenne die Entstehungsgeschichte und den Paradigmenwechsel der Hilfeleistungen von Menschen mit Behinderungen und die daraus resultierenden Aufgaben für mich als Fachkraft."
          },
          {
            "id": "q6",
            "text": "Ich kenne die Struktur der Träger der Wohlfahrtspflege und die heilerziehungspflegerischen Tätigkeitsfelder."
          }
        ]
      },
      {
        "name": "Rechtliche Rahmenbedingungen",
        "questions": [
          {
            "id": "q7",
            "text": "Ich orientiere mich an den Inhalten des SGB IX."
          },
          {
            "id": "q8",
            "text": "Ich orientiere mich an der UN-Behindertenrechtskonvention (UN-BRK)."
          },
          {
            "id": "q9",
            "text": "Ich orientiere mich an der UN-Kinderrechtskonvention (UN-KRK)."
          },
          {
            "id": "q10",
            "text": "Ich orientiere mich an den Inhalten des Grundgesetzes."
          },
          {
            "id": "q11",
            "text": "Ich orientiere mich an den Vorgaben des Datenschutzes sowie an Schweige- und Informationspflichten."
          },
          {
            "id": "q12",
            "text": "Ich orientiere mich am Kinder- und Jugendhilfegesetz, insbesondere an Kindeswohl, Hilfe zur Erziehung sowie Aufsichts- und Fürsorgepflicht."
          }
        ]
      }
    ]
  },
  {
    "name": "2. Ich gestalte pädagogische Beziehungen und begleite Gruppenprozesse.",
    "groups": [
      {
        "name": "Wahrnehmung und Beobachtung",
        "questions": [
          {
            "id": "q13",
            "text": "Ich erkenne die verschiedenen Bedürfnisse von Menschen mit Behinderungen."
          },
          {
            "id": "q14",
            "text": "Ich beobachte reflektiert, gezielt und systematisch und kenne Beobachtungsprozesse, Beobachtungsinstrumente und Beobachtungsfehler."
          },
          {
            "id": "q15",
            "text": "Ich begleite Menschen mit Behinderung in einer dialogischen Haltung."
          }
        ]
      },
      {
        "name": "Beziehungsgestaltung",
        "questions": [
          {
            "id": "q16",
            "text": "Ich bin mir des Spannungsfeldes zwischen Macht und Verantwortung bzw. Nähe und Distanz bewusst."
          },
          {
            "id": "q17",
            "text": "Ich gestalte professionelle Beziehungen nach den Dimensionen pädagogischen Handelns."
          },
          {
            "id": "q18",
            "text": "Ich unterstütze Klient:innen dabei, persönliche Beziehungen auf- und auszubauen."
          },
          {
            "id": "q19",
            "text": "Ich fühle mich sicher im Umgang mit herausforderndem Verhalten."
          }
        ]
      },
      {
        "name": "Partnerschaft und Sexualität",
        "questions": [
          {
            "id": "q20",
            "text": "Ich erkenne ein grundlegendes Recht auf Sexualität an."
          },
          {
            "id": "q21",
            "text": "Ich bin in der Lage, fachlich fundierte Bildungsangebote zu initiieren, beispielsweise zu sexueller Aufklärung, Sexualassistenz, Geburt und Schwangerschaft."
          },
          {
            "id": "q22",
            "text": "Ich kenne spezifische Beratungsstellen und Materialien zur Aufklärung."
          },
          {
            "id": "q23",
            "text": "Ich kenne die spezifischen rechtlichen Grundlagen, beispielsweise UN-BRK, Grundrechte und Strafrecht."
          }
        ]
      },
      {
        "name": "Gruppenarbeit",
        "questions": [
          {
            "id": "q24",
            "text": "Ich gestalte Gruppenprozesse theoriegeleitet und kenne Rollen in Gruppen sowie Gruppenphasen."
          },
          {
            "id": "q25",
            "text": "Ich verwende soziometrische Verfahren zur Gruppen- bzw. Beziehungsanalyse."
          }
        ]
      },
      {
        "name": "Kommunikation",
        "questions": [
          {
            "id": "q26",
            "text": "Ich kommuniziere auf der Basis theoriegeleiteter Kommunikationsregeln und erkenne gegebenenfalls Kommunikationsstörungen."
          },
          {
            "id": "q27",
            "text": "Ich verwende, wenn nötig, Kommunikationshilfen wie GuK, Piktogramme, Gebärdensprache oder Talker."
          },
          {
            "id": "q28",
            "text": "Ich verwende, wenn nötig, einfache Sprache."
          }
        ]
      }
    ]
  },
  {
    "name": "3. Menschen mit Behinderung/en individuell pflegen und begleiten.",
    "groups": [
      {
        "name": "Theoretische Grundlagen",
        "questions": [
          {
            "id": "q29",
            "text": "Ich orientiere mein Handeln an Bindungstheorien."
          },
          {
            "id": "q30",
            "text": "Ich orientiere mein Handeln an Lerntheorien."
          },
          {
            "id": "q31",
            "text": "Ich orientiere mein Handeln an Entwicklungstheorien."
          }
        ]
      },
      {
        "name": "Pflegerische Tätigkeiten",
        "questions": [
          {
            "id": "q32",
            "text": "Ich richte meine Arbeit an einem ganzheitlichen Pflegeverständnis aus."
          },
          {
            "id": "q33",
            "text": "Ich setze mich mit pflegeethischen Grundsätzen auseinander."
          },
          {
            "id": "q34",
            "text": "Ich orientiere mein Handeln an den Besonderheiten spezifischer Behinderungen sowie an anatomisch-physiologischen und pathologischen Zusammenhängen bzw. Veränderungen."
          },
          {
            "id": "q35",
            "text": "Ich formuliere geeignete Förder- und Pflegeziele und setze diese in der Praxis um."
          },
          {
            "id": "q36",
            "text": "Ich bin in der Lage, im Notfall Erste Hilfe zu leisten."
          },
          {
            "id": "q37",
            "text": "Ich führe theoriegeleitet Grundpflege durch."
          },
          {
            "id": "q38",
            "text": "Ich führe theoriegeleitet Behandlungspflege durch."
          },
          {
            "id": "q39",
            "text": "Ich verabreiche Medikamente entsprechend der ärztlichen Anordnung."
          },
          {
            "id": "q40",
            "text": "Ich achte auf die Umsetzung von Prophylaxen."
          },
          {
            "id": "q41",
            "text": "Ich richte mein Handeln an rechtlichen Grundlagen wie Infektionsschutzgesetz, Betäubungsmittelgesetz, Arzneimittelgesetz und Strafgesetzbuch (Haftungsrecht) sowie an Empfehlungen zur Hygiene aus."
          },
          {
            "id": "q42",
            "text": "Ich bin sicher im Umgang mit Krisensituationen."
          }
        ]
      }
    ]
  },
  {
    "name": "4. Die Lebenswelten mit Menschen mit Behinderung/en strukturieren und gestalten.",
    "groups": [
      {
        "name": "Gesellschaftliche Stellung / Paradigmen",
        "questions": [
          {
            "id": "q43",
            "text": "Ich bin mir des Stellenwerts von Menschen mit Behinderungen in unserer Gesellschaft bewusst."
          },
          {
            "id": "q44",
            "text": "Ich orientiere mich am inklusiven Recht, insbesondere an UN-BRK, UN-KRK, Grundgesetz und Allgemeinem Gleichbehandlungsgesetz."
          },
          {
            "id": "q45",
            "text": "Ich richte meine Arbeit an den Paradigmen heilerziehungspflegerischen Handelns wie Inklusion, Empowerment, Assistenz und Selbstbestimmung aus."
          }
        ]
      },
      {
        "name": "Heilerziehungspflegerische Konzepte",
        "questions": [
          {
            "id": "q46",
            "text": "Ich verwende das Konzept TEACCH theoriegeleitet."
          },
          {
            "id": "q47",
            "text": "Ich verwende unterstützte Kommunikation theoriegeleitet."
          },
          {
            "id": "q48",
            "text": "Ich verwende das Konzept Snoezelen theoriegeleitet."
          },
          {
            "id": "q49",
            "text": "Ich verwende Basale Stimulation theoriegeleitet."
          }
        ]
      },
      {
        "name": "Gestaltung von Lebenswelten",
        "questions": [
          {
            "id": "q50",
            "text": "Ich bin mir der Wichtigkeit von Biografiearbeit bewusst und nutze diese entsprechend."
          },
          {
            "id": "q51",
            "text": "Ich verwende die persönliche Zukunftsplanung als Verfahren zur Perspektivklärung."
          },
          {
            "id": "q52",
            "text": "Ich nehme die professionelle Rolle eines Case Managers bzw. einer Case Managerin ein."
          }
        ]
      },
      {
        "name": "Lebenswelt Familie",
        "questions": [
          {
            "id": "q53",
            "text": "Ich bin mir über die möglichen Auswirkungen einer Behinderung im Kontext der Familie bewusst."
          },
          {
            "id": "q54",
            "text": "Ich bin in der Lage, Familien zu beraten oder gegebenenfalls an spezielle Stellen wie Beratungsstellen oder Selbsthilfegruppen zu verweisen."
          },
          {
            "id": "q55",
            "text": "Ich richte mein Handeln nach der UN-BRK, dem Familienrecht sowie dem Kinder- und Jugendrecht aus, beispielsweise Sorgerecht, Kindeswohl, Vormundschaft und Elterngeld."
          }
        ]
      },
      {
        "name": "Lebenswelt Wohnen",
        "questions": [
          {
            "id": "q56",
            "text": "Ich kenne verschiedene Wohnformen und ihre Charakteristika bezüglich der Hilfestellungen für Menschen mit Behinderungen."
          },
          {
            "id": "q57",
            "text": "Ich unterstütze Menschen mit Behinderungen bei der Haushaltsführung, beispielsweise Haushaltspflege, Ernährung, Tagesstrukturierung und Wohnraumgestaltung."
          },
          {
            "id": "q58",
            "text": "Ich kenne die rechtlichen Grundlagen, beispielsweise Wohngeld, Heimrecht, Mietrecht und UN-BRK."
          }
        ]
      },
      {
        "name": "Lebenswelt Freizeit",
        "questions": [
          {
            "id": "q59",
            "text": "Ich unterstütze Menschen mit Behinderungen in ihrer Freizeitgestaltung, beispielsweise bei Hobbys, Festen, Feiern und Urlaub."
          }
        ]
      },
      {
        "name": "Lebenswelt Bildung",
        "questions": [
          {
            "id": "q60",
            "text": "Ich erkenne Bildung als lebenslangen und individuellen Prozess an."
          },
          {
            "id": "q61",
            "text": "Ich ermögliche individuelle Bildungsmöglichkeiten und nutze hierfür spezifische methodisch-didaktische Ideen."
          },
          {
            "id": "q62",
            "text": "Ich kenne Institutionen der frühkindlichen Bildung."
          },
          {
            "id": "q63",
            "text": "Ich kenne die Möglichkeiten der schulischen Bildung."
          },
          {
            "id": "q64",
            "text": "Ich kenne die Möglichkeiten der Erwachsenenbildung."
          },
          {
            "id": "q65",
            "text": "Ich bin in der Lage, Menschen mit Behinderung bei der Ausübung ihrer Religion angemessen zu unterstützen."
          },
          {
            "id": "q66",
            "text": "Ich kenne die spezifischen rechtlichen Grundlagen, beispielsweise sächsisches Kitagesetz, sächsisches Schulgesetz, SGB IX und UN-BRK."
          }
        ]
      },
      {
        "name": "Lebenswelt Arbeit",
        "questions": [
          {
            "id": "q67",
            "text": "Ich kenne die Unterstützungsmöglichkeiten des 1. Arbeitsmarktes."
          },
          {
            "id": "q68",
            "text": "Ich kenne Integrationsbetriebe."
          },
          {
            "id": "q69",
            "text": "Ich kenne Strukturen und Inhalte einer WfbM."
          },
          {
            "id": "q70",
            "text": "Ich kenne die spezifischen rechtlichen Grundlagen wie SGB IX, WVO und UN-BRK."
          }
        ]
      },
      {
        "name": "Rechtliche Bestimmungen",
        "questions": [
          {
            "id": "q71",
            "text": "Ich kenne den Aufbau der deutschen Gesetzgebung."
          },
          {
            "id": "q72",
            "text": "Ich kenne für die Heilerziehungspflege wichtige Rechtsbegriffe und handle danach, beispielsweise Geschäftsfähigkeit, Deliktsfähigkeit, Strafmündigkeit, gesetzliche Betreuung und Wahlrecht."
          },
          {
            "id": "q73",
            "text": "Ich orientiere mein Handeln an den grundlegenden Inhalten der Sozialgesetzbücher SGB II, V, VI, VII, VIII, IX, XI und XII."
          },
          {
            "id": "q74",
            "text": "Ich kenne die Maßgaben des persönlichen Budgets."
          },
          {
            "id": "q75",
            "text": "Ich kenne die Maßgaben des Bundesteilhabegesetzes."
          }
        ]
      }
    ]
  },
  {
    "name": "5. Ich entwickle kulturelle Ausdrucksmöglichkeiten und Kreativität weiter.",
    "groups": [
      {
        "name": "Weiterentwicklung kultureller, kreativer, motorischer und medialer Kompetenzen",
        "questions": [
          {
            "id": "q76",
            "text": "Ich nutze Gestaltungsmöglichkeiten von Kunst, Musik, Sprache und Literatur, Spiel und Bewegung."
          },
          {
            "id": "q77",
            "text": "Ich nutze vielfältige Methoden und Ausdrucksformen."
          },
          {
            "id": "q78",
            "text": "Ich berücksichtige Bedürfnisse, Interessen, Fähigkeiten und Unterstützungsbedarfe."
          },
          {
            "id": "q79",
            "text": "Ich nutze didaktisch-methodische Prinzipien bei der Planung, Durchführung und Reflexion kultureller Angebote."
          }
        ]
      },
      {
        "name": "Orientierung an rechtlichen Rahmenbedingungen",
        "questions": [
          {
            "id": "q80",
            "text": "Ich beachte die Unfallverhütung."
          },
          {
            "id": "q81",
            "text": "Ich beachte die Fürsorge-, Aufsichts- und Sorgfaltspflicht."
          },
          {
            "id": "q82",
            "text": "Ich beachte das Urheber- und Aufführungsrecht."
          }
        ]
      }
    ]
  },
  {
    "name": "6. Beobachtung, Dokumentation und Reflexion",
    "groups": [
      {
        "name": "Beobachtung, Dokumentation und Reflexion",
        "questions": [
          {
            "id": "q83",
            "text": "Ich beobachte und dokumentiere Ressourcen, Entwicklungsverläufe, Unterstützungsbedarfe und Bedürfnisse."
          },
          {
            "id": "q84",
            "text": "Ich begleite die persönliche Zukunftsplanung der Menschen mit Behinderung."
          },
          {
            "id": "q85",
            "text": "Ich beziehe Methoden der Biografiearbeit sowie weitere förderdiagnostische Verfahren zur Informationserhebung in meine Analyse ein."
          },
          {
            "id": "q86",
            "text": "Ich vertrete die Unterstützungsbedarfe der Menschen mit Behinderung transparent gegenüber den Kostenträgern."
          },
          {
            "id": "q87",
            "text": "Ich reflektiere mein Handeln und dokumentiere Entwicklungsverläufe sowie Hilfe- und Förderplanziele."
          },
          {
            "id": "q88",
            "text": "Ich leite aus meiner Reflexion und Dokumentation Unterstützungsbedarfe sowie Handlungsziele ab."
          }
        ]
      }
    ]
  },
  {
    "name": "7. Konzeptionsbezogen und unternehmerisch handeln sowie Qualität sichern und entwickeln.",
    "groups": [
      {
        "name": "Konzeptionsbezogene Arbeit",
        "questions": [
          {
            "id": "q89",
            "text": "Ich setze mich mit Konzeptionen und Leitbildern von Einrichtungen auseinander und entwickle diese gegebenenfalls träger-, tätigkeitsfeld- und einrichtungsspezifisch weiter."
          },
          {
            "id": "q90",
            "text": "Ich habe betriebswirtschaftliches Basiswissen bezogen auf den Träger."
          },
          {
            "id": "q91",
            "text": "Ich kenne verschiedene Unternehmensformen von unterschiedlichen heilerziehungspflegerischen Tätigkeitsfeldern, beispielsweise Vereine, Verbände, GmbHs und GbRs."
          },
          {
            "id": "q92",
            "text": "Ich übernehme Leitungstätigkeiten im Team und/oder Fachaufsichten und plane bzw. steuere den Personaleinsatz bzw. Arbeitsabläufe."
          },
          {
            "id": "q93",
            "text": "Ich kenne interne bzw. externe Unterstützungsmöglichkeiten für das Team, beispielsweise kollegiale Fallberatung, Supervision und Coaching."
          },
          {
            "id": "q94",
            "text": "Ich beachte rechtliche Rahmenbedingungen wie Arbeitsrecht, Personalvertretungsrecht und Tarifrecht."
          },
          {
            "id": "q95",
            "text": "Ich vollziehe die Finanzierung sowie die Vorgänge zur Leistungsberechnung der Einrichtung nach."
          },
          {
            "id": "q96",
            "text": "Ich kooperiere als Netzwerkpartner:in mit Ämtern, Kostenträgern und anderen Trägern der Wohlfahrtspflege."
          },
          {
            "id": "q97",
            "text": "Ich leiste Öffentlichkeitsarbeit durch die Nutzung von Marketinginstrumenten und Corporate Identity."
          },
          {
            "id": "q98",
            "text": "Ich wirke an der Erarbeitung von Qualitätskriterien und -standards auf Grundlage der geltenden sozial-, verwaltungs- und arbeitsrechtlichen Vorgaben mit und trage somit zur Qualitätsentwicklung bei."
          },
          {
            "id": "q99",
            "text": "Ich nutze Verfahren zur Qualitätskontrolle und -sicherung, um Qualität zu sichern."
          }
        ]
      }
    ]
  },
  {
    "name": "8. Mein Ziel für die Ausbildung – Facharbeit erstellen",
    "groups": [
      {
        "name": "Facharbeit",
        "questions": [
          {
            "id": "q100",
            "text": "Ich besitze die Kompetenz, wissenschaftsorientiert aktuelle fachrichtungsbezogene Themen zu bearbeiten."
          },
          {
            "id": "q101",
            "text": "Ich besitze die Kompetenz, die Ergebnisse der Facharbeit zu verteidigen."
          }
        ]
      }
    ]
  }
];

// ---- Antwortoptionen -----------------------------------------------------
// value ist der Punktwert, der für das Spinnendiagramm verwendet wird.
const ANSWER_OPTIONS = [
  { value: 1, label: "Trifft gar nicht zu" },
  { value: 2, label: "Trifft eher nicht zu" },
  { value: 3, label: "Trifft eher zu" },
  { value: 4, label: "Trifft voll zu" },
  { value: 0, label: "Ist nicht bekannt" },
];
