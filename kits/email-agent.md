# 📧 Email Agent Kit

> **Slug:** `email-agent`
> **Emoji:** 📧
> **Tagline:** "Everything your agent needs to own the inbox."
> **Category:** `productivity`
> **Tags:** `email`, `communication`, `inbox-management`, `productivity`, `triage`, `drafting`

---

## Description

The Email Agent Kit turns an AI agent into a full-service email operations center. It handles the entire lifecycle: fetching mail, triaging by priority, summarizing threads, drafting replies, tracking follow-ups, managing subscriptions, extracting calendar events, and building daily digests.

This isn't a "check my email" toy — it's a complete inbox management system. The agent reads everything, understands what matters, knows who's important, and keeps the human focused on the emails that actually need their brain.

---

## Core Tools (installed by default)

### 1. `imap-connector` — IMAP/SMTP Email Transport
**What it does:** Connects to any email account via IMAP (read) and SMTP (send). Supports OAuth2 (Gmail, Outlook) and app passwords. Handles folders, flags, search, attachments, and MIME parsing.
**Why it's core:** This is the pipe. Without it, the agent can't read or send email. Supports virtually every email provider.
**Config hint:** `{ "imap": { "host": "imap.gmail.com", "port": 993, "tls": true }, "smtp": { "host": "smtp.gmail.com", "port": 587, "starttls": true }, "auth": "oauth2" }`

### 2. `gmail-api` — Gmail-Specific API Client
**What it does:** Uses the Gmail REST API for Gmail accounts — faster than IMAP, supports labels, threads, push notifications (pub/sub), and batch operations. Handles Gmail-specific features like categories (Primary, Social, Promotions).
**Why it's core:** Gmail is 30%+ of all email. The API is dramatically better than IMAP for Gmail accounts — real-time push, thread-native, label operations. If you have Gmail, this is the primary transport; imap-connector is the fallback for everything else.
**Config hint:** `{ "credentials": "$GMAIL_CREDENTIALS_PATH", "scopes": ["gmail.modify", "gmail.send"], "pushTopic": "projects/my-project/topics/gmail-push" }`

### 3. `email-summarizer` — Thread & Message Summarizer
**What it does:** Generates concise summaries of individual emails and entire threads. Extracts key points, action items, decisions made, and questions asked. Handles forwarded chains, inline replies, and messy quoting.
**Why it's core:** Nobody reads every email. The agent needs to distill a 47-message thread into "They agreed on the March deadline. You need to confirm the budget by Friday."
**Config hint:** `{ "maxSummaryLength": 200, "extractActionItems": true, "extractDeadlines": true, "language": "en" }`

### 4. `priority-scorer` — Email Urgency & Importance Ranker
**What it does:** Scores each email 1-10 on urgency and importance using signals: sender relationship, subject keywords, time sensitivity, reply expectations, CC vs TO, thread activity, and content analysis. Learns from human feedback.
**Why it's core:** The whole point is knowing what to surface. "Your CEO replied to your proposal" = 10. "Weekly newsletter from a blog" = 2. Without scoring, the agent is just a dumb pipe.
**Config hint:** `{ "vipSenders": ["boss@company.com", "spouse@personal.com"], "urgentKeywords": ["urgent", "asap", "deadline", "action required"], "defaultThreshold": 6 }`

### 5. `reply-drafter` — Contextual Reply Generator
**What it does:** Drafts replies based on thread context, user's writing style (learned from sent mail), and explicit instructions. Supports tone adjustment (formal, casual, friendly, firm). Generates the draft — never sends without approval.
**Why it's core:** Drafting replies is the #1 time sink. The agent should have a reply ready before the human even reads the email. They review, tweak, send.
**Config hint:** `{ "defaultTone": "professional", "signatureFile": "$SIGNATURE_PATH", "maxDraftLength": 500, "alwaysDraft": false, "autoSend": false }`

### 6. `contact-resolver` — Sender Identity & Relationship Lookup
**What it does:** Resolves email addresses to known contacts with context: name, title, company, relationship (boss, client, friend, stranger), last interaction date, communication frequency. Builds a contact graph over time.
**Why it's core:** "Who is this person?" is the first question for any email. Knowing sender context changes everything about how to prioritize and respond.
**Config hint:** `{ "sources": ["contacts-api", "sent-mail-history", "calendar"], "enrichExternal": false }`

### 7. `spam-phishing-classifier` — Junk & Threat Filter
**What it does:** Classifies emails as legitimate, spam, phishing, or scam. Analyzes headers (SPF/DKIM/DMARC), content patterns, link destinations, sender reputation, and urgency manipulation tactics. Quarantines threats.
**Why it's core:** The agent processes ALL incoming email — it must be able to identify and discard junk before wasting time summarizing or scoring it. Also catches sophisticated phishing that gets past provider filters.
**Config hint:** `{ "action": "quarantine", "reportPhishing": true, "allowList": ["*@company.com"], "strictMode": false }`

---

## Optional Tools (pick what you need)

### `newsletter-separator` — Newsletter vs Important Email Sorter
**Use case:** Identifies newsletters, marketing emails, and automated notifications. Separates them from human-written messages. Can batch newsletters into a daily/weekly digest instead of interrupting one-by-one.
**Config hint:** `{ "digestFrequency": "daily", "digestTime": "08:00", "autoArchive": true }`

### `unsubscribe-manager` — Subscription Cleanup
**Use case:** Finds all mailing lists and newsletters the human is subscribed to. Presents a list with frequency and last-read stats. Can unsubscribe via List-Unsubscribe headers or by navigating unsubscribe links. "You haven't opened this newsletter in 6 months — unsubscribe?"
**Config hint:** `{ "autoSuggestAfterIgnored": 5, "neverUnsubscribe": ["important-alerts@bank.com"] }`

### `calendar-extractor` — Event Detection & Sync
**Use case:** Scans emails for dates, times, meetings, deadlines, and events. Creates calendar entries automatically (with confirmation). Handles "Let's meet Thursday at 3pm" in natural language and formal .ics attachments.
**Config hint:** `{ "calendarProvider": "google", "requireConfirmation": true, "timezone": "America/Indianapolis" }`

### `attachment-handler` — File Processing & Organization
**Use case:** Downloads, categorizes, and stores email attachments. OCRs PDFs and images. Indexes content for searchability. Organizes by sender, project, or type. "You received an invoice from Acme Corp — saved to /invoices/2026/acme-feb.pdf"
**Config hint:** `{ "storageDir": "~/email-attachments", "ocr": true, "organizeBy": "sender", "maxSizeMb": 50 }`

### `followup-tracker` — Accountability Monitor
**Use case:** Tracks emails you sent that haven't gotten a reply. Tracks promises made to you ("I'll send that by Friday"). Nudges: "You asked Sarah for the Q4 numbers 5 days ago — no reply yet. Want to follow up?"
**Config hint:** `{ "followupAfterDays": 3, "maxReminders": 2, "trackSentReplies": true }`

### `digest-builder` — Daily/Weekly Email Report
**Use case:** Generates a structured summary of email activity: new important messages, pending replies, upcoming deadlines mentioned in email, follow-up status, subscription noise level. Delivered at a set time.
**Config hint:** `{ "schedule": "daily", "deliveryTime": "07:30", "deliveryChannel": "telegram", "includeStats": true }`

### `outlook-exchange` — Microsoft 365 / Exchange Connector
**Use case:** Uses Microsoft Graph API for Outlook/Exchange accounts. Supports shared mailboxes, room bookings, and enterprise features. Alternative to imap-connector for Microsoft environments.
**Config hint:** `{ "tenantId": "$AZURE_TENANT_ID", "clientId": "$AZURE_CLIENT_ID", "scopes": ["Mail.ReadWrite", "Mail.Send"] }`

### `template-engine` — Reusable Reply Templates
**Use case:** Stores and applies reply templates for common scenarios: meeting confirmations, out-of-office, acknowledgments, intro responses. Agent selects the right template and personalizes it.
**Config hint:** `{ "templatesDir": "~/email-templates", "personalizeNames": true }`

### `tone-adjuster` — Writing Style Transformer
**Use case:** Rewrites drafted replies in a different tone. "Make this more formal" / "Soften this rejection" / "Add warmth". Preserves content while shifting style. Useful when the agent's default tone doesn't match the situation.
**Config hint:** `{ "tones": ["formal", "casual", "friendly", "firm", "empathetic", "concise"] }`

---

## Starter Config

```json
{
  "accounts": [
    {
      "name": "primary",
      "provider": "gmail",
      "address": "user@gmail.com",
      "transport": "gmail-api",
      "fallback": "imap"
    }
  ],
  "triage": {
    "checkInterval": "5m",
    "priorityThreshold": 6,
    "autoSummarize": true,
    "autoScore": true,
    "skipSpam": true
  },
  "drafting": {
    "autoSend": false,
    "defaultTone": "professional",
    "requireApproval": true
  },
  "notifications": {
    "highPriority": "immediate",
    "mediumPriority": "digest",
    "lowPriority": "silent",
    "deliveryChannel": "telegram",
    "quietHours": { "start": "22:00", "end": "07:00" }
  },
  "digest": {
    "enabled": true,
    "schedule": "daily",
    "time": "07:30",
    "includeActionItems": true,
    "includeFollowups": true
  },
  "privacy": {
    "storeEmailContent": false,
    "storeMetadataOnly": true,
    "retainDays": 90,
    "neverForward": true
  }
}
```

---

## Role Prompt

```markdown
# SOUL.md — Email Agent

You are an email management agent. You are the gatekeeper between the inbox and the human's attention. Your job is to ensure they only see what matters, always have context, and never miss anything important.

## Your Job
- Continuously triage incoming email: score, summarize, classify
- Surface high-priority messages immediately with context
- Draft replies when the intent is clear or when asked
- Track follow-ups and commitments — yours and theirs
- Keep the inbox organized: archive processed mail, flag action items
- Deliver daily digests summarizing what happened and what's pending

## How You Work
- **Summarize first, details on demand.** The human should get the gist in one line. Full context only when they ask.
- **Never send without approval.** You draft, they review. The only exception is if they explicitly set up auto-send rules (e.g., "auto-acknowledge meeting invites").
- **Learn their world.** Track who matters to them. Their CEO's email gets scored 10. A random recruiter gets a 3. Build this understanding over time from their behavior.
- **Be paranoid about phishing.** If an email looks off — unusual sender, urgent money request, suspicious links — flag it clearly. "⚠️ This looks like phishing: sender domain doesn't match, urgent wire transfer request."
- **Respect boundaries.** Don't read personal email unless explicitly included. Don't summarize sensitive content in shared channels. Don't forward anything.

## Triage Rules
1. **🔴 Priority 8-10** — VIP senders, explicit urgency, deadlines within 24h, direct questions needing response → Notify immediately
2. **🟡 Priority 5-7** — Known contacts, work-related, needs response within days → Include in next digest
3. **🔵 Priority 1-4** — Newsletters, notifications, FYI, CC'd threads → Archive or batch into weekly digest
4. **🗑️ Spam/Phishing** — Quarantine, don't even mention unless it's a sophisticated attempt worth warning about

## Reply Drafting Guidelines
- Match the sender's formality level unless instructed otherwise
- Keep replies concise — most people don't read long emails
- Include relevant context from the thread so the reply stands alone
- Never make commitments on behalf of the human — use tentative language ("I believe X might work, let me confirm")
- Always include the human's signature

## Things You Never Do
- Send emails without approval (unless explicitly auto-approved)
- Forward emails to third parties
- Share email content in public channels
- Delete emails permanently (archive only)
- Respond to phishing/spam
- Unsubscribe from things without asking first
- Make financial commitments or legal statements

## Things You Can Do Freely
- Read, score, and summarize all incoming email
- Organize and label emails
- Archive low-priority processed mail
- Draft replies (saved as drafts, not sent)
- Generate digests and reports
- Flag follow-ups and deadlines
- Quarantine obvious spam
```

---

## Example Workflows

### 1. 📬 Morning Triage
```
Agent checks inbox at 7:30am → 23 new emails overnight
  → Spam classifier: 4 spam, 1 phishing attempt → quarantined
  → Newsletter separator: 6 newsletters → batched into digest section
  → Priority scorer on remaining 12:
      - CEO reply about Q1 budget → Priority 10 → Immediate notification
      - Client asking for project update → Priority 8 → Immediate notification
      - Team standup notes → Priority 5 → Digest
      - 3 GitHub notifications → Priority 3 → Digest
      - HR benefits enrollment reminder → Priority 6 → Digest with flag
  → Builds morning digest:
    "📧 Morning Digest — 23 emails, 2 need your attention:
     🔴 [CEO] Re: Q1 Budget — Approved with changes. Wants revised numbers by Wed.
     🔴 [Acme Corp] Project update request — Sarah asking for timeline.
     🟡 5 others in digest. 6 newsletters batched. 5 junk killed."
```

### 2. ✍️ Reply Drafting with Context
```
Human: "Reply to Sarah's project update email"
  → Agent retrieves thread (4 messages over 2 weeks)
  → Summarizes: "Sarah asked for timeline. Last update was Jan 15 — you said Phase 2 by end of Feb."
  → Checks calendar: team has sprint review on Thursday
  → Drafts reply:
    "Hi Sarah,
     Thanks for checking in. Phase 2 is on track for end of February.
     We have our sprint review Thursday — I'll have more specific 
     deliverables after that. Happy to set up a quick call Friday 
     to walk through everything.
     Best, [signature]"
  → Presents draft to human: "Here's a draft. Tone: professional. Mentions sprint review context from your calendar. Edit or send?"
```

### 3. 🔔 Follow-Up Tracking
```
5 days ago: Human sent email to vendor asking for pricing quote
  → No reply received
  → Follow-up tracker triggers:
    "📌 Follow-up: You asked DataCorp for a pricing quote on Feb 19.
     No reply in 5 days. Their average response time is 2 days.
     Want me to draft a follow-up?"
  → Human says yes
  → Drafts gentle nudge: "Hi Mike, just circling back on the pricing 
     request from last Wednesday. Let me know if you need any 
     additional details from our side. Thanks!"
```

### 4. 🐟 Phishing Detection
```
New email: "URGENT: Wire Transfer Needed — CEO"
  → Spam/phishing classifier:
    ⚠️ SPF: fail (sent from external domain)
    ⚠️ Display name spoofs CEO but email is ceo.company@gmail.com
    ⚠️ Content: urgent wire transfer request, unusual phrasing
    ⚠️ No prior conversation thread
  → Quarantined immediately
  → Alert to human:
    "🚨 Phishing attempt detected and quarantined.
     Spoofed your CEO's name. Requested urgent wire transfer.
     Sender: ceo.company@gmail.com (not your CEO's real address).
     Do NOT respond. Reported as phishing."
```

### 5. 📊 Weekly Digest
```
Sunday 8pm → Weekly digest generation
  → Scans past 7 days:
    "📧 Weekly Email Report — Feb 17-23
     
     📈 Stats: 156 emails received, 23 sent, 34 spam blocked
     
     ⏳ Pending Replies (3):
       - DataCorp pricing quote (5 days, follow-up sent)
       - Legal team contract review (2 days)
       - Design agency proposal feedback (1 day)
     
     📌 Action Items From Email:
       - Submit revised Q1 budget by Wednesday (from CEO)
       - RSVP for team offsite by Friday (from HR)
       - Review PR #847 — mentioned in 3 threads
     
     📰 Newsletter Highlights:
       - TechCrunch: 'AI agents in enterprise email' (relevant)
       - Morning Brew: normal weekly summary
     
     🗑️ Junk Blocked: 34 spam, 2 phishing attempts
     
     💡 Suggestion: You haven't opened 'DailyDevTips' newsletter 
        in 8 weeks. Unsubscribe?"
```

---

## Compatibility Notes

### Platforms
- **Best with:** OpenClaw (native skill integration), any always-on agent runtime
- **Works with:** Any agent platform supporting MCP tools or REST API calls
- **Email providers:** Gmail (API + IMAP), Outlook/M365 (Graph API + IMAP), Yahoo, iCloud, Fastmail, ProtonMail (IMAP bridge), any IMAP/SMTP provider

### Models
- **Recommended:** Claude Sonnet/Opus (excellent at tone-matching, summarization, and nuanced priority scoring), GPT-4o
- **Minimum:** Any model with tool-calling. Summarization quality scales with model capability.
- **Context window:** 32K+ recommended for handling long email threads with full context

### Runtime
- **Continuous operation:** Best as an always-on agent checking mail on an interval
- **On-demand:** Also works as a triggered agent ("check my email and give me a summary")
- **Latency:** Gmail API push notifications enable near-real-time; IMAP polling has 1-5min delay

---

## Dependencies

### Required Before Installing
| Dependency | Why | How to Get It |
|-----------|-----|---------------|
| Email account credentials | Access to the inbox | IMAP: app password. Gmail: OAuth2 credentials via Google Cloud Console. Outlook: Azure AD app registration. |
| OAuth2 credentials (Gmail) | Gmail API access | [Google Cloud Console](https://console.cloud.google.com/) → APIs → Gmail API → Create credentials |
| Notification channel | Where to deliver alerts/digests | Telegram bot token, or any channel the agent can write to |

### Optional Dependencies
| Dependency | For Which Tool | How to Get It |
|-----------|---------------|---------------|
| Azure AD app registration | `outlook-exchange` | [Azure Portal](https://portal.azure.com/) → App registrations |
| Google Calendar API credentials | `calendar-extractor` | Same Google Cloud project as Gmail API |
| OCR engine (Tesseract) | `attachment-handler` with OCR | `brew install tesseract` or system package manager |
| Storage directory with write access | `attachment-handler` | Any local or cloud-synced directory |
| Contact database or API | `contact-resolver` enrichment | Google Contacts API, CardDAV server, or CRM API |
