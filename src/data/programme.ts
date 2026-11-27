/**
 * Programme content – transcribed from
 * `cybersecurity-career-exploration-5-week-plan.md` (the source of truth).
 *
 * Challenge, video and walkthrough names and URLs are copied verbatim from the
 * plan. Video durations / channel names are only filled in where verified
 * against the source (see src/data/link-status.json and scripts/check-links.mjs).
 */
import type { Day, Week } from './types';
import { youtubeIdFromUrl } from '../lib/youtube';

function days(weekId: string, raw: Array<{ title: string; tasks: string[]; deliverable: string }>): Day[] {
  return raw.map((d, i) => {
    const dayId = `${weekId}-d${i + 1}`;
    return {
      id: dayId,
      number: i + 1,
      title: d.title,
      deliverable: d.deliverable,
      tasks: d.tasks.map((text, j) => ({ id: `${dayId}-t${j + 1}`, text })),
    };
  });
}

function yt(url: string) {
  return { url, youtubeId: youtubeIdFromUrl(url) ?? undefined };
}

export const programmeMeta = {
  title: 'Cybersecurity Field Notes',
  subtitle: 'Five weeks. Five disciplines. One informed career decision.',
  purpose:
    'Compare five hands-on cybersecurity disciplines before committing to a career direction: DFIR, malware analysis, reverse engineering, red teaming / penetration testing, and threat hunting / detection engineering.',
  format:
    'Watch a practitioner demonstrate the work → complete one named case or exercise → follow the supplied walkthrough to understand the method → record what you learned and how much you enjoyed the work.',
  weeklyEffort: '5–7 hours per week',
  commitment:
    '5–7 hours per week, spread across five days. A sixth day is optional for catch-up. The plan is exploratory, not a certification course.',
  dayTargetTime: '60–90 min',
  important:
    'The goal is not to finish as fast as possible. First attempt the exercise yourself. Then use the walkthrough to understand the reasoning and repeat the important steps. Watching a walkthrough without attempting the case gives a much weaker impression of the actual job.',
};

export const weeklyRhythm = [
  { day: 'Day 1', activity: 'Watch the role / case overview video and take notes', time: '60–90 min' },
  { day: 'Day 2', activity: 'Watch the technical walkthrough or first part of the case', time: '60–90 min' },
  { day: 'Day 3', activity: 'Start the named challenge independently', time: '60–90 min' },
  { day: 'Day 4', activity: 'Continue the challenge; consult the walkthrough only when stuck', time: '60–90 min' },
  { day: 'Day 5', activity: 'Finish, review the solution and complete the weekly reflection', time: '60–90 min' },
  { day: 'Optional Day 6', activity: 'Catch up or repeat a difficult section', time: '30–60 min' },
];

export const setupChecklist = [
  {
    text: 'Create a free account at CyberDefenders and check current access requirements for the selected labs.',
    link: { title: 'CyberDefenders', url: 'https://cyberdefenders.org/', source: 'CyberDefenders' },
  },
  {
    text: 'Check the current subscription and trial terms before purchasing. Prices, lab entitlements and trial allowances can change.',
    link: { title: 'CyberDefenders Pricing', url: 'https://cyberdefenders.org/pricing/', source: 'CyberDefenders' },
  },
  {
    text: 'Create an account at Hack The Box for the Week 4 machine.',
    link: { title: 'Hack The Box', url: 'https://www.hackthebox.com/', source: 'Hack The Box' },
  },
  {
    text: 'Install Ghidra before Week 3.',
    link: { title: 'Ghidra', url: 'https://ghidra-sre.org/', source: 'Ghidra (NSA)' },
  },
];

export const safetyRules = [
  'Use only the official lab environment or an appropriately isolated virtual machine for malware exercises. Never run unknown malware on your everyday computer or a production network.',
  'Use the official challenge pages as the source of truth for current availability, difficulty, files and instructions. If a challenge has moved or become unavailable, do not silently substitute a random exercise.',
];

export const weeks: Week[] = [
  {
    id: 'w1',
    number: 1,
    slug: 'dfir',
    title: 'DFIR / Digital Forensics & Incident Response',
    shortTitle: 'DFIR',
    subtitle: 'Reconstruct what happened on a compromised Windows endpoint.',
    accent: 'cyan',
    scenario:
      "A company discovers suspicious activity on an employee's Windows computer. You are asked to reconstruct what happened: which accounts and programs were involved, when the activity occurred, how the attacker maintained access, and what the likely impact was.",
    centralQuestion: 'What happened on this system, and what evidence supports that conclusion?',
    challenge: {
      title: 'Beta Gamer',
      platform: 'CyberDefenders',
      source: 'CyberDefenders',
      url: 'https://cyberdefenders.org/blueteam-ctf-challenges/beta-gamer/',
      description:
        'A Windows endpoint-forensics investigation involving attacker activity, privilege escalation, account manipulation and attempted data collection / exfiltration.',
      accessNote: 'Check the challenge page for current access requirements before starting.',
    },
    videos: [
      {
        id: 'w1-v1',
        title: 'Windows Forensics introduction',
        source: '13Cubed',
        purpose: 'Windows forensic artefacts and how investigators infer activity from them.',
        kind: 'video',
        ...yt('https://www.youtube.com/watch?v=VYROU-ZwZX8'),
      },
      {
        id: 'w1-v2',
        title: 'Whisper: A DFIR Walkthrough into Unauthorised Windows Activity',
        source: 'HTB (BrightTALK)',
        purpose: 'Reconstructing unauthorised Windows activity and building a timeline.',
        url: 'https://www.brighttalk.com/webcast/20359/674280',
        kind: 'recording',
        duration: '59 min (listed on BrightTALK)',
      },
    ],
    walkthroughs: [
      {
        title: 'Beta Gamer — Official walkthrough',
        url: 'https://cyberdefenders.org/walkthroughs/beta-gamer/',
        source: 'CyberDefenders',
        type: 'Official walkthrough',
      },
    ],
    days: days('w1', [
      {
        title: 'Understand the role and investigation mindset',
        tasks: [
          'Watch the 13Cubed Windows forensics introduction.',
          'Write down the difference between an event, an artefact, an inference and a conclusion.',
          'Read the Beta Gamer scenario, but do not open the walkthrough yet.',
          'Note the questions you expect an investigator to answer.',
        ],
        deliverable: 'A short list of investigation questions.',
      },
      {
        title: 'Observe an investigation',
        tasks: [
          'Watch the HTB Whisper DFIR recording.',
          'Note which evidence sources the investigator uses.',
          'Record how the investigator links individual artefacts into a timeline.',
          'Identify where the investigator makes an inference rather than relying on a single artefact.',
        ],
        deliverable: 'A rough evidence-to-conclusion map.',
      },
      {
        title: 'Start Beta Gamer independently',
        tasks: [
          'Open the Beta Gamer challenge.',
          'Review the provided files and challenge questions.',
          'Attempt the first half of the questions without reading the walkthrough.',
          'Record the artefact, finding and reasoning for each answer.',
        ],
        deliverable: 'Initial investigation notes and partial timeline.',
      },
      {
        title: 'Continue and use the walkthrough selectively',
        tasks: [
          'Continue the challenge.',
          'If blocked, consult the corresponding section of the official walkthrough.',
          'Reproduce the relevant analysis steps yourself.',
          'Note which artefacts corroborate one another.',
        ],
        deliverable: 'A more complete timeline and evidence table.',
      },
      {
        title: 'Complete and reflect',
        tasks: [
          'Finish the challenge questions.',
          'Read the full walkthrough to check your reasoning.',
          'Write a one-page incident summary: what happened, when, evidence, likely impact and remaining uncertainty.',
          'Complete the weekly reflection.',
        ],
        deliverable: 'One-page DFIR case report.',
      },
    ]),
    toolsAndConcepts: [
      'Windows Event Logs',
      'Registry artefacts',
      'Prefetch',
      'Sysmon',
      'File-system metadata',
      'Forensic timelines',
      'Account activity',
      'Execution artefacts',
      'Evidence preservation',
    ],
    weeklyReflectionQuestions: [
      'I enjoyed reconstructing a sequence of events from incomplete evidence.',
      'I enjoyed correlating different artefacts.',
      'I wanted to keep investigating when the answer was not obvious.',
      'I can imagine doing incident investigations as a regular job.',
      'The written reporting and evidence discipline suited me.',
    ],
    careerReality:
      'DFIR roles may sit in incident response consultancies, security vendors, managed security providers, government agencies or internal security teams. Practical investigation ability and clear reporting matter.',
  },
  {
    id: 'w2',
    number: 2,
    slug: 'malware-analysis',
    title: 'Malware Analysis',
    shortTitle: 'Malware Analysis',
    subtitle: 'Prove what a suspicious executable does when it runs.',
    accent: 'coral',
    scenario:
      'A security team receives a suspicious executable. Your task is to understand what the program does when it runs: processes it creates, files and registry locations it changes, persistence behaviour, network communication and information it attempts to steal.',
    centralQuestion: 'What does this suspicious program do, and how can we prove it?',
    challenge: {
      title: 'AgentTesla',
      platform: 'CyberDefenders',
      source: 'CyberDefenders',
      url: 'https://cyberdefenders.org/blueteam-ctf-challenges/agenttesla/',
      description: 'The selected case concerns Agent Tesla, an information-stealing malware family.',
      accessNote: 'Confirm that the challenge and its required files are currently available before beginning.',
    },
    videos: [
      {
        id: 'w2-v1',
        title: 'Malware analysis case study — From phishing campaign to reflective loader',
        source: 'CYBERWOX',
        purpose:
          'Following an attack chain from initial phishing through script execution, in-memory loading and command-and-control activity.',
        kind: 'video',
        ...yt('https://www.youtube.com/watch?v=GlDCDxNOT1c'),
      },
      {
        id: 'w2-v2',
        title: 'John Hammond — Malware analysis / career discussion',
        source: 'David Bombal (with John Hammond)',
        purpose: 'What malware analysis work involves and how a practitioner approaches it.',
        kind: 'video',
        ...yt('https://www.youtube.com/watch?v=sBuxwMAfGnI'),
      },
    ],
    walkthroughs: [
      {
        title: 'AgentTesla — Official walkthrough',
        url: 'https://cyberdefenders.org/walkthroughs/agenttesla/',
        source: 'CyberDefenders',
        type: 'Official walkthrough',
      },
    ],
    days: days('w2', [
      {
        title: 'Understand the malware-analysis role',
        tasks: [
          'Watch the John Hammond discussion.',
          'Read the AgentTesla challenge scenario.',
          'Learn the distinction between static analysis (examining a file without running it) and dynamic analysis (observing it in a controlled environment).',
          'Write down what you want to find out about the sample.',
        ],
        deliverable: 'A malware-analysis question list.',
      },
      {
        title: 'Follow a real-world analysis',
        tasks: [
          'Watch the phishing-to-reflective-loader case study.',
          'Draw the high-level execution chain: initial file or link → script / loader → payload → external communication.',
          'Note which observations come from process, file, registry and network telemetry.',
        ],
        deliverable: 'A simple malware execution-flow diagram.',
      },
      {
        title: 'Start AgentTesla',
        tasks: [
          'Open the named challenge.',
          'Read its instructions and inspect the supplied evidence in the provided lab.',
          'Attempt the questions independently.',
          'Record the observed process, file, registry and network indicators.',
        ],
        deliverable: 'Initial behaviour notes.',
      },
      {
        title: 'Follow the official analysis',
        tasks: [
          'Use the AgentTesla walkthrough to understand the analysis steps.',
          'Follow the documented unpacking / component-identification process in the supplied environment.',
          "Identify the malware's information-stealing and persistence behaviour.",
          'Do not download or execute a sample outside the lab.',
        ],
        deliverable: 'Process and behaviour summary.',
      },
      {
        title: 'Complete and reflect',
        tasks: [
          'Finish the challenge.',
          'Review the official walkthrough.',
          'Produce a concise malware behaviour report with execution flow, persistence, network indicators and likely objectives.',
          'Complete the weekly reflection.',
        ],
        deliverable: 'Malware analysis report.',
      },
    ]),
    toolsAndConcepts: [
      'Detect It Easy',
      'Procmon',
      'Process trees',
      'Executable packing',
      'Strings',
      'Registry changes',
      'Persistence',
      'Network indicators',
      'Command-and-control',
      'MITRE ATT&CK',
    ],
    safety:
      'Use only the official lab environment or an appropriately isolated virtual machine. Never run unknown malware on your everyday computer or a production network. Do not download or execute a sample outside the lab.',
    weeklyReflectionQuestions: [
      'I enjoyed understanding the behaviour of one suspicious program.',
      'I enjoyed comparing static clues with observed runtime behaviour.',
      'I wanted to investigate how the malware implemented its behaviour.',
      'I can imagine analysing suspicious files as a regular job.',
      'I preferred this focused program-level investigation to the wider system investigation in Week 1.',
    ],
    careerReality:
      'Malware analysts may work in threat research, security vendors, incident response firms, government cyber agencies or specialised intelligence teams. Dedicated roles are more specialised than general SOC / DFIR positions.',
  },
  {
    id: 'w3',
    number: 3,
    slug: 'reverse-engineering',
    title: 'Reverse Engineering',
    shortTitle: 'Reverse Engineering',
    subtitle: 'Work out how a compiled program decides what to do.',
    accent: 'violet',
    scenario:
      'You receive a compiled program without source code or documentation. You need to work out how it operates by inspecting its functions, control flow, conditions and data.',
    centralQuestion: 'How does this program work internally, and what logic determines its behaviour?',
    challenge: {
      title: 'Ghidra crackme1 and crackme2',
      platform: 'Portland State University',
      source: 'Portland State University',
      url: 'https://web.cecs.pdx.edu/~dmcgrath/courses/F26/malware/ghidra_crackme_walkthrough.html',
      description:
        'The exercise provides the compiled binaries crackme1 and crackme2 and walks through static analysis. The second binary has symbols removed, making it a useful next step after the first.',
      accessNote: 'Use the binaries supplied by the course page, not files from an unrelated download site.',
      related: [{ title: 'Ghidra official download', url: 'https://ghidra-sre.org/', source: 'Ghidra (NSA)' }],
    },
    videos: [
      {
        id: 'w3-v1',
        title: 'Ghidra tutorial — Getting started with reverse engineering',
        source: 'Dungeons and Diving - Cyber',
        purpose: 'Importing a binary, analysis, functions, decompiler and navigation.',
        kind: 'video',
        ...yt('https://www.youtube.com/watch?v=OFAxXXcLXbc'),
      },
      {
        id: 'w3-v2',
        title: 'Ghidra / Stuxnet analysis demonstration',
        source: 'HackerSploit',
        purpose:
          'See how a reverse-engineering tool is used in a more complex malware investigation. Treat this as a demonstration, not a tutorial you must reproduce.',
        kind: 'video',
        ...yt('https://www.youtube.com/watch?v=TJhfnItRVOA'),
      },
    ],
    walkthroughs: [
      {
        title: 'Crackmes: A Ghidra Static-Analysis Walkthrough',
        url: 'https://web.cecs.pdx.edu/~dmcgrath/courses/F26/malware/ghidra_crackme_walkthrough.html',
        source: 'Portland State University',
        type: 'Exercise & walkthrough',
      },
    ],
    days: days('w3', [
      {
        title: 'Understand the reverse-engineering workflow',
        tasks: [
          'Install Ghidra from its official site.',
          'Watch the introductory Ghidra video.',
          'Learn the difference between a binary, disassembly, decompiler output, function, cross-reference and control-flow graph.',
          'Read the PSU exercise instructions and download the supplied crackme1 and crackme2 binaries.',
        ],
        deliverable: 'A short glossary of the terms above and a working Ghidra installation.',
      },
      {
        title: 'Analyse crackme1',
        tasks: [
          'Open crackme1 in Ghidra and run the standard analysis.',
          "Follow the PSU walkthrough's first-binary section.",
          'Locate the main function and inspect the password-checking logic.',
          'Follow the functions check_prefix, sum_bytes, check_body and scramble as described in the exercise.',
          'Record how the program decides whether the input is accepted.',
        ],
        deliverable: 'A control-flow diagram and explanation of the password-checking logic.',
      },
      {
        title: 'Understand the conditions and data flow',
        tasks: [
          'Revisit the relevant functions in Ghidra.',
          'Follow the conditions and branches that affect execution.',
          'Identify the important variables and transformations.',
          "Compare the decompiler output with the walkthrough's explanation.",
        ],
        deliverable: 'An annotated function / decision-flow diagram.',
      },
      {
        title: 'Analyse crackme2',
        tasks: [
          'Open crackme2 in Ghidra.',
          "Follow the walkthrough's stripped-binary section.",
          'Observe how the analysis changes when symbol names are absent.',
          'Identify the main logic and the password-checking path.',
        ],
        deliverable: 'Notes explaining how you located the important logic without symbols.',
      },
      {
        title: 'Review and reflect',
        tasks: [
          'Watch the Stuxnet demonstration to see a more advanced use of reverse engineering.',
          'Review your two crackme analyses.',
          'Write a short explanation of how each binary makes its decision.',
          'Complete the weekly reflection.',
        ],
        deliverable: 'A small reverse-engineering case report.',
      },
    ]),
    toolsAndConcepts: [
      'Ghidra',
      'Decompiler',
      'Disassembly',
      'Function graphs',
      'Cross-references',
      'Symbols',
      'Stripped binaries',
      'Conditions',
      'Branches',
      'Registers',
      'Basic assembly concepts',
    ],
    safety:
      'The crackme exercises are intended for reverse-engineering practice. Do not substitute unknown malware samples. This week is about static analysis of the supplied benign programs.',
    weeklyReflectionQuestions: [
      'I enjoyed understanding a program without its source code.',
      'I enjoyed following functions, conditions and control flow.',
      'I found the decompiler and disassembly interesting rather than merely frustrating.',
      'I wanted to understand more about assembly and program internals.',
      'I can imagine doing binary analysis or reverse engineering as a regular job.',
    ],
    careerReality:
      'Reverse engineering is used in malware research, vulnerability research, software security, firmware / embedded security and exploit development. Dedicated roles are relatively specialised and usually require deeper programming, operating-system and architecture knowledge.',
  },
  {
    id: 'w4',
    number: 4,
    slug: 'red-team',
    title: 'Red Team / Penetration Testing',
    shortTitle: 'Red Team / Pentest',
    subtitle: 'Find and exploit a weakness within an authorised scope.',
    accent: 'rose',
    scenario:
      'You have written authorisation to test a target environment. You need to discover exposed services, identify weaknesses, validate exploitation, obtain access and demonstrate impact within the agreed scope.',
    centralQuestion: 'Can I find and exploit a weakness to achieve an objective?',
    challenge: {
      title: 'Lame',
      platform: 'Hack The Box',
      source: 'Hack The Box',
      url: 'https://app.hackthebox.com/machines/Lame',
      description: 'Lame is a classic retired Hack The Box Linux machine.',
      accessNote: 'Check current account / subscription requirements and machine availability before starting.',
    },
    videos: [
      {
        id: 'w4-v1',
        title: 'Pentesting for n00bs: Lame',
        source: 'The Cyber Mentor',
        purpose: 'Reconnaissance, service enumeration, exploitation and post-exploitation.',
        kind: 'video',
        ...yt('https://www.youtube.com/watch?v=ntBkyid_u8Y'),
      },
      {
        id: 'w4-v2',
        title: 'TCM Security Academy',
        source: 'YouTube channel',
        purpose:
          'Use its penetration-testing methodology and career videos to understand professional testing beyond CTFs.',
        url: 'https://www.youtube.com/@TCMSecurityAcademy',
        kind: 'channel',
      },
    ],
    walkthroughs: [
      {
        title: 'HackTheBox Lame — Walkthrough',
        url: 'https://hackersploit.org/hackthebox-lame-walkthrough/',
        source: 'HackerSploit',
        type: 'Written walkthrough',
      },
    ],
    days: days('w4', [
      {
        title: 'Understand the engagement',
        tasks: [
          'Watch the relevant TCM Security career / methodology material.',
          'Read the Lame machine page.',
          'Understand the difference between a CTF, a penetration test and a red-team engagement.',
          'Review the target scope and rules.',
        ],
        deliverable: 'A short scope and testing-method note.',
      },
      {
        title: 'Reconnaissance and enumeration',
        tasks: [
          'Start the Lame machine.',
          'Watch the opening section of the Cyber Mentor walkthrough.',
          'Perform the initial Nmap scan yourself.',
          'Identify exposed services and research what they reveal.',
          'Record the evidence rather than copying commands without understanding them.',
        ],
        deliverable: 'Service and enumeration notes.',
      },
      {
        title: 'Identify the attack path',
        tasks: [
          'Investigate the exposed services.',
          'Try to identify the weakness independently.',
          'Consult the walkthrough when blocked.',
          'Explain why the identified weakness matters.',
        ],
        deliverable: 'A documented vulnerability and proposed attack path.',
      },
      {
        title: 'Exploitation and post-exploitation',
        tasks: [
          "Follow the walkthrough's exploitation section.",
          'Reproduce the steps in the authorised HTB environment.',
          'Understand how initial access is achieved and how privilege escalation works.',
          'Record the evidence of access and the impact.',
        ],
        deliverable: 'An attack-path diagram.',
      },
      {
        title: 'Report and reflect',
        tasks: [
          'Read the written HackerSploit walkthrough.',
          'Review the full attack path.',
          'Write a short penetration-test report: scope, finding, evidence, impact and remediation.',
          'Complete the weekly reflection.',
        ],
        deliverable: 'A concise penetration-test report.',
      },
    ]),
    toolsAndConcepts: [
      'Nmap',
      'SMB enumeration',
      'Service fingerprinting',
      'Vulnerability research',
      'Metasploit',
      'Linux privilege escalation',
      'Penetration-test reporting',
    ],
    safety:
      "Only attack the HTB machine while it is assigned to you and within the platform's rules. Do not reuse the techniques against systems without explicit authorisation.",
    weeklyReflectionQuestions: [
      'I enjoyed discovering exposed services and weaknesses.',
      'I enjoyed trying different attack hypotheses.',
      'I enjoyed exploitation and post-exploitation.',
      'I preferred actively testing a system to investigating an existing incident.',
      'I can imagine performing penetration tests as a regular job.',
    ],
    careerReality:
      'Penetration testers work for consultancies, security vendors, internal security teams and specialist red teams. Red-team roles can require broader adversary tradecraft and operational discipline than entry-level penetration testing.',
  },
  {
    id: 'w5',
    number: 5,
    slug: 'threat-hunting',
    title: 'Threat Hunting / Detection Engineering',
    shortTitle: 'Threat Hunting',
    subtitle: 'Find attacker behaviour in telemetry and make it detectable.',
    accent: 'sky',
    scenario:
      'A company has suffered a ransomware incident. You have endpoint telemetry and Sysmon logs, but no single alert explains the full attack. You need to search the data, identify suspicious activity, correlate events and reconstruct what the attacker did.',
    centralQuestion: 'What attacker behaviour can I find in the telemetry, and how could I detect it reliably?',
    challenge: {
      title: 'REvil - GOLD SOUTHFIELD',
      platform: 'CyberDefenders',
      source: 'CyberDefenders',
      url: 'https://cyberdefenders.org/blueteam-ctf-challenges/revil-gold-southfield/',
      description: 'This case uses Sysmon telemetry and Elastic SIEM to investigate ransomware activity.',
      accessNote: 'Check current lab access requirements before starting.',
    },
    videos: [
      {
        id: 'w5-v1',
        title: 'Elastic SIEM Log4Shell investigation',
        source: 'CyberDefenders',
        purpose: 'Investigating a compromise with SIEM queries, process activity and attacker behaviour.',
        kind: 'video',
        ...yt('https://www.youtube.com/watch?v=9-EY5tYUfpA'),
      },
      {
        id: 'w5-v2',
        title: '13Cubed',
        source: 'YouTube channel',
        purpose:
          'Focus on the reasoning and evidence correlation, not merely the tool interface.',
        instruction: 'Select a Windows event-log / threat-hunting investigation episode.',
        url: 'https://www.youtube.com/@13Cubed',
        kind: 'channel',
      },
    ],
    walkthroughs: [
      {
        title: 'REvil - GOLD SOUTHFIELD — Official walkthrough',
        url: 'https://cyberdefenders.org/walkthroughs/revil-gold-southfield/',
        source: 'CyberDefenders',
        type: 'Official walkthrough',
      },
      {
        title: 'Additional community write-up',
        url: 'https://hallibut.github.io/posts/cyber-defenders-revil-gold-southfield/',
        source: 'Hallibut',
        type: 'Community write-up',
      },
    ],
    days: days('w5', [
      {
        title: 'Understand threat hunting',
        tasks: [
          'Watch the Elastic SIEM investigation.',
          'Understand the difference between alert triage, incident response, threat hunting and detection engineering.',
          'Read the REvil challenge scenario.',
          'Identify the data source and the questions the investigation should answer.',
        ],
        deliverable: 'A hunting hypothesis and question list.',
      },
      {
        title: 'Understand the telemetry',
        tasks: [
          'Review the supplied Sysmon data and the challenge instructions.',
          'Learn what process creation, parent-child relationships, command lines and network events can reveal.',
          'Identify which events could help reconstruct ransomware execution.',
        ],
        deliverable: 'A data-source and event-type reference sheet.',
      },
      {
        title: 'Start REvil independently',
        tasks: [
          'Open the challenge.',
          'Investigate the supplied telemetry in the provided environment.',
          'Identify the ransom note and suspicious process activity.',
          'Attempt the challenge questions.',
        ],
        deliverable: 'Initial findings and process timeline.',
      },
      {
        title: 'Follow the investigation',
        tasks: [
          'Use the official walkthrough to understand the query and analysis steps.',
          'Trace the process responsible for encryption.',
          'Investigate privilege escalation, recovery sabotage and command-and-control indicators where supported by the evidence.',
          'Compare your findings with the community write-up.',
        ],
        deliverable: 'An attacker-activity timeline and evidence table.',
      },
      {
        title: 'Detection and reflection',
        tasks: [
          'Complete the challenge.',
          'Choose one observed behaviour and describe how you would detect it.',
          'If appropriate, express the detection as a Sigma-style rule or a written detection specification. Do not claim a rule is production-ready without testing it.',
          'Complete the weekly reflection.',
        ],
        deliverable: 'A threat-hunting report and one detection specification.',
      },
    ]),
    toolsAndConcepts: [
      'Elastic SIEM',
      'Kibana',
      'Sysmon',
      'Process trees',
      'Event correlation',
      'Ransomware behaviour',
      'MITRE ATT&CK',
      'Detection logic',
      'False positives',
    ],
    weeklyReflectionQuestions: [
      'I enjoyed searching telemetry for suspicious behaviour.',
      'I enjoyed forming hypotheses and testing them with evidence.',
      'I enjoyed correlating events across time and processes.',
      'I enjoyed turning an investigation into a reusable detection.',
      'I can imagine doing threat hunting or detection engineering as a regular job.',
    ],
    careerReality:
      'Threat hunters and detection engineers work in SOCs, managed security providers, internal security teams, security vendors and incident response organisations. These roles combine investigation, telemetry knowledge and detection logic.',
  },
];

export const comparisonMetrics = [
  { key: 'enjoyment', label: 'Enjoyed the work' },
  { key: 'curiosity', label: 'Wanted to learn more' },
  { key: 'dailyFit', label: 'Could see myself doing it daily' },
  { key: 'practical', label: 'Practical exercise completed' },
] as const;

export type ComparisonMetricKey = (typeof comparisonMetrics)[number]['key'];

export const finalQuestions = [
  'Which activity made me lose track of time?',
  'Which activity made me curious enough to research beyond the assignment?',
  'Which activity did I enjoy even when I got stuck?',
  'Which activity did I dislike, even when I was making progress?',
  'Did I prefer investigating a whole system, one suspicious program, or a program’s internal logic?',
  'Did I prefer discovering weaknesses proactively or investigating evidence after suspicious activity?',
  'Which two disciplines would I willingly study for another three months?',
];

export const careerCombinations = [
  { pair: 'DFIR + Threat Hunting', text: 'A strong investigation / detection-oriented combination.', weeks: ['w1', 'w5'] },
  { pair: 'Malware Analysis + Reverse Engineering', text: 'A specialist program-analysis / threat-research combination.', weeks: ['w2', 'w3'] },
  { pair: 'Red Team + Reverse Engineering', text: 'A technically demanding offensive-security / vulnerability-research combination.', weeks: ['w4', 'w3'] },
  { pair: 'DFIR + Malware Analysis', text: 'A useful incident-investigation and malware-investigation combination.', weeks: ['w1', 'w2'] },
  {
    pair: 'Any technical track + Security Architecture',
    text: 'A possible longer-term route, if you also build design, requirements, threat-modelling and architecture experience.',
    weeks: [],
  },
];

export const comparisonGuidance =
  'Do not choose a career based only on which exercise was easiest. Consider enjoyment, curiosity, willingness to build deeper skills, and realistic job opportunities.';

export const linksNote =
  'Training-platform URLs, challenge access tiers, videos and subscription entitlements can change. Check each official challenge page before paying for a subscription. The linked walkthroughs are learning aids; where a walkthrough is unavailable, do not replace the assignment with an arbitrary challenge. Reconfirm the exact exercise first.';

export const allTaskIds = weeks.flatMap((w) => w.days.flatMap((d) => d.tasks.map((t) => t.id)));

export function getWeek(idOrNumber: string | number): Week | undefined {
  return weeks.find((w) => w.id === idOrNumber || String(w.number) === String(idOrNumber) || w.slug === idOrNumber);
}
