#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PAPERS_DIR = ROOT / "paper_notes"
TOOLS_DIR = ROOT / "tool_notes"
OUT_PATH = ROOT / "data" / "content.json"
REPO_NAME = "cabbageland/pocket-reads"


PAPER_COLLECTION = {
    "id": "papers",
    "label": "Paper notes",
    "singular": "Paper note",
    "dir": PAPERS_DIR,
    "pathPrefix": "paper_notes",
    "emptyMessage": "No paper notes matched the current filters.",
    "searchPlaceholder": "Search paper titles, tags, verdicts, venues, or note text...",
    "itemLinkLabel": "paper",
}

TOOL_COLLECTION = {
    "id": "tools",
    "label": "Tools",
    "singular": "Tool card",
    "dir": TOOLS_DIR,
    "pathPrefix": "tool_notes",
    "emptyMessage": "No tool cards matched the current filters.",
    "searchPlaceholder": "Search tool names, uses, tags, notes, or note text...",
    "itemLinkLabel": "tool",
}


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


def git_added_timestamp(path: Path) -> str:
    rel = path.relative_to(ROOT)
    try:
        out = subprocess.check_output(
            [
                "git",
                "log",
                "--diff-filter=A",
                "--follow",
                "--format=%aI",
                "--",
                str(rel),
            ],
            cwd=ROOT,
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip().splitlines()
        if out:
            return out[-1].strip()
    except Exception:
        pass
    try:
        return datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).isoformat()
    except Exception:
        return ""


def parse_paper_note(path: Path, collection: dict[str, object]) -> dict[str, object]:
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
    added_at = git_added_timestamp(path)
    rel_path = f"{collection['pathPrefix']}/{path.name}"
    return {
        "collection": collection["id"],
        "slug": slug,
        "title": title,
        "authors": authors,
        "year": year,
        "venue": venue,
        "dateRead": date_read,
        "addedAt": added_at,
        "paperUrl": paper_url,
        "pdfUrl": clean_md(meta.get("pdf_url", "")),
        "verdict": clean_md(meta.get("verdict", "") or verdict),
        "verdictText": verdict_text,
        "tags": [clean_md(item) for item in list_field(meta.get("tags", ""))],
        "whySelected": why_selected,
        "summary": summary,
        "whyItMatters": why_it_matters,
        "finalDecision": final_decision,
        "path": rel_path,
        "searchText": " ".join(
            filter(
                None,
                [
                    title,
                    authors,
                    venue,
                    year,
                    why_selected,
                    summary,
                    why_it_matters,
                    final_decision,
                    clean_md(body),
                    " ".join(list_field(meta.get("tags", ""))),
                ],
            )
        ),
    }


def parse_tool_note(path: Path, collection: dict[str, object]) -> dict[str, object]:
    full_text = read_text(path)
    meta, body = split_front_matter(full_text)
    title = clean_md(meta.get("title") or re.sub(r"^#\s+", "", body.splitlines()[0]).strip())
    slug = meta.get("slug") or slugify(path.stem)
    added_at = git_added_timestamp(path)
    rel_path = f"{collection['pathPrefix']}/{path.name}"

    return {
        "collection": collection["id"],
        "slug": slug,
        "title": title,
        "toolUrl": clean_md(meta.get("tool_url", "")),
        "category": clean_md(meta.get("category", "")),
        "platform": clean_md(meta.get("platform", "")),
        "pricing": clean_md(meta.get("pricing", "")),
        "status": clean_md(meta.get("status", "")),
        "dateRead": clean_md(meta.get("date_read", "")),
        "dateSurfaced": clean_md(meta.get("date_surfaced", "")),
        "surfacedVia": clean_md(meta.get("surfaced_via", "")),
        "addedAt": added_at,
        "verdict": clean_md(meta.get("verdict", "") or meta.get("status", "")),
        "summary": clean_md(meta.get("summary", "") or first_paragraph(extract_section(body, "What it is") or body)),
        "whatItIs": clean_md(extract_section(body, "What it is") or meta.get("what_it_is", "")),
        "usedFor": clean_md(extract_section(body, "What it is used for") or meta.get("used_for", "")),
        "notes": clean_md(extract_section(body, "Additional notes") or meta.get("notes", "")),
        "whySelected": clean_md(meta.get("why_selected", "")),
        "tags": [clean_md(item) for item in list_field(meta.get("tags", ""))],
        "path": rel_path,
        "searchText": " ".join(
            filter(
                None,
                [
                    title,
                    clean_md(meta.get("category", "")),
                    clean_md(meta.get("platform", "")),
                    clean_md(meta.get("pricing", "")),
                    clean_md(meta.get("status", "")),
                    clean_md(meta.get("summary", "")),
                    clean_md(meta.get("why_selected", "")),
                    clean_md(body),
                    " ".join(list_field(meta.get("tags", ""))),
                ],
            )
        ),
    }


COLLECTIONS = [PAPER_COLLECTION, TOOL_COLLECTION]
PARSERS = {
    "papers": parse_paper_note,
    "tools": parse_tool_note,
}


def main() -> None:
    collections_payload = []
    all_markdown: dict[str, str] = {}

    for collection in COLLECTIONS:
        items = []
        dir_path: Path = collection["dir"]
        parser = PARSERS[collection["id"]]
        if dir_path.exists():
            for path in sorted(dir_path.glob("*.md")):
                if path.name in {".gitkeep", "README.md"}:
                    continue
                items.append(parser(path, collection))
                all_markdown[f"{collection['pathPrefix']}/{path.name}"] = split_front_matter(read_text(path))[1]

        items.sort(key=lambda item: (item.get("addedAt") or "", item.get("dateRead") or "", item["title"]), reverse=True)

        collections_payload.append({
            "id": collection["id"],
            "label": collection["label"],
            "singular": collection["singular"],
            "pathPrefix": collection["pathPrefix"],
            "emptyMessage": collection["emptyMessage"],
            "searchPlaceholder": collection["searchPlaceholder"],
            "itemLinkLabel": collection["itemLinkLabel"],
            "count": len(items),
            "items": items,
        })

    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "repo": REPO_NAME,
        "collections": collections_payload,
        "markdown": all_markdown,
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
