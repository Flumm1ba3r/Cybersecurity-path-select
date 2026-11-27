# Cybersecurity Career Exploration — 5-Week Practical Plan

> **Purpose:** Compare five hands-on cybersecurity disciplines before committing to a career direction: DFIR, malware analysis, reverse engineering, red teaming / penetration testing, and threat hunting / detection engineering.
>
> **Format:** Watch a practitioner demonstrate the work → complete one named case or exercise → follow the supplied walkthrough to understand the method → record what you learned and how much you enjoyed the work.
>
> **Suggested commitment:** 5–7 hours per week, spread across five days. A sixth day is optional for catch-up. The plan is exploratory, not a certification course.

## Before starting

### Accounts, tools and safety

- Create a free account at [CyberDefenders](https://cyberdefenders.org/) and check current access requirements for the selected labs.
- Check the current subscription and trial terms on [CyberDefenders Pricing](https://cyberdefenders.org/pricing/) before purchasing. Prices, lab entitlements and trial allowances can change.
- Create an account at [Hack The Box](https://www.hackthebox.com/) for the Week 4 machine.
- Install [Ghidra](https://ghidra-sre.org/) before Week 3.
- Use only the official lab environment or an appropriately isolated virtual machine for malware exercises. **Never run unknown malware on your everyday computer or a production network.**
- Use the official challenge pages as the source of truth for current availability, difficulty, files and instructions. If a challenge has moved or become unavailable, do not silently substitute a random exercise.

### Weekly rhythm

| Day | Activity | Target time |
|---|---|---:|
| Day 1 | Watch the role / case overview video and take notes | 60–90 min |
| Day 2 | Watch the technical walkthrough or first part of the case | 60–90 min |
| Day 3 | Start the named challenge independently | 60–90 min |
| Day 4 | Continue the challenge; consult the walkthrough only when stuck | 60–90 min |
| Day 5 | Finish, review the solution and complete the weekly reflection | 60–90 min |
| Optional Day 6 | Catch up or repeat a difficult section | 30–60 min |

**Important:** The goal is not to finish as fast as possible. First attempt the exercise yourself. Then use the walkthrough to understand the reasoning and repeat the important steps. Watching a walkthrough without attempting the case gives a much weaker impression of the actual job.

---

# Week 1 — DFIR / Digital Forensics & Incident Response

## The job scenario

A company discovers suspicious activity on an employee's Windows computer. You are asked to reconstruct what happened: which accounts and programs were involved, when the activity occurred, how the attacker maintained access, and what the likely impact was.

**The central question:** *What happened on this system, and what evidence supports that conclusion?*

## Exact practical assignment

**CyberDefenders — Beta Gamer**

- [Challenge page](https://cyberdefenders.org/blueteam-ctf-challenges/beta-gamer/)
- [Official walkthrough](https://cyberdefenders.org/walkthroughs/beta-gamer/)

This is a Windows endpoint-forensics investigation involving attacker activity, privilege escalation, account manipulation and attempted data collection / exfiltration. Check the challenge page for current access requirements before starting.

## Watch

1. **13Cubed — Windows Forensics introduction**  
   [YouTube video](https://www.youtube.com/watch?v=VYROU-ZwZX8)  
   Focus: Windows forensic artefacts and how investigators infer activity from them.

2. **HTB — Whisper: A DFIR Walkthrough into Unauthorised Windows Activity**  
   [Recorded walkthrough](https://www.brighttalk.com/webcast/20359/674280)  
   Focus: reconstructing unauthorised Windows activity and building a timeline.

## Daily schedule

### Day 1 — Understand the role and investigation mindset
- Watch the 13Cubed Windows forensics introduction.
- Write down the difference between an event, an artefact, an inference and a conclusion.
- Read the Beta Gamer scenario, but do not open the walkthrough yet.
- Note the questions you expect an investigator to answer.

**Deliverable:** A short list of investigation questions.

### Day 2 — Observe an investigation
- Watch the HTB Whisper DFIR recording.
- Note which evidence sources the investigator uses.
- Record how the investigator links individual artefacts into a timeline.
- Identify where the investigator makes an inference rather than relying on a single artefact.

**Deliverable:** A rough evidence-to-conclusion map.

### Day 3 — Start Beta Gamer independently
- Open the Beta Gamer challenge.
- Review the provided files and challenge questions.
- Attempt the first half of the questions without reading the walkthrough.
- Record the artefact, finding and reasoning for each answer.

**Deliverable:** Initial investigation notes and partial timeline.

### Day 4 — Continue and use the walkthrough selectively
- Continue the challenge.
- If blocked, consult the corresponding section of the official walkthrough.
- Reproduce the relevant analysis steps yourself.
- Note which artefacts corroborate one another.

**Deliverable:** A more complete timeline and evidence table.

### Day 5 — Complete and reflect
- Finish the challenge questions.
- Read the full walkthrough to check your reasoning.
- Write a one-page incident summary: what happened, when, evidence, likely impact and remaining uncertainty.
- Complete the weekly reflection below.

**Deliverable:** One-page DFIR case report.

## Tools and concepts you may encounter

Windows Event Logs, Registry artefacts, Prefetch, Sysmon, file-system metadata, forensic timelines, account activity, execution artefacts and evidence preservation.

## Weekly reflection

Rate each item from 1 (not at all) to 5 (very much):

- I enjoyed reconstructing a sequence of events from incomplete evidence.
- I enjoyed correlating different artefacts.
- I wanted to keep investigating when the answer was not obvious.
- I can imagine doing incident investigations as a regular job.
- The written reporting and evidence discipline suited me.

**Career reality to investigate:** DFIR roles may sit in incident response consultancies, security vendors, managed security providers, government agencies or internal security teams. Practical investigation ability and clear reporting matter.

---

# Week 2 — Malware Analysis

## The job scenario

A security team receives a suspicious executable. Your task is to understand what the program does when it runs: processes it creates, files and registry locations it changes, persistence behaviour, network communication and information it attempts to steal.

**The central question:** *What does this suspicious program do, and how can we prove it?*

## Exact practical assignment

**CyberDefenders — AgentTesla**

- [Challenge page](https://cyberdefenders.org/blueteam-ctf-challenges/agenttesla/)
- [Official walkthrough](https://cyberdefenders.org/walkthroughs/agenttesla/)

The selected case concerns Agent Tesla, an information-stealing malware family. Confirm that the challenge and its required files are currently available before beginning.

## Watch

1. **Malware analysis case study — From phishing campaign to reflective loader**  
   [YouTube video](https://www.youtube.com/watch?v=GlDCDxNOT1c)  
   Focus: following an attack chain from initial phishing through script execution, in-memory loading and command-and-control activity.

2. **John Hammond — Malware analysis / career discussion**  
   [YouTube video](https://www.youtube.com/watch?v=sBuxwMAfGnI)  
   Focus: what malware analysis work involves and how a practitioner approaches it.

## Daily schedule

### Day 1 — Understand the malware-analysis role
- Watch the John Hammond discussion.
- Read the AgentTesla challenge scenario.
- Learn the distinction between static analysis (examining a file without running it) and dynamic analysis (observing it in a controlled environment).
- Write down what you want to find out about the sample.

**Deliverable:** A malware-analysis question list.

### Day 2 — Follow a real-world analysis
- Watch the phishing-to-reflective-loader case study.
- Draw the high-level execution chain: initial file or link → script / loader → payload → external communication.
- Note which observations come from process, file, registry and network telemetry.

**Deliverable:** A simple malware execution-flow diagram.

### Day 3 — Start AgentTesla
- Open the named challenge.
- Read its instructions and inspect the supplied evidence in the provided lab.
- Attempt the questions independently.
- Record the observed process, file, registry and network indicators.

**Deliverable:** Initial behaviour notes.

### Day 4 — Follow the official analysis
- Use the AgentTesla walkthrough to understand the analysis steps.
- Follow the documented unpacking / component-identification process in the supplied environment.
- Identify the malware's information-stealing and persistence behaviour.
- Do not download or execute a sample outside the lab.

**Deliverable:** Process and behaviour summary.

### Day 5 — Complete and reflect
- Finish the challenge.
- Review the official walkthrough.
- Produce a concise malware behaviour report with execution flow, persistence, network indicators and likely objectives.
- Complete the weekly reflection.

**Deliverable:** Malware analysis report.

## Tools and concepts you may encounter

Detect It Easy, Procmon, process trees, executable packing, strings, registry changes, persistence, network indicators, command-and-control and MITRE ATT&CK.

## Weekly reflection

Rate from 1 to 5:

- I enjoyed understanding the behaviour of one suspicious program.
- I enjoyed comparing static clues with observed runtime behaviour.
- I wanted to investigate how the malware implemented its behaviour.
- I can imagine analysing suspicious files as a regular job.
- I preferred this focused program-level investigation to the wider system investigation in Week 1.

**Career reality to investigate:** Malware analysts may work in threat research, security vendors, incident response firms, government cyber agencies or specialised intelligence teams. Dedicated roles are more specialised than general SOC / DFIR positions.

---

# Week 3 — Reverse Engineering

## The job scenario

You receive a compiled program without source code or documentation. You need to work out how it operates by inspecting its functions, control flow, conditions and data.

**The central question:** *How does this program work internally, and what logic determines its behaviour?*

## Exact practical assignment

**Portland State University — Ghidra crackme1 and crackme2**

- [Exact exercise and walkthrough](https://web.cecs.pdx.edu/~dmcgrath/courses/F26/malware/ghidra_crackme_walkthrough.html)
- [Ghidra official download](https://ghidra-sre.org/)

The exercise provides the compiled binaries `crackme1` and `crackme2` and walks through static analysis. The second binary has symbols removed, making it a useful next step after the first. Use the binaries supplied by the course page, not files from an unrelated download site.

## Watch

1. **Ghidra tutorial — Getting started with reverse engineering**  
   [YouTube video](https://www.youtube.com/watch?v=OFAxXXcLXbc)  
   Focus: importing a binary, analysis, functions, decompiler and navigation.

2. **Ghidra / Stuxnet analysis demonstration**  
   [YouTube video](https://www.youtube.com/watch?v=TJhfnItRVOA)  
   Focus: see how a reverse-engineering tool is used in a more complex malware investigation. Treat this as a demonstration, not a tutorial you must reproduce.

## Daily schedule

### Day 1 — Understand the reverse-engineering workflow
- Install Ghidra from its official site.
- Watch the introductory Ghidra video.
- Learn the difference between a binary, disassembly, decompiler output, function, cross-reference and control-flow graph.
- Read the PSU exercise instructions and download the supplied `crackme1` and `crackme2` binaries.

**Deliverable:** A short glossary of the terms above and a working Ghidra installation.

### Day 2 — Analyse crackme1
- Open `crackme1` in Ghidra and run the standard analysis.
- Follow the PSU walkthrough's first-binary section.
- Locate the main function and inspect the password-checking logic.
- Follow the functions `check_prefix`, `sum_bytes`, `check_body` and `scramble` as described in the exercise.
- Record how the program decides whether the input is accepted.

**Deliverable:** A control-flow diagram and explanation of the password-checking logic.

### Day 3 — Understand the conditions and data flow
- Revisit the relevant functions in Ghidra.
- Follow the conditions and branches that affect execution.
- Identify the important variables and transformations.
- Compare the decompiler output with the walkthrough's explanation.

**Deliverable:** An annotated function / decision-flow diagram.

### Day 4 — Analyse crackme2
- Open `crackme2` in Ghidra.
- Follow the walkthrough's stripped-binary section.
- Observe how the analysis changes when symbol names are absent.
- Identify the main logic and the password-checking path.

**Deliverable:** Notes explaining how you located the important logic without symbols.

### Day 5 — Review and reflect
- Watch the Stuxnet demonstration to see a more advanced use of reverse engineering.
- Review your two crackme analyses.
- Write a short explanation of how each binary makes its decision.
- Complete the weekly reflection.

**Deliverable:** A small reverse-engineering case report.

## Tools and concepts you may encounter

Ghidra, decompiler, disassembly, function graphs, cross-references, symbols, stripped binaries, conditions, branches, registers and basic assembly concepts.

## Safety and scope

The crackme exercises are intended for reverse-engineering practice. Do not substitute unknown malware samples. This week is about static analysis of the supplied benign programs.

## Weekly reflection

Rate from 1 to 5:

- I enjoyed understanding a program without its source code.
- I enjoyed following functions, conditions and control flow.
- I found the decompiler and disassembly interesting rather than merely frustrating.
- I wanted to understand more about assembly and program internals.
- I can imagine doing binary analysis or reverse engineering as a regular job.

**Career reality to investigate:** Reverse engineering is used in malware research, vulnerability research, software security, firmware / embedded security and exploit development. Dedicated roles are relatively specialised and usually require deeper programming, operating-system and architecture knowledge.

---

# Week 4 — Red Team / Penetration Testing

## The job scenario

You have written authorisation to test a target environment. You need to discover exposed services, identify weaknesses, validate exploitation, obtain access and demonstrate impact within the agreed scope.

**The central question:** *Can I find and exploit a weakness to achieve an objective?*

## Exact practical assignment

**Hack The Box — Lame**

- [Machine page](https://app.hackthebox.com/machines/Lame)
- [HackerSploit written walkthrough](https://hackersploit.org/hackthebox-lame-walkthrough/)

Lame is a classic retired Hack The Box Linux machine. Check current account / subscription requirements and machine availability before starting.

## Watch

1. **The Cyber Mentor — Pentesting for n00bs: Lame**  
   [YouTube video](https://www.youtube.com/watch?v=ntBkyid_u8Y)  
   Focus: reconnaissance, service enumeration, exploitation and post-exploitation.

2. **TCM Security Academy**  
   [YouTube channel](https://www.youtube.com/@TCMSecurityAcademy)  
   Use its penetration-testing methodology and career videos to understand professional testing beyond CTFs.

## Daily schedule

### Day 1 — Understand the engagement
- Watch the relevant TCM Security career / methodology material.
- Read the Lame machine page.
- Understand the difference between a CTF, a penetration test and a red-team engagement.
- Review the target scope and rules.

**Deliverable:** A short scope and testing-method note.

### Day 2 — Reconnaissance and enumeration
- Start the Lame machine.
- Watch the opening section of the Cyber Mentor walkthrough.
- Perform the initial Nmap scan yourself.
- Identify exposed services and research what they reveal.
- Record the evidence rather than copying commands without understanding them.

**Deliverable:** Service and enumeration notes.

### Day 3 — Identify the attack path
- Investigate the exposed services.
- Try to identify the weakness independently.
- Consult the walkthrough when blocked.
- Explain why the identified weakness matters.

**Deliverable:** A documented vulnerability and proposed attack path.

### Day 4 — Exploitation and post-exploitation
- Follow the walkthrough's exploitation section.
- Reproduce the steps in the authorised HTB environment.
- Understand how initial access is achieved and how privilege escalation works.
- Record the evidence of access and the impact.

**Deliverable:** An attack-path diagram.

### Day 5 — Report and reflect
- Read the written HackerSploit walkthrough.
- Review the full attack path.
- Write a short penetration-test report: scope, finding, evidence, impact and remediation.
- Complete the weekly reflection.

**Deliverable:** A concise penetration-test report.

## Tools and concepts you may encounter

Nmap, SMB enumeration, service fingerprinting, vulnerability research, Metasploit, Linux privilege escalation and penetration-test reporting.

## Safety and scope

Only attack the HTB machine while it is assigned to you and within the platform's rules. Do not reuse the techniques against systems without explicit authorisation.

## Weekly reflection

Rate from 1 to 5:

- I enjoyed discovering exposed services and weaknesses.
- I enjoyed trying different attack hypotheses.
- I enjoyed exploitation and post-exploitation.
- I preferred actively testing a system to investigating an existing incident.
- I can imagine performing penetration tests as a regular job.

**Career reality to investigate:** Penetration testers work for consultancies, security vendors, internal security teams and specialist red teams. Red-team roles can require broader adversary tradecraft and operational discipline than entry-level penetration testing.

---

# Week 5 — Threat Hunting / Detection Engineering

## The job scenario

A company has suffered a ransomware incident. You have endpoint telemetry and Sysmon logs, but no single alert explains the full attack. You need to search the data, identify suspicious activity, correlate events and reconstruct what the attacker did.

**The central question:** *What attacker behaviour can I find in the telemetry, and how could I detect it reliably?*

## Exact practical assignment

**CyberDefenders — REvil - GOLD SOUTHFIELD**

- [Challenge page](https://cyberdefenders.org/blueteam-ctf-challenges/revil-gold-southfield/)
- [Official walkthrough](https://cyberdefenders.org/walkthroughs/revil-gold-southfield/)
- [Additional community write-up](https://hallibut.github.io/posts/cyber-defenders-revil-gold-southfield/)

This case uses Sysmon telemetry and Elastic SIEM to investigate ransomware activity. Check current lab access requirements before starting.

## Watch

1. **CyberDefenders — Elastic SIEM Log4Shell investigation**  
   [YouTube video](https://www.youtube.com/watch?v=9-EY5tYUfpA)  
   Focus: investigating a compromise with SIEM queries, process activity and attacker behaviour.

2. **13Cubed**  
   [YouTube channel](https://www.youtube.com/@13Cubed)  
   Select a Windows event-log / threat-hunting investigation episode. Focus on the reasoning and evidence correlation, not merely the tool interface.

## Daily schedule

### Day 1 — Understand threat hunting
- Watch the Elastic SIEM investigation.
- Understand the difference between alert triage, incident response, threat hunting and detection engineering.
- Read the REvil challenge scenario.
- Identify the data source and the questions the investigation should answer.

**Deliverable:** A hunting hypothesis and question list.

### Day 2 — Understand the telemetry
- Review the supplied Sysmon data and the challenge instructions.
- Learn what process creation, parent-child relationships, command lines and network events can reveal.
- Identify which events could help reconstruct ransomware execution.

**Deliverable:** A data-source and event-type reference sheet.

### Day 3 — Start REvil independently
- Open the challenge.
- Investigate the supplied telemetry in the provided environment.
- Identify the ransom note and suspicious process activity.
- Attempt the challenge questions.

**Deliverable:** Initial findings and process timeline.

### Day 4 — Follow the investigation
- Use the official walkthrough to understand the query and analysis steps.
- Trace the process responsible for encryption.
- Investigate privilege escalation, recovery sabotage and command-and-control indicators where supported by the evidence.
- Compare your findings with the community write-up.

**Deliverable:** An attacker-activity timeline and evidence table.

### Day 5 — Detection and reflection
- Complete the challenge.
- Choose one observed behaviour and describe how you would detect it.
- If appropriate, express the detection as a Sigma-style rule or a written detection specification. Do not claim a rule is production-ready without testing it.
- Complete the weekly reflection.

**Deliverable:** A threat-hunting report and one detection specification.

## Tools and concepts you may encounter

Elastic SIEM, Kibana, Sysmon, process trees, event correlation, ransomware behaviour, MITRE ATT&CK, detection logic and false positives.

## Weekly reflection

Rate from 1 to 5:

- I enjoyed searching telemetry for suspicious behaviour.
- I enjoyed forming hypotheses and testing them with evidence.
- I enjoyed correlating events across time and processes.
- I enjoyed turning an investigation into a reusable detection.
- I can imagine doing threat hunting or detection engineering as a regular job.

**Career reality to investigate:** Threat hunters and detection engineers work in SOCs, managed security providers, internal security teams, security vendors and incident response organisations. These roles combine investigation, telemetry knowledge and detection logic.

---

# End-of-programme comparison

Do not choose a career based only on which exercise was easiest. Consider enjoyment, curiosity, willingness to build deeper skills, and realistic job opportunities.

## Scorecard

Rate each discipline from 1 (not appealing) to 5 (very appealing).

| Discipline | Enjoyed the work | Wanted to learn more | Could see myself doing it daily | Practical exercise completed |
|---|---:|---:|---:|---|
| DFIR / Incident Response |  |  |  |  |
| Malware Analysis |  |  |  |  |
| Reverse Engineering |  |  |  |  |
| Red Team / Penetration Testing |  |  |  |  |
| Threat Hunting / Detection Engineering |  |  |  |  |

## Questions to answer

1. Which activity made me lose track of time?
2. Which activity made me curious enough to research beyond the assignment?
3. Which activity did I enjoy even when I got stuck?
4. Which activity did I dislike, even when I was making progress?
5. Did I prefer investigating a whole system, one suspicious program, or a program's internal logic?
6. Did I prefer discovering weaknesses proactively or investigating evidence after suspicious activity?
7. Which two disciplines would I willingly study for another three months?

## Career decision guidance

- **DFIR + Threat Hunting:** A strong investigation / detection-oriented combination.
- **Malware Analysis + Reverse Engineering:** A specialist program-analysis / threat-research combination.
- **Red Team + Reverse Engineering:** A technically demanding offensive-security / vulnerability-research combination.
- **DFIR + Malware Analysis:** A useful incident-investigation and malware-investigation combination.
- **Any technical track + Security Architecture:** A possible longer-term route, if you also build design, requirements, threat-modelling and architecture experience.

These combinations are possibilities, not mandatory career ladders. You can remain a technical specialist; you do not have to move into architecture.

## Important note about links and availability

Training-platform URLs, challenge access tiers, videos and subscription entitlements can change. Check each official challenge page before paying for a subscription. The linked walkthroughs are learning aids; where a walkthrough is unavailable, do not replace the assignment with an arbitrary challenge. Reconfirm the exact exercise first.
