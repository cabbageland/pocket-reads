#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
NOTES_DIR = ROOT / "paper_notes"
OUT_PATH = ROOT / "data" / "content.json"
REPO_NAME = "cabbageland/pocket-reads"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8").replace("\r\n", "\n")


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def clean_md(text: str) -> str:
    text = re.sub(r"\[(.*?)\]\((.*?)\)", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"\*(.*?)\*", r"\1", text)
    text = re.sub(r"^[-*]\s+", "", text, flags=re.M)
    return text.strip()


def split_front_matter(text: str) -> tuple[dict[str, str], str]:
    if not text.startswith("---\n"):
        return {}, text
    parts = text.split("\n---\n", 1)
    if len(parts) != 2:
        return {}, text
    raw_meta = parts[0][4:]
    body = parts[1]
    meta: dict[str, str] = {}
    current_key: str | None = None
    current_lines: list[str] = []
    for line in raw_meta.splitlines():
        if re.match(r"^[A-Za-z0-9_-]+:\s*", line):
            if current_key is not None:
                meta[current_key] = "\n".join(current_lines).strip()
            key, value = line.split(":", 1)
            current_key = key.strip().lower()
            current_lines = [value.strip()]
        elif current_key is not None:
            current_lines.append(line.strip())
    if current_key is not None:
        meta[current_key] = "\n".join(current_lines).strip()
    return meta, body.lstrip("\n")


def extract_section(text: str, heading: str) -> str:
    pattern = rf"^## {re.escape(heading)}\n+(.*?)(?=^## |\Z)"
    match = re.search(pattern, text, flags=re.M | re.S)
    return match.group(1).strip() if match else ""


def first_paragraph(text: str) -> str:
    parts = [part.strip() for part in re.split(r"\n\s*\n", text.strip()) if part.strip()]
    return parts[0] if parts else ""


def list_field(raw: str) -> list[str]:
    if not raw:
        return []
    lines = []
    for line in raw.splitlines():
        stripped = line.strip().lstrip("-").strip()
        if stripped:
            lines.append(stripped)
    if len(lines) == 1 and "," in lines[0]:
        return [item.strip() for item in lines[0].split(",") if item.strip()]
    return lines


def parse_note(path: Path) -> dict[str, object]:
    full_text = read_text(path)
    meta, body = split_front_matter(full_text)
    lines = [line for line in body.splitlines() if line.strip()]

    def basic_info_value(label: str) -> str:
        pattern = rf"^\* {re.escape(label)}:\s*(.+)$"
        match = re.search(pattern, body, flags=re.M)
        return clean_md(match.group(1).strip()) if match else ""

    def quick_verdict_parts() -> tuple[str, str]:
        quick = extract_section(body, "Quick verdict")
        if not quick:
            return "", ""
        verdict_lines = [line.strip() for line in quick.splitlines() if line.strip()]
        verdict = ""
        if verdict_lines:
            verdict = clean_md(verdict_lines[0]).strip()
        quick_text = clean_md("\n".join(verdict_lines[1:]).strip())
        return verdict, quick_text

    if meta.get("title"):
        title = clean_md(meta["title"])
    elif lines:
        title = clean_md(re.sub(r"^#\s+", "", lines[0]).strip())
    else:
        title = path.stem.replace("-", " ").title()

    verdict, verdict_text = quick_verdict_parts()
    summary = meta.get("summary") or clean_md(first_paragraph(extract_section(body, "One-paragraph overview") or extract_section(body, "Summary") or body))
    why_it_matters = meta.get("why_it_matters") or clean_md(first_paragraph(
        extract_section(body, "Why It Matters")
        or extract_section(body, "12. Why does this matter?")
        or extract_section(body, "12. Why does this matter for cabbageland?")
    ))
    final_decision = meta.get("final_decision") or clean_md(first_paragraph(
        extract_section(body, "Final Decision")
        or extract_section(body, "14. Final decision")
    ))

    authors = clean_md(meta.get("authors", "") or basic_info_value("Authors"))
    year = clean_md(meta.get("year", "") or basic_info_value("Year"))
    venue = clean_md(meta.get("venue", "") or basic_info_value("Venue / source"))
    date_read = clean_md(meta.get("date_read", "") or basic_info_value("Date read"))
    paper_url = clean_md(meta.get("paper_url", "") or basic_info_value("Link"))
    why_selected = clean_md(meta.get("why_selected", "") or basic_info_value("Why selected in one sentence"))

    slug = meta.get("slug") or slugify(path.stem)
    return {
        "slug": slug,
        "title": title,
        "authors": authors,
        "year": year,
        "venue": venue,
        "dateRead": date_read,
        "paperUrl": paper_url,
        "pdfUrl": clean_md(meta.get("pdf_url", "")),
        "verdict": clean_md(meta.get("verdict", "") or verdict),
        "verdictText": verdict_text,
        "tags": [clean_md(item) for item in list_field(meta.get("tags", ""))],
        "whySelected": why_selected,
        "summary": summary,
        "whyItMatters": why_it_matters,
        "finalDecision": final_decision,
        "path": f"paper_notes/{path.name}",
    }


def main() -> None:
    notes = sorted(
        (parse_note(path) for path in NOTES_DIR.glob("*.md") if path.name != ".gitkeep"),
        key=lambda item: (item["dateRead"] or "", item["title"]),
        reverse=True,
    )

    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "repo": REPO_NAME,
        "notes": notes,
        "markdown": {
            f"paper_notes/{path.name}": split_front_matter(read_text(path))[1]
            for path in NOTES_DIR.glob("*.md")
            if path.name != ".gitkeep"
        },
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
