/**
 * ATS Analysis Engine for CipherSchools Resume Builder
 * 
 * Strict implementation of ATS Compatibility, Keyword Matching (WITH_JD/NO_JD),
 * and Resume Impact formulas for software engineering roles in India.
 */

// Common action verbs for software engineering resumes
export const STRONG_ACTION_VERBS = new Set([
  'engineered', 'architected', 'spearheaded', 'developed', 'optimized',
  'implemented', 'scaled', 'built', 'orchestrated', 'designed', 'accelerated',
  'automated', 'deployed', 'migrated', 'streamlined', 'refactored', 'integrated',
  'reduced', 'increased', 'mentored', 'authored', 'established', 'formulated',
  'configured', 'benchmarked', 'diagnosed', 'executed', 'created', 'solved'
]);

// Weak phrases to penalize
export const WEAK_PHRASES = [
  'responsible for',
  'worked on',
  'helped with',
  'assisted in',
  'tasked with',
  'participated in',
  'handled',
  'was involved in'
];

// Technical skill aliases for accurate matching
export const SKILL_ALIASES = {
  'react': ['reactjs', 'react.js'],
  'react.js': ['react', 'reactjs'],
  'javascript': ['js', 'vanilla javascript'],
  'typescript': ['ts'],
  'node.js': ['node', 'nodejs'],
  'express.js': ['express', 'expressjs'],
  'next.js': ['nextjs', 'next'],
  'vue.js': ['vue', 'vuejs'],
  'angular': ['angular.js', 'angularjs'],
  'golang': ['go'],
  'c++': ['cpp'],
  'c#': ['csharp'],
  'postgresql': ['postgres', 'psql'],
  'mongodb': ['mongo'],
  'aws': ['amazon web services'],
  'gcp': ['google cloud platform'],
  'azure': ['microsoft azure'],
  'docker': ['containerization'],
  'kubernetes': ['k8s'],
  'ci/cd': ['continuous integration', 'cicd'],
  'dsa': ['data structures and algorithms', 'data structures'],
  'sql': ['structured query language', 'relational database']
};

/**
 * Main Analysis Engine function
 */
export function analyzeResume(inputs) {
  const {
    resume_json,
    doc_metrics,
    job_description = '',
    job_meta = ''
  } = inputs;

  const jdText = (job_description || '').trim();
  const hasJd = jdText.length > 0;

  // 1. Validation: JD length check
  if (hasJd && jdText.length < 200) {
    return {
      error: {
        code: 'JD_TOO_SHORT',
        message: 'Job description must be at least 200 characters to run keyword matching.'
      }
    };
  }

  // 2. Validation: Resume structure check
  const hasName = Boolean(resume_json?.name && resume_json.name.trim().length > 0);
  const hasCore = Boolean(
    (resume_json?.education && resume_json.education.length > 0) ||
    (resume_json?.experience && resume_json.experience.length > 0) ||
    (resume_json?.projects && resume_json.projects.length > 0)
  );

  if (!hasName && !hasCore) {
    return {
      error: {
        code: 'NOT_A_RESUME',
        message: 'The uploaded document does not contain recognizable resume sections.'
      }
    };
  }

  const mode = hasJd ? 'WITH_JD' : 'NO_JD';

  // Parse Job Meta (jobTitle | company)
  let parsedJobTitle = null;
  let parsedCompany = null;
  if (job_meta) {
    const parts = job_meta.split('|').map(s => s.trim());
    if (parts[0]) parsedJobTitle = parts[0];
    if (parts[1]) parsedCompany = parts[1];
  } else if (hasJd) {
    // Attempt extracting from first lines of JD
    const firstLines = jdText.slice(0, 150).split('\n');
    parsedJobTitle = firstLines[0]?.slice(0, 50) || 'Software Engineer';
    parsedCompany = 'Target Organization';
  }

  // ─────────────────────────────────────────────────────────────
  // A. ATS COMPATIBILITY CHECKS & SCORE (Weights sum to 23)
  // ─────────────────────────────────────────────────────────────
  const metrics = doc_metrics || {};

  // Check 1: file_format (weight: 3)
  const isFileValid = metrics.file_format === 'pdf' || metrics.file_format === 'docx';
  const fileFormatVal = isFileValid ? (metrics.has_text_layer !== false ? 1 : 0) : 0;
  const check_file_format = {
    id: 'file_format',
    label: 'File Format & Text Layer',
    status: fileFormatVal === 1 ? 'PASS' : 'FAIL',
    value: isFileValid ? 'Standard PDF/DOCX with parseable text layer' : 'Unparseable or scanned image file',
    weight: 3,
    scoreVal: fileFormatVal,
    suggestionId: fileFormatVal === 1 ? null : 'sg_file_fmt'
  };

  // Check 2: layout (weight: 3)
  const cols = metrics.column_count || 1;
  const tables = metrics.table_count || 0;
  const textBoxes = metrics.text_box_count || 0;
  const isLayoutPass = cols === 1 && tables === 0 && textBoxes === 0;
  const layoutVal = isLayoutPass ? 1 : (cols === 1 && (tables + textBoxes) <= 1 ? 0.5 : 0);
  const check_layout = {
    id: 'layout',
    label: 'Single-Column Structure',
    status: layoutVal === 1 ? 'PASS' : (layoutVal === 0.5 ? 'WARN' : 'FAIL'),
    value: `${cols} column(s), ${tables} tables, ${textBoxes} text boxes detected`,
    weight: 3,
    scoreVal: layoutVal,
    suggestionId: layoutVal === 1 ? null : 'sg_layout'
  };

  // Check 3: contact_found (weight: 3)
  const hasEmail = Boolean(resume_json?.email && resume_json.email.includes('@'));
  const hasPhone = Boolean(resume_json?.phone && resume_json.phone.replace(/\D/g, '').length >= 10);
  const notInHeader = metrics.header_footer_contact !== true;
  const contactPass = hasName && hasEmail && hasPhone && notInHeader;
  const contactVal = contactPass ? 1 : ((hasEmail || hasPhone) && notInHeader ? 0.5 : 0);
  const check_contact_found = {
    id: 'contact_found',
    label: 'Contact Information in Body',
    status: contactVal === 1 ? 'PASS' : (contactVal === 0.5 ? 'WARN' : 'FAIL'),
    value: `Name: ${hasName ? 'Yes' : 'No'}, Email: ${hasEmail ? 'Valid' : 'Missing'}, Phone: ${hasPhone ? 'Valid' : 'Missing'}, Header/Footer trap: ${notInHeader ? 'No' : 'Yes'}`,
    weight: 3,
    scoreVal: contactVal,
    suggestionId: contactVal === 1 ? null : 'sg_contact'
  };

  // Check 4: sections_present (weight: 3)
  const hasPersonal = Boolean(hasName);
  const hasEdu = Boolean(resume_json?.education?.length > 0);
  const hasSkills = Boolean(resume_json?.skills && (typeof resume_json.skills === 'string' ? resume_json.skills.length > 5 : resume_json.skills.length > 0));
  const hasExpOrProjects = Boolean((resume_json?.experience?.length > 0) || (resume_json?.projects?.length > 0));
  const sectionsPresentCount = [hasPersonal, hasEdu, hasSkills, hasExpOrProjects].filter(Boolean).length;
  const sectionsVal = sectionsPresentCount === 4 ? 1 : (sectionsPresentCount === 3 ? 0.5 : 0);
  const check_sections_present = {
    id: 'sections_present',
    label: 'Core Sections Present',
    status: sectionsVal === 1 ? 'PASS' : (sectionsVal === 0.5 ? 'WARN' : 'FAIL'),
    value: `${sectionsPresentCount}/4 required core sections recognized`,
    weight: 3,
    scoreVal: sectionsVal,
    suggestionId: sectionsVal === 1 ? null : 'sg_sections'
  };

  // Check 5: headings (weight: 2)
  const unknownHeadings = metrics.headings_unknown_count || 0;
  const headingsVal = unknownHeadings === 0 ? 1 : (unknownHeadings <= 1 ? 0.5 : 0);
  const check_headings = {
    id: 'headings',
    label: 'Standard Section Headings',
    status: headingsVal === 1 ? 'PASS' : (headingsVal === 0.5 ? 'WARN' : 'FAIL'),
    value: `${unknownHeadings} non-standard headings detected`,
    weight: 2,
    scoreVal: headingsVal,
    suggestionId: headingsVal === 1 ? null : 'sg_headings'
  };

  // Check 6: dates (weight: 2)
  const dateConsistency = metrics.date_format_consistent !== false;
  const datedItemsRatio = metrics.dated_items_ratio ?? 0.95;
  const datesVal = (dateConsistency && datedItemsRatio >= 0.9) ? 1 : (datedItemsRatio >= 0.7 ? 0.5 : 0);
  const check_dates = {
    id: 'dates',
    label: 'Consistent Date Formats',
    status: datesVal === 1 ? 'PASS' : (datesVal === 0.5 ? 'WARN' : 'FAIL'),
    value: `Date consistency: ${dateConsistency ? '100%' : 'Mixed formats'}, Dated items: ${Math.round(datedItemsRatio * 100)}%`,
    weight: 2,
    scoreVal: datesVal,
    suggestionId: datesVal === 1 ? null : 'sg_dates'
  };

  // Check 7: graphics (weight: 2)
  const hasImages = metrics.has_images === true;
  const hasIcons = metrics.has_icons === true;
  const graphicsVal = (!hasImages && !hasIcons) ? 1 : (hasIcons && !hasImages ? 0.5 : 0);
  const check_graphics = {
    id: 'graphics',
    label: 'Zero Images & Glyph Traps',
    status: graphicsVal === 1 ? 'PASS' : (graphicsVal === 0.5 ? 'WARN' : 'FAIL'),
    value: hasImages ? 'Embedded images detected' : (hasIcons ? 'Icon glyphs detected in text flow' : '0 images or icons detected'),
    weight: 2,
    scoreVal: graphicsVal,
    suggestionId: graphicsVal === 1 ? null : 'sg_graphics'
  };

  // Check 8: parse_rate (weight: 2)
  const parseRate = metrics.parse_rate ?? 0.96;
  const parseRateVal = parseRate >= 0.90 ? 1 : (parseRate >= 0.75 ? 0.5 : 0);
  const check_parse_rate = {
    id: 'parse_rate',
    label: 'Text Extraction Parse Rate',
    status: parseRateVal === 1 ? 'PASS' : (parseRateVal === 0.5 ? 'WARN' : 'FAIL'),
    value: `${Math.round(parseRate * 100)}% OCR & text layer fidelity`,
    weight: 2,
    scoreVal: parseRateVal,
    suggestionId: parseRateVal === 1 ? null : 'sg_parse'
  };

  // Check 9: fonts (weight: 1)
  const unreadableChars = metrics.has_unreadable_chars === true;
  const fontsVal = unreadableChars ? 0 : 1;
  const check_fonts = {
    id: 'fonts',
    label: 'Standard Fonts & Glyphs',
    status: fontsVal === 1 ? 'PASS' : 'FAIL',
    value: unreadableChars ? 'Custom symbols/characters failed UTF-8 decode' : 'All characters successfully decoded to UTF-8',
    weight: 1,
    scoreVal: fontsVal,
    suggestionId: fontsVal === 1 ? null : 'sg_fonts'
  };

  // Check 10: length (weight: 1)
  const monthsExp = metrics.months_of_experience || (resume_json?.experience?.length ? resume_json.experience.length * 12 : 6);
  const pageCount = metrics.page_count || 1;
  const isLengthGood = monthsExp < 36 ? pageCount === 1 : pageCount <= 2;
  const lengthVal = isLengthGood ? 1 : (pageCount === 2 && monthsExp < 36 ? 0.5 : 0);
  const check_length = {
    id: 'length',
    label: 'Recommended Page Length',
    status: lengthVal === 1 ? 'PASS' : (lengthVal === 0.5 ? 'WARN' : 'FAIL'),
    value: `${pageCount} page(s) for ${monthsExp} months of experience (Target: ${monthsExp < 36 ? '1 page' : 'up to 2 pages'})`,
    weight: 1,
    scoreVal: lengthVal,
    suggestionId: lengthVal === 1 ? null : 'sg_length'
  };

  // Check 11: sensitive_info (weight: 1)
  const sensitiveInfo = metrics.has_sensitive_info === true;
  const sensitiveVal = sensitiveInfo ? 0 : 1;
  const check_sensitive_info = {
    id: 'sensitive_info',
    label: 'Zero Non-Essential Personal Data',
    status: sensitiveVal === 1 ? 'PASS' : 'FAIL',
    value: sensitiveInfo ? 'Photo, DOB, gender, marital status, or ID number found' : 'No photo, DOB, gender, marital status or ID numbers present',
    weight: 1,
    scoreVal: sensitiveVal,
    suggestionId: sensitiveVal === 1 ? null : 'sg_sensitive'
  };

  const atsChecks = [
    check_file_format,
    check_layout,
    check_contact_found,
    check_sections_present,
    check_headings,
    check_dates,
    check_graphics,
    check_parse_rate,
    check_fonts,
    check_length,
    check_sensitive_info
  ];

  const atsWeightSum = atsChecks.reduce((acc, c) => acc + c.weight, 0);
  const atsWeightedPoints = atsChecks.reduce((acc, c) => acc + (c.weight * c.scoreVal), 0);
  const atsScore = Math.round((100 * atsWeightedPoints) / atsWeightSum);

  // ─────────────────────────────────────────────────────────────
  // B. KEYWORD MATCH ENGINE (WITH_JD only)
  // ─────────────────────────────────────────────────────────────
  let keywords = [];
  let keywordSummary = null;
  let keywordMatchCard = null;
  let kwScore = 0;
  let missingRequiredCount = 0;

  // Flatten whole resume text into lower case string for searching
  const resumeFullText = [
    resume_json?.name || '',
    resume_json?.summary || '',
    typeof resume_json?.skills === 'string' ? resume_json.skills : (resume_json?.skills || []).join(' '),
    (resume_json?.experience || []).map(e => `${e.company || ''} ${e.role || ''} ${(e.bullets || []).join(' ')}`).join(' '),
    (resume_json?.projects || []).map(p => `${p.title || ''} ${p.tech || ''} ${(p.bullets || []).join(' ')}`).join(' '),
    (resume_json?.education || []).map(ed => `${ed.degree || ''} ${ed.institution || ''} ${ed.field || ''}`).join(' ')
  ].join(' ').toLowerCase();

  const expAndProjectText = [
    (resume_json?.experience || []).map(e => `${e.company || ''} ${e.role || ''} ${(e.bullets || []).join(' ')}`).join(' '),
    (resume_json?.projects || []).map(p => `${p.title || ''} ${p.tech || ''} ${(p.bullets || []).join(' ')}`).join(' ')
  ].join(' ').toLowerCase();

  if (mode === 'WITH_JD') {
    // Extract keywords from JD
    const jdLower = jdText.toLowerCase();

    // Default expected software skills database
    const TECH_KEYWORDS = [
      { text: 'Java', importance: 'REQUIRED' },
      { text: 'Python', importance: 'REQUIRED' },
      { text: 'React', importance: 'REQUIRED' },
      { text: 'JavaScript', importance: 'REQUIRED' },
      { text: 'TypeScript', importance: 'REQUIRED' },
      { text: 'Node.js', importance: 'REQUIRED' },
      { text: 'Spring Boot', importance: 'REQUIRED' },
      { text: 'SQL', importance: 'REQUIRED' },
      { text: 'DSA', importance: 'REQUIRED' },
      { text: 'Data Structures', importance: 'REQUIRED' },
      { text: 'Algorithms', importance: 'REQUIRED' },
      { text: 'System Design', importance: 'PREFERRED' },
      { text: 'PostgreSQL', importance: 'PREFERRED' },
      { text: 'MongoDB', importance: 'PREFERRED' },
      { text: 'Docker', importance: 'PREFERRED' },
      { text: 'Kubernetes', importance: 'PREFERRED' },
      { text: 'AWS', importance: 'PREFERRED' },
      { text: 'REST APIs', importance: 'REQUIRED' },
      { text: 'Microservices', importance: 'PREFERRED' },
      { text: 'Git', importance: 'REQUIRED' },
      { text: 'CI/CD', importance: 'PREFERRED' },
      { text: 'Kafka', importance: 'PREFERRED' },
      { text: 'Redis', importance: 'PREFERRED' },
      { text: 'GraphQL', importance: 'PREFERRED' },
      { text: 'Next.js', importance: 'PREFERRED' }
    ];

    // Detect which keywords are present in the JD
    const extractedFromJd = TECH_KEYWORDS.filter(k => {
      const kw = k.text.toLowerCase();
      return jdLower.includes(kw) || (SKILL_ALIASES[kw] && SKILL_ALIASES[kw].some(alias => jdLower.includes(alias)));
    });

    // If JD is specific, use extracted, else fallback to relevant software keywords
    const effectiveKeywords = extractedFromJd.length >= 6 ? extractedFromJd : TECH_KEYWORDS.slice(0, 14);

    let matchedCount = 0;
    missingRequiredCount = 0;
    let reqCount = 0;
    let reqMatched = 0;
    let prefCount = 0;
    let prefMatched = 0;
    let reqUsedInExpCount = 0;

    keywords = effectiveKeywords.map(k => {
      const kwLower = k.text.toLowerCase();
      const aliases = SKILL_ALIASES[kwLower] || [];

      // Check occurrences
      // Rule: Related skill is not match (Java != JavaScript)
      let count = 0;
      let matchType = 'NONE';

      // Exact match check with boundary
      const exactRegex = new RegExp(`\\b${escapeRegExp(kwLower)}\\b`, 'gi');
      const exactMatches = resumeFullText.match(exactRegex);
      if (exactMatches) {
        count += exactMatches.length;
        matchType = 'EXACT';
      } else {
        // Alias match
        for (const alias of aliases) {
          const aliasRegex = new RegExp(`\\b${escapeRegExp(alias)}\\b`, 'gi');
          const aliasMatches = resumeFullText.match(aliasRegex);
          if (aliasMatches) {
            count += aliasMatches.length;
            matchType = 'ALIAS';
            break;
          }
        }
      }

      let status = 'MISSING';
      if (count > 5) {
        status = 'OVERUSED';
      } else if (count > 0) {
        status = 'MATCHED';
      }

      if (status !== 'MISSING') {
        matchedCount++;
      }

      if (k.importance === 'REQUIRED') {
        reqCount++;
        if (status !== 'MISSING') {
          reqMatched++;
          // Check if used in experience or projects
          if (expAndProjectText.includes(kwLower) || aliases.some(a => expAndProjectText.includes(a))) {
            reqUsedInExpCount++;
          }
        } else {
          missingRequiredCount++;
        }
      } else if (k.importance === 'PREFERRED') {
        prefCount++;
        if (status !== 'MISSING') prefMatched++;
      }

      // Where found
      const foundIn = [];
      if (resume_json?.skills && (typeof resume_json.skills === 'string' ? resume_json.skills.toLowerCase().includes(kwLower) : resume_json.skills.some(s => s.toLowerCase().includes(kwLower)))) {
        foundIn.push('Skills');
      }
      if (expAndProjectText.includes(kwLower)) {
        foundIn.push('Experience/Projects');
      }

      return {
        text: k.text,
        status,
        importance: k.importance,
        matchType,
        count,
        foundIn: foundIn.length > 0 ? foundIn.join(', ') : 'Not found',
        addTo: status === 'MISSING' ? (k.importance === 'REQUIRED' ? 'Skills & Projects' : 'Skills') : null
      };
    });

    const reqCoverage = reqCount > 0 ? reqMatched / reqCount : 1;
    const prefCoverage = prefCount > 0 ? prefMatched / prefCount : 1;
    const titleMatch = parsedJobTitle && resumeFullText.includes(parsedJobTitle.toLowerCase().split(' ')[0]) ? 1 : 0.6;
    const expMet = 1; // full credit if met or freshers
    const degMet = resume_json?.education?.length > 0 ? 1 : 0.5;
    const reqExpShare = reqMatched > 0 ? reqUsedInExpCount / reqMatched : 0.8;

    kwScore = Math.round(100 * (
      0.55 * reqCoverage +
      0.15 * prefCoverage +
      0.10 * titleMatch +
      0.10 * expMet +
      0.05 * degMet +
      0.05 * reqExpShare
    ));

    keywordSummary = {
      matched: matchedCount,
      total: keywords.length,
      missingRequired: missingRequiredCount
    };

    keywordMatchCard = {
      state: 'ACTIVE',
      score: kwScore,
      band: getScoreBand(kwScore),
      passed: matchedCount,
      total: keywords.length,
      stat: `${matchedCount}/${keywords.length} keywords matched (${reqMatched}/${reqCount} required)`,
      topIssue: missingRequiredCount > 0 ? `Missing ${missingRequiredCount} required skill keywords` : null,
      checks: [
        { id: 'required_skills', label: 'Required Skills Match', status: reqCoverage >= 0.8 ? 'PASS' : (reqCoverage >= 0.5 ? 'WARN' : 'FAIL'), value: `${reqMatched}/${reqCount} required skills present` },
        { id: 'preferred_skills', label: 'Preferred Skills Match', status: prefCoverage >= 0.6 ? 'PASS' : (prefCoverage >= 0.3 ? 'WARN' : 'FAIL'), value: `${prefMatched}/${prefCount} preferred skills present` },
        { id: 'title_match', label: 'Target Job Title Alignment', status: titleMatch >= 0.8 ? 'PASS' : 'WARN', value: parsedJobTitle ? `Aligned with "${parsedJobTitle}"` : 'General software title match' },
        { id: 'keyword_placement', label: 'Skills Backed in Bullets', status: reqExpShare >= 0.7 ? 'PASS' : 'WARN', value: `${Math.round(reqExpShare * 100)}% of matched required skills validated in experience/projects` }
      ]
    };
  } else {
    // Mode NO_JD specification compliance
    keywordMatchCard = {
      state: 'LOCKED',
      score: null,
      band: null,
      passed: 0,
      total: 0,
      stat: null,
      topIssue: null,
      checks: []
    };
    keywordSummary = null;
    keywords = [];
    parsedJobTitle = null;
    parsedCompany = null;
  }

  // ─────────────────────────────────────────────────────────────
  // C. RESUME IMPACT CHECKS & SCORE
  // ─────────────────────────────────────────────────────────────
  const allBullets = [
    ...(resume_json?.experience || []).flatMap(e => e.bullets || []),
    ...(resume_json?.projects || []).flatMap(p => p.bullets || [])
  ];

  const totalBullets = allBullets.length || 1;

  // 1. Metrics share (bullets with numbers/quantified stats)
  const metricRegex = /\d+(?:[.,]\d+)?%?|\b(?:k|m|cr|lakh|ms|x)\b/i;
  const metricBulletsCount = allBullets.filter(b => metricRegex.test(b)).length;
  const metricShare = metricBulletsCount / totalBullets;
  const metricsVal = metricShare >= 0.5 ? 1 : (metricShare >= 0.25 ? 0.5 : 0);

  // 2. Action verbs (opening with strong verb)
  const openingVerbCount = allBullets.filter(b => {
    const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
    return firstWord && STRONG_ACTION_VERBS.has(firstWord);
  }).length;
  const actionVerbShare = openingVerbCount / totalBullets;
  const actionVerbVal = actionVerbShare >= 0.8 ? 1 : (actionVerbShare >= 0.6 ? 0.5 : 0);

  // 3. Weak phrases
  let weakPhrasesCount = 0;
  WEAK_PHRASES.forEach(wp => {
    const regex = new RegExp(`\\b${escapeRegExp(wp)}\\b`, 'gi');
    const matches = resumeFullText.match(regex);
    if (matches) weakPhrasesCount += matches.length;
  });
  const weakPhrasesVal = weakPhrasesCount === 0 ? 1 : (weakPhrasesCount <= 2 ? 0.5 : 0);

  // 4. Bullet length (12 to 28 words)
  const bulletsOutOfRange = allBullets.filter(b => {
    const wordCount = b.trim().split(/\s+/).length;
    return wordCount < 12 || wordCount > 28;
  }).length;
  const bulletLengthVal = bulletsOutOfRange === 0 ? 1 : (bulletsOutOfRange <= 2 ? 0.5 : 0);

  // 5. Repetition (opening verb used > 2 times)
  const verbFreq = {};
  allBullets.forEach(b => {
    const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
    if (firstWord) verbFreq[firstWord] = (verbFreq[firstWord] || 0) + 1;
  });
  const hasExcessiveRepetition = Object.values(verbFreq).some(c => c > 2);
  const repetitionVal = !hasExcessiveRepetition ? 1 : 0.5;

  // 6. Skills backed in experience/projects
  const rawSkillsList = typeof resume_json?.skills === 'string'
    ? resume_json.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    : (resume_json?.skills || []).map(s => s.toLowerCase());

  const backedSkillsCount = rawSkillsList.filter(s => expAndProjectText.includes(s)).length;
  const backedSkillShare = rawSkillsList.length > 0 ? backedSkillsCount / rawSkillsList.length : 0.8;
  const backedSkillsVal = backedSkillShare >= 0.8 ? 1 : (backedSkillShare >= 0.6 ? 0.5 : 0);

  // 7. Language / spelling
  const languageIssuesCount = metrics.language_issues_count || 0;
  const languageVal = languageIssuesCount === 0 ? 1 : (languageIssuesCount <= 2 ? 0.5 : 0);

  // 8. Summary quality (40 to 80 words, names target role, no first person)
  const summaryWords = (resume_json?.summary || '').trim().split(/\s+/).filter(Boolean).length;
  const hasFirstPerson = /\b(i|my|me|myself|we|our)\b/i.test(resume_json?.summary || '');
  const summaryQuality = (summaryWords >= 40 && summaryWords <= 80 && !hasFirstPerson) ? 1 : (summaryWords > 20 && !hasFirstPerson ? 0.5 : 0);

  const impactScore = Math.round(100 * (
    0.30 * Math.min(1, metricShare / 0.5) +
    0.20 * actionVerbShare +
    0.15 * backedSkillShare +
    0.10 * (1 - (bulletsOutOfRange / totalBullets)) +
    0.10 * ((weakPhrasesVal + repetitionVal) / 2) +
    0.10 * languageVal +
    0.05 * summaryQuality
  ));

  const impactChecks = [
    { id: 'metrics', label: 'Quantified Metrics in Bullets', status: metricsVal === 1 ? 'PASS' : (metricsVal === 0.5 ? 'WARN' : 'FAIL'), value: `${metricBulletsCount}/${totalBullets} bullets (${Math.round(metricShare * 100)}%) contain measurable metrics` },
    { id: 'action_verbs', label: 'Strong Action Verbs', status: actionVerbVal === 1 ? 'PASS' : (actionVerbVal === 0.5 ? 'WARN' : 'FAIL'), value: `${openingVerbCount}/${totalBullets} bullets (${Math.round(actionVerbShare * 100)}%) open with power verbs` },
    { id: 'weak_phrases', label: 'Zero Passive / Weak Phrasing', status: weakPhrasesVal === 1 ? 'PASS' : 'WARN', value: `${weakPhrasesCount} passive phrases detected (Target: 0)` },
    { id: 'bullet_length', label: 'Optimal Bullet Length (12-28 Words)', status: bulletLengthVal === 1 ? 'PASS' : 'WARN', value: `${bulletsOutOfRange} bullets outside optimal 12-28 word count range` },
    { id: 'skills_backed', label: 'Skills Backed by Project Evidence', status: backedSkillsVal === 1 ? 'PASS' : 'WARN', value: `${backedSkillsCount}/${rawSkillsList.length} listed skills proven in bullet points` },
    { id: 'summary_quality', label: 'Third-Person Professional Summary', status: summaryQuality === 1 ? 'PASS' : (summaryQuality === 0.5 ? 'WARN' : 'FAIL'), value: `${summaryWords} words, ${hasFirstPerson ? 'first-person pronouns detected' : 'clean objective framing'}` }
  ];

  // ─────────────────────────────────────────────────────────────
  // D. OVERALL SCORE CALCULATION
  // ─────────────────────────────────────────────────────────────
  let overallScore = mode === 'WITH_JD'
    ? Math.round(0.30 * atsScore + 0.60 * kwScore + 0.10 * impactScore)
    : Math.round(0.70 * atsScore + 0.30 * impactScore);

  // If file_format fails, overall score capped at 40
  if (fileFormatVal === 0) {
    overallScore = Math.min(40, overallScore);
  }

  const overallBand = getScoreBand(overallScore);

  // Verdict: at most 18 words, strongest fact and biggest gap
  let verdict = '';
  if (mode === 'WITH_JD') {
    if (overallScore >= 85) {
      verdict = 'Single-column structure passes ATS cleanly, with strong keyword alignment for targeted software role.';
    } else if (overallScore >= 70) {
      verdict = 'Good ATS layout fidelity, but missing critical required keywords and quantified project metrics.';
    } else {
      verdict = 'Formatting needs work and core required keywords are missing for this software developer role.';
    }
  } else {
    if (overallScore >= 85) {
      verdict = 'Exceptional single-column ATS parsability with strong technical skills and clean typography.';
    } else if (overallScore >= 70) {
      verdict = 'Solid ATS compatibility score, but resume bullets lack quantifiable numbers and measurable impact metrics.';
    } else {
      verdict = 'Significant formatting and bullet phrasing improvements needed to pass modern employer tracking systems.';
    }
  }

  // ─────────────────────────────────────────────────────────────
  // E. SECTION BY SECTION AUDIT
  // Order: personal, summary, experience, education, skills, projects, certifications, activities, achievements
  // ─────────────────────────────────────────────────────────────
  const sections = [
    {
      key: 'personal',
      title: 'Personal Info & Header',
      status: contactPass ? 'STRONG' : 'NEEDS_WORK',
      score: contactPass ? 95 : 60,
      filled: true,
      required: true,
      issues: contactPass ? 0 : 1,
      stat: `Name, email (${resume_json?.email ? 'valid' : 'missing'}) and phone present`,
      topIssue: contactPass ? null : 'Contact info missing or in header/footer area',
      items: [
        { id: 'sec_personal_1', title: resume_json?.name || 'Contact Header', suggestionIds: contactPass ? [] : ['sg_002'] }
      ]
    },
    {
      key: 'summary',
      title: 'Professional Summary',
      status: resume_json?.summary ? (summaryQuality >= 0.5 ? 'STRONG' : 'NEEDS_WORK') : 'NEEDS_WORK',
      score: resume_json?.summary ? (summaryQuality === 1 ? 90 : 65) : 50,
      filled: Boolean(resume_json?.summary),
      required: false,
      issues: summaryQuality === 1 ? 0 : 1,
      stat: `${summaryWords} words, ${hasFirstPerson ? 'uses first person pronouns' : 'third-person phrasing'}`,
      topIssue: hasFirstPerson ? 'Remove first-person pronouns (I, my, me)' : (summaryWords < 40 ? 'Summary too brief (under 40 words)' : null),
      items: [
        { id: 'sec_summary_1', title: 'Summary Statement', suggestionIds: summaryQuality === 1 ? [] : ['sg_005'] }
      ]
    },
    {
      key: 'experience',
      title: 'Work Experience',
      status: (resume_json?.experience?.length || 0) > 0 ? (metricShare >= 0.35 ? 'STRONG' : 'NEEDS_WORK') : (monthsExp === 0 ? 'NOT_ADDED' : 'WEAK'),
      score: (resume_json?.experience?.length || 0) > 0 ? (metricShare >= 0.35 ? 88 : 65) : (monthsExp === 0 ? null : 45),
      filled: Boolean(resume_json?.experience?.length),
      required: false,
      issues: metricShare < 0.35 ? 1 : 0,
      stat: `${resume_json?.experience?.length || 0} position(s) listed with ${(resume_json?.experience || []).flatMap(e => e.bullets || []).length} bullets`,
      topIssue: metricShare < 0.35 ? 'Add quantifiable numbers and percentages to bullet points' : null,
      items: (resume_json?.experience || []).map((exp, idx) => ({
        id: `sec_exp_${idx + 1}`,
        title: `${exp.role || 'Role'} at ${exp.company || 'Company'}`,
        suggestionIds: metricShare < 0.35 ? ['sg_004'] : []
      }))
    },
    {
      key: 'education',
      title: 'Education',
      status: hasEdu ? 'STRONG' : 'MISSING',
      score: hasEdu ? 92 : 0,
      filled: hasEdu,
      required: true,
      issues: hasEdu ? 0 : 1,
      stat: `${resume_json?.education?.length || 0} academic credential(s) listed`,
      topIssue: hasEdu ? null : 'Missing education section',
      items: (resume_json?.education || []).map((ed, idx) => ({
        id: `sec_edu_${idx + 1}`,
        title: `${ed.degree || 'Degree'}, ${ed.institution || 'University'}`,
        suggestionIds: []
      }))
    },
    {
      key: 'skills',
      title: 'Technical Skills',
      status: hasSkills ? (backedSkillShare >= 0.65 ? 'STRONG' : 'NEEDS_WORK') : 'MISSING',
      score: hasSkills ? (backedSkillShare >= 0.65 ? 90 : 70) : 0,
      filled: hasSkills,
      required: true,
      issues: hasSkills ? (missingRequiredCount > 0 ? 1 : 0) : 1,
      stat: `${rawSkillsList.length} skills listed, ${backedSkillsCount} backed in project bullets`,
      topIssue: missingRequiredCount > 0 ? `Missing ${missingRequiredCount} job required skills` : null,
      items: [
        { id: 'sec_skills_1', title: 'Technical Stack Matrix', suggestionIds: missingRequiredCount > 0 ? ['sg_003'] : [] }
      ]
    },
    {
      key: 'projects',
      title: 'Projects',
      status: (resume_json?.projects?.length || 0) > 0 ? 'STRONG' : (resume_json?.experience?.length ? 'NOT_ADDED' : 'MISSING'),
      score: (resume_json?.projects?.length || 0) > 0 ? 88 : null,
      filled: Boolean(resume_json?.projects?.length),
      required: !resume_json?.experience?.length,
      issues: 0,
      stat: `${resume_json?.projects?.length || 0} software project(s) showcased`,
      topIssue: null,
      items: (resume_json?.projects || []).map((p, idx) => ({
        id: `sec_proj_${idx + 1}`,
        title: p.title || `Project ${idx + 1}`,
        suggestionIds: []
      }))
    },
    {
      key: 'certifications',
      title: 'Certifications',
      status: resume_json?.certifications?.length ? 'STRONG' : 'NOT_ADDED',
      score: resume_json?.certifications?.length ? 85 : null,
      filled: Boolean(resume_json?.certifications?.length),
      required: false,
      issues: 0,
      stat: `${resume_json?.certifications?.length || 0} verified certification(s)`,
      topIssue: null,
      items: (resume_json?.certifications || []).map((c, idx) => ({
        id: `sec_cert_${idx + 1}`,
        title: typeof c === 'string' ? c : c.title,
        suggestionIds: []
      }))
    },
    {
      key: 'activities',
      title: 'Extracurricular & Leadership',
      status: resume_json?.activities?.length ? 'STRONG' : 'NOT_ADDED',
      score: resume_json?.activities?.length ? 80 : null,
      filled: Boolean(resume_json?.activities?.length),
      required: false,
      issues: 0,
      stat: `${resume_json?.activities?.length || 0} activity entry`,
      topIssue: null,
      items: []
    },
    {
      key: 'achievements',
      title: 'Honors & Achievements',
      status: resume_json?.achievements?.length ? 'STRONG' : 'NOT_ADDED',
      score: resume_json?.achievements?.length ? 85 : null,
      filled: Boolean(resume_json?.achievements?.length),
      required: false,
      issues: 0,
      stat: `${resume_json?.achievements?.length || 0} achievement entry`,
      topIssue: null,
      items: []
    }
  ];

  // ─────────────────────────────────────────────────────────────
  // F. ACTIONABLE SUGGESTIONS GENERATION (Sorted by priority then pointsGain, at most 12)
  // ─────────────────────────────────────────────────────────────
  const rawSuggestions = [];

  // Critical suggestions
  if (fileFormatVal === 0) {
    rawSuggestions.push({
      id: 'sg_001',
      title: 'Export resume as clean text-based PDF or DOCX',
      reason: 'Scanned images or files without selectable text cannot be read by ATS parsers.',
      priority: 'CRITICAL',
      card: 'ATS_COMPATIBILITY',
      section: 'file_format',
      itemId: null,
      field: 'file_format',
      pointsGain: 15,
      before: 'Unselectable image or proprietary export',
      after: 'Standard A4 PDF with selectable UTF-8 text layer',
      action: 'CHANGE_TEMPLATE',
      autoFix: true,
      status: 'OPEN'
    });
  }

  if (layoutVal < 1) {
    rawSuggestions.push({
      id: 'sg_002',
      title: 'Switch to a single-column layout with no tables',
      reason: 'Tables and multi-column text boxes cause OCR reading order scramble in Greenhouse and Workday.',
      priority: 'CRITICAL',
      card: 'ATS_COMPATIBILITY',
      section: 'layout',
      itemId: null,
      field: 'layout',
      pointsGain: 12,
      before: 'Multi-column grid with embedded layout tables',
      after: 'Linear single-column semantic flow',
      action: 'CHANGE_TEMPLATE',
      autoFix: true,
      status: 'OPEN'
    });
  }

  if (contactVal < 1) {
    rawSuggestions.push({
      id: 'sg_003',
      title: 'Move email and phone into the main document body',
      reason: 'Parsers frequently discard headers and footers to avoid repeating margins.',
      priority: 'CRITICAL',
      card: 'ATS_COMPATIBILITY',
      section: 'personal',
      itemId: 'sec_personal_1',
      field: 'contact',
      pointsGain: 10,
      before: 'Contact info placed inside page header/footer',
      after: 'Contact block placed directly below candidate name in body',
      action: 'EDIT_FIELD',
      autoFix: true,
      status: 'OPEN'
    });
  }

  // Missing required keywords (IMPORTANT)
  if (mode === 'WITH_JD') {
    const missingReq = keywords.filter(k => k.importance === 'REQUIRED' && k.status === 'MISSING');
    missingReq.slice(0, 3).forEach((mk, idx) => {
      rawSuggestions.push({
        id: `sg_kw_${idx + 1}`,
        title: `Add ${mk.text} if you have hands-on experience`,
        reason: 'Required keywords carry 55% of the keyword match score in recruiter filter screens.',
        priority: 'IMPORTANT',
        card: 'KEYWORD_MATCH',
        section: 'skills',
        itemId: 'sec_skills_1',
        field: 'skills',
        pointsGain: 5,
        before: null,
        after: null,
        action: 'ADD_KEYWORD',
        autoFix: false,
        status: 'OPEN'
      });
    });
  }

  // Resume Impact Suggestions
  if (metricShare < 0.5) {
    rawSuggestions.push({
      id: 'sg_metric_1',
      title: 'Add metrics and numerical results to bullet points',
      reason: 'Recruiters prioritize candidates who quantify engineering impact with percentages or scale metrics.',
      priority: 'IMPORTANT',
      card: 'RESUME_IMPACT',
      section: 'experience',
      itemId: 'sec_exp_1',
      field: 'bullets',
      pointsGain: 4,
      before: 'Improved page performance and optimized application loading times.',
      after: 'Improved page performance by [X]%, reducing load time from [Y]s to [Z]s for [N] users.',
      action: 'REWRITE_TEXT',
      autoFix: false,
      status: 'OPEN'
    });
  }

  if (actionVerbVal < 1) {
    rawSuggestions.push({
      id: 'sg_verb_1',
      title: 'Start every bullet point with a strong action verb',
      reason: 'Weak openings lower impact scoring and blend into generic job descriptions.',
      priority: 'IMPORTANT',
      card: 'RESUME_IMPACT',
      section: 'experience',
      itemId: 'sec_exp_1',
      field: 'bullets',
      pointsGain: 3,
      before: 'Was responsible for building the customer authentication service.',
      after: 'Architected and deployed secure JWT authentication service for 50K+ daily active users.',
      action: 'REWRITE_TEXT',
      autoFix: false,
      status: 'OPEN'
    });
  }

  if (hasFirstPerson) {
    rawSuggestions.push({
      id: 'sg_pronoun_1',
      title: 'Remove first-person pronouns from your summary statement',
      reason: 'ATS and recruiters expect objective third-person framing in technical summaries.',
      priority: 'OPTIONAL',
      card: 'RESUME_IMPACT',
      section: 'summary',
      itemId: 'sec_summary_1',
      field: 'summary',
      pointsGain: 2,
      before: 'I am a passionate software engineer who loves coding in Python and building my apps.',
      after: 'Results-driven software engineer specializing in Python microservices and high-scale cloud systems.',
      action: 'REWRITE_TEXT',
      autoFix: true,
      status: 'OPEN'
    });
  }

  if (bulletLengthVal < 1) {
    rawSuggestions.push({
      id: 'sg_len_1',
      title: 'Refactor bullets to optimal 12-28 word length',
      reason: 'Bullets shorter than 12 words lack context; bullets longer than 28 words lose recruiter attention.',
      priority: 'OPTIONAL',
      card: 'RESUME_IMPACT',
      section: 'experience',
      itemId: null,
      field: 'bullets',
      pointsGain: 2,
      before: null,
      after: null,
      action: 'REWRITE_TEXT',
      autoFix: false,
      status: 'OPEN'
    });
  }

  // Sort by priority (CRITICAL > IMPORTANT > OPTIONAL) then pointsGain
  const priorityOrder = { 'CRITICAL': 3, 'IMPORTANT': 2, 'OPTIONAL': 1 };
  const sortedSuggestions = rawSuggestions
    .sort((a, b) => {
      const pDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      if (pDiff !== 0) return pDiff;
      return (b.pointsGain || 0) - (a.pointsGain || 0);
    })
    .slice(0, 12);

  // Total points available capped at 100 - overallScore
  const maxPointsPossible = Math.max(0, 100 - overallScore);
  const totalSuggestedGain = sortedSuggestions.reduce((acc, s) => acc + s.pointsGain, 0);
  const scale = totalSuggestedGain > maxPointsPossible && totalSuggestedGain > 0
    ? maxPointsPossible / totalSuggestedGain
    : 1;

  const suggestions = sortedSuggestions.map((s, idx) => ({
    ...s,
    id: `sg_${String(idx + 1).padStart(3, '0')}`,
    pointsGain: Math.max(1, Math.round(s.pointsGain * scale))
  }));

  const pointsAvailable = Math.min(
    maxPointsPossible,
    suggestions.reduce((acc, s) => acc + s.pointsGain, 0)
  );

  const potentialScore = Math.min(100, overallScore + pointsAvailable);

  const criticalIssuesCount = suggestions.filter(s => s.priority === 'CRITICAL').length;
  const importantIssuesCount = suggestions.filter(s => s.priority === 'IMPORTANT').length;
  const optionalIssuesCount = suggestions.filter(s => s.priority === 'OPTIONAL').length;

  return {
    overall: {
      score: overallScore,
      band: overallBand,
      verdict,
      mode,
      jobTitle: parsedJobTitle,
      company: parsedCompany,
      potentialScore,
      issues: {
        critical: criticalIssuesCount,
        important: importantIssuesCount,
        optional: optionalIssuesCount
      }
    },
    cards: {
      atsCompatibility: {
        state: 'ACTIVE',
        score: atsScore,
        band: getScoreBand(atsScore),
        passed: atsChecks.filter(c => c.status === 'PASS').length,
        total: atsChecks.length,
        stat: `${atsChecks.filter(c => c.status === 'PASS').length}/${atsChecks.length} checks passed`,
        topIssue: atsChecks.find(c => c.status === 'FAIL')?.label || (atsChecks.find(c => c.status === 'WARN')?.label ? `${atsChecks.find(c => c.status === 'WARN')?.label} warning` : null),
        checks: atsChecks.map(c => ({
          id: c.id,
          label: c.label,
          status: c.status,
          value: c.value,
          suggestionId: c.suggestionId
        }))
      },
      keywordMatch: keywordMatchCard,
      resumeImpact: {
        state: 'ACTIVE',
        score: impactScore,
        band: getScoreBand(impactScore),
        passed: impactChecks.filter(c => c.status === 'PASS').length,
        total: impactChecks.length,
        stat: `${impactChecks.filter(c => c.status === 'PASS').length}/${impactChecks.length} impact criteria met`,
        topIssue: impactChecks.find(c => c.status === 'FAIL')?.label || null,
        checks: impactChecks.map(c => ({
          id: c.id,
          label: c.label,
          status: c.status,
          value: c.value,
          suggestionId: null
        }))
      }
    },
    keywordSummary,
    keywords,
    sections,
    suggestionSummary: {
      total: suggestions.length,
      open: suggestions.length,
      fixed: 0,
      pointsAvailable
    },
    suggestions
  };
}

function getScoreBand(score) {
  if (score >= 90) return 'EXCELLENT';
  if (score >= 80) return 'GOOD';
  if (score >= 60) return 'FAIR';
  return 'NEEDS_WORK';
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─────────────────────────────────────────────────────────────
// PRE-BUILT SAMPLE DATA (For Instant Student & SDE Testing)
// ─────────────────────────────────────────────────────────────
export const SAMPLE_RESUMES = {
  fresher: {
    label: 'Anurag Mishra (Fresher CS Graduate)',
    resume_json: {
      name: 'Anurag Mishra',
      email: 'anurag.mishra2024@gmail.com',
      phone: '+91 98765 43210',
      location: 'New Delhi, India',
      links: ['linkedin.com/in/anurag-mishra', 'github.com/anurag-mishra'],
      summary: 'Computer Science graduate with hands-on experience in full-stack web development, Data Structures, and Algorithms. Proficient in React, Node.js, and Java with 3 production-grade project deployments.',
      education: [
        {
          degree: 'B.Tech in Computer Science & Engineering',
          institution: 'Delhi Technological University (DTU)',
          field: 'Computer Science',
          year: '2020 - 2024',
          score: 'CGPA: 8.6 / 10'
        }
      ],
      experience: [
        {
          company: 'CipherSchools',
          role: 'Software Engineering Intern',
          duration: 'Jan 2024 - Jun 2024',
          bullets: [
            'Engineered interactive coding playground components in React, reducing editor initial load time by 34%.',
            'Integrated RESTful APIs using Node.js and Express to handle real-time code dry-run execution for 15K+ users.',
            'Collaborated with senior engineers using Git and Agile sprints to deploy bug fixes across 8 sprint cycles.'
          ]
        }
      ],
      skills: 'Java, Python, JavaScript, React.js, Node.js, Express.js, SQL, PostgreSQL, MongoDB, Data Structures & Algorithms, Git, REST APIs',
      projects: [
        {
          title: 'Algorithmic Visualizer Platform',
          tech: 'React, TypeScript, Canvas API',
          bullets: [
            'Built real-time visualization tool for sorting and graph pathfinding algorithms with step-by-step execution playback.',
            'Optimized DOM rendering using requestAnimationFrame, maintaining steady 60 FPS animation performance.',
            'Grew open-source adoption to 500+ GitHub stars and 1.2K active monthly visitors.'
          ]
        },
        {
          title: 'Distributed Task Queue System',
          tech: 'Node.js, Redis, Docker',
          bullets: [
            'Designed asynchronous task worker queue processing 2,000 background jobs per minute with automatic retries.',
            'Implemented exponential backoff error handling, ensuring 99.9% task delivery completion rate.'
          ]
        }
      ],
      certifications: [
        { title: 'AWS Certified Cloud Practitioner (2024)' },
        { title: 'HackerRank Problem Solving (Gold Badge - 6 Stars)' }
      ],
      achievements: [
        { title: 'Finalist at Smart India Hackathon (SIH 2023) among 15,000+ national team submissions' },
        { title: 'Solved 450+ LeetCode DSA questions with Top 15% contest rating (1740)' }
      ]
    },
    doc_metrics: {
      file_format: 'pdf',
      has_text_layer: true,
      column_count: 1,
      table_count: 0,
      text_box_count: 0,
      header_footer_contact: false,
      headings_recognized: true,
      headings_unknown_count: 0,
      date_format_consistent: true,
      dated_items_ratio: 1.0,
      has_images: false,
      has_icons: false,
      parse_rate: 0.98,
      has_unreadable_chars: false,
      months_of_experience: 6,
      page_count: 1,
      has_sensitive_info: false,
      language_issues_count: 0
    }
  },
  experienced: {
    label: 'Sanskar Drolia (Senior Full-Stack Engineer)',
    resume_json: {
      name: 'Sanskar Drolia',
      email: 'sanskar.drolia@cipherschools.com',
      phone: '+91 91234 56789',
      location: 'Bengaluru, Karnataka',
      links: ['linkedin.com/in/sanskardrolia', 'github.com/sanskardrolia'],
      summary: 'Results-driven software engineer with 3+ years of experience architecting high-concurrency web applications, microservices, and interactive developer sandboxes. Passionate about distributed cloud systems, React, TypeScript, and database optimization.',
      education: [
        {
          degree: 'B.Tech in Computer Science & Engineering',
          institution: 'National Institute of Technology',
          field: 'Computer Science',
          year: '2019 - 2023',
          score: 'CGPA: 8.9 / 10'
        }
      ],
      experience: [
        {
          company: 'CipherSchools Technologies',
          role: 'Senior Full-Stack Engineer',
          duration: 'Jul 2023 - Present',
          bullets: [
            'Architected and scaled real-time multi-language compiler sandboxes serving 100K+ concurrent learners with sub-50ms latency.',
            'Spearheaded frontend migration to Next.js 15, boosting Google Core Web Vitals and Lighthouse scores by 42%.',
            'Designed distributed PostgreSQL caching layer with Redis, reducing database query overhead by 68% on peak traffic days.',
            'Mentored 4 junior developers and established CI/CD automated test pipelines with 94% code coverage.'
          ]
        },
        {
          company: 'Zenith Cloud Labs',
          role: 'Software Development Engineer',
          duration: 'Jan 2023 - Jun 2023',
          bullets: [
            'Built containerized microservices in Docker and Kubernetes, slashing compute server infrastructure costs by $1,800/month.',
            'Engineered GraphQL query gateway aggregating 12 backend data sources with resilient circuit breaker patterns.'
          ]
        }
      ],
      skills: 'JavaScript, TypeScript, React.js, Next.js, Node.js, Python, PostgreSQL, Redis, Docker, Kubernetes, AWS, GraphQL, DSA, System Design, CI/CD, Git',
      projects: [
        {
          title: 'Cloud Canvas Collaboration Tool',
          tech: 'TypeScript, WebSockets, Redis, Next.js',
          bullets: [
            'Developed real-time canvas whiteboard synchronizing multi-user vector strokes across 50 simultaneous room participants.',
            'Leveraged WebSockets and binary packet serialization to keep networking latency under 20ms.'
          ]
        }
      ],
      certifications: [
        { title: 'AWS Certified Solutions Architect – Associate' }
      ]
    },
    doc_metrics: {
      file_format: 'pdf',
      has_text_layer: true,
      column_count: 1,
      table_count: 0,
      text_box_count: 0,
      header_footer_contact: false,
      headings_recognized: true,
      headings_unknown_count: 0,
      date_format_consistent: true,
      dated_items_ratio: 1.0,
      has_images: false,
      has_icons: false,
      parse_rate: 0.99,
      has_unreadable_chars: false,
      months_of_experience: 28,
      page_count: 1,
      has_sensitive_info: false,
      language_issues_count: 0
    }
  }
};

export const SAMPLE_JOB_DESCRIPTIONS = {
  amazon_sde: {
    label: 'Amazon - Software Development Engineer 1 (SDE 1)',
    meta: 'Software Development Engineer 1 (SDE 1) | Amazon',
    text: `Job Title: Software Development Engineer 1 (SDE 1)
Company: Amazon Web Services (AWS)
Location: Bengaluru, Karnataka, India

About the Job:
Amazon is seeking a talented, passionate Software Development Engineer (SDE 1) to build next-generation distributed cloud services. You will design, build, and deploy high-performance software systems that power millions of customer requests every second.

Key Job Responsibilities:
- Design, build, and maintain scalable, robust services using Java, Python, or TypeScript.
- Implement efficient Data Structures and Algorithms (DSA) to solve complex real-time computational problems.
- Work closely with senior engineers to architect microservices and REST APIs on AWS.
- Write clean, maintainable, and well-tested code following CI/CD and automated unit testing best practices.
- Collaborate with cross-functional teams to diagnose distributed system performance bottlenecks and optimize latency.

Basic Qualifications:
- Bachelor's degree in Computer Science, Computer Engineering, or related technical field (B.Tech / B.E.).
- 0 to 2 years of professional software development experience.
- Strong proficiency in at least one modern programming language: Java, Python, TypeScript, or C++.
- Strong problem-solving skills and solid understanding of Data Structures, Algorithms, and Object-Oriented Design.
- Familiarity with relational databases such as SQL, PostgreSQL, or MySQL.

Preferred Qualifications:
- Experience with Docker, Kubernetes, or containerized deployments.
- Hands-on experience with cloud platforms like AWS (S3, EC2, Lambda, DynamoDB).
- Experience with React, Node.js, or modern frontend frameworks.
- Exposure to distributed streaming architectures such as Kafka or Redis.`
  },
  google_frontend: {
    label: 'Google - Software Engineer, Frontend',
    meta: 'Software Engineer, Frontend | Google',
    text: `Job Title: Software Engineer, Frontend
Company: Google India
Location: Hyderabad / Bengaluru, India

Role Overview:
As a Frontend Software Engineer at Google, you will build user-facing products that impact billions of global users. You will push the boundaries of modern web technologies to craft smooth, responsive, and accessible interactive interfaces.

Responsibilities:
- Build high-performance, responsive web interfaces using JavaScript, TypeScript, React, and modern web standards.
- Collaborate with Product Designers and Backend Engineers to define GraphQL and REST API contracts.
- Optimize frontend rendering pipelines to achieve sub-second Core Web Vitals and Lighthouse metrics.
- Participate in code reviews, automated unit testing, and design documentation.

Minimum Qualifications:
- Bachelor's degree in Computer Science or equivalent practical experience.
- 1+ years of experience with web technologies including HTML5, CSS3, JavaScript, and TypeScript.
- Solid understanding of Data Structures, Algorithms, and browser rendering lifecycles.

Preferred Qualifications:
- Experience with React, Next.js, and state management libraries.
- Experience with performance profiling, WebSockets, and Canvas API.`
  }
};
