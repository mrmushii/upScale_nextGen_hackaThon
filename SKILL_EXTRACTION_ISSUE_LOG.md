# Smart Skill Extraction – Issue Log

**Date:** 2025-01-15  
**Scope:** CV / Profile skill extraction (LLM + heuristic fallback)

---

## 1. LLM Reliability & JSON Safety
- **Issue:** Gemini responses occasionally returned markdown or partial JSON, breaking the UI.
- **Fix:** Wrapped calls with `generateObjectUnified` + strict Zod schema. Added fallback to heuristic when parsing fails.
- **Status:** ✅ Mitigated. Logs include the original error and fallback reasons.

## 2. Resume Text Availability
- **Issue:** Some stored resumes lacked `parsedText`, leading to empty extraction.
- **Fix:** API now validates input length and returns actionable error instructing users to re-upload or provide raw text.
- **Status:** ✅ Mitigated. Future enhancement could re-parse the stored file automatically.

## 3. File Parsing Coverage
- **Issue:** Requirement to support PDF/DOC/DOCX. Existing parser only handled PDFs.
- **Fix:** Added DOCX parsing via `mammoth`. Legacy `.doc` files now return a friendly error suggesting conversion to DOCX/PDF.
- **Status:** ✅ PDF + DOCX supported (text-based). `.doc` handled via explicit messaging.

## 4. Heuristic Dictionary Coverage
- **Issue:** Need deterministic fallback when LLM is unavailable or quota-limited.
- **Fix:** Added configurable dictionary (`lib/skillExtraction/dictionary.ts`) with versioning, plus transparent evidence (“matched terms”).
- **Status:** ✅ Ships with sample entries for skills, tools, and roles. Easy to extend.

## 5. Editable Tags & Persistence
- **Issue:** Extracted tags must be reviewable before persisting to the profile.
- **Fix:** New `SkillExtractionPanel` renders editable chips + role selector. “Apply to Profile” either updates the local profile form (profile page) or persists via PATCH (resume page).
- **Status:** ✅ Users can edit tags, see rationales, and save when ready.

## 6. Transparency & UX Feedback
- **Issue:** Need to show “why detected”, fallback notices, and progress states.
- **Fix:** Panel displays evidence list with source (LLM/Heuristic), fallback badge, and toast notifications.
- **Status:** ✅ Completed.

---

### Known Enhancements
1. **OCR Support:** Image-based PDFs still require manual transcription.
2. **Dictionary Builder:** Future admin UI to manage dictionary entries.
3. **Batch Application:** Ability to push tags to multiple resumes simultaneously.
4. **Usage Limits:** Integrate with existing usage counters to prevent abuse.

---

### Testing Status
- LLM → Success (React/Node/AWS CV).
- LLM → Timeout → Heuristic fallback (forced error).
- DOCX Upload → Parsed successfully (Project Manager CV).
- Profile-only extraction → uses profile snapshot when no resume text.
- UI/UX → Tags editable, evidence scrollable, apply button disables when nothing changed.

---

**Owner:** AI/NLP Engineering  
**Last Updated:** 2025-01-15

