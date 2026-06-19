import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type OptionId = "A" | "B" | "C" | "D"

export type QuestionOption = {
  id: OptionId
  text: string
}

export type Question = {
  /** Stable id, e.g. "upper-extremity-100" */
  id: string
  points: number
  /** Markdown question stem */
  stem: string
  image?: string
  imageAlt?: string
  options: QuestionOption[]
  answer: OptionId
  /** Optional markdown explanation shown after the answer is revealed */
  explanation?: string
}

export type Category = {
  /** Folder name, used as a stable id */
  id: string
  title: string
  questions: Question[]
}

const CONTENT_DIR = path.join(process.cwd(), "content")
const POINT_VALUES = [100, 200, 300, 400, 500]

function readMeta(categoryDir: string): { title: string } {
  const metaPath = path.join(categoryDir, "_meta.md")
  if (fs.existsSync(metaPath)) {
    const { data } = matter(fs.readFileSync(metaPath, "utf8"))
    if (typeof data.title === "string" && data.title.trim()) {
      return { title: data.title.trim() }
    }
  }
  // Fall back to a humanized folder name
  const folder = path.basename(categoryDir)
  const title = folder
    .replace(/^\d+[-_]?/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return { title }
}

function normalizeOptions(raw: unknown): QuestionOption[] {
  const ids: OptionId[] = ["A", "B", "C", "D"]
  // Supports `options:` as a mapping (A: "...", B: "...") in frontmatter.
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>
    return ids
      .filter((id) => obj[id] != null)
      .map((id) => ({ id, text: String(obj[id]) }))
  }
  // Supports `options:` as a list, mapped to A-D in order.
  if (Array.isArray(raw)) {
    return raw.slice(0, 4).map((text, i) => ({ id: ids[i], text: String(text) }))
  }
  return []
}

function readQuestion(categoryDir: string, categoryId: string, points: number): Question | null {
  const filePath = path.join(categoryDir, `${points}.md`)
  if (!fs.existsSync(filePath)) return null

  const { data, content } = matter(fs.readFileSync(filePath, "utf8"))
  const answer = String(data.answer ?? "A").trim().toUpperCase() as OptionId

  return {
    id: `${categoryId}-${points}`,
    points,
    stem: content.trim(),
    image: typeof data.image === "string" ? data.image.trim() : undefined,
    imageAlt: typeof data.imageAlt === "string" ? data.imageAlt.trim() : undefined,
    options: normalizeOptions(data.options),
    answer: (["A", "B", "C", "D"].includes(answer) ? answer : "A") as OptionId,
    explanation:
      typeof data.explanation === "string" && data.explanation.trim()
        ? data.explanation.trim()
        : undefined,
  }
}

/**
 * Loads every category (one folder per column) and its 5 point-value
 * questions. Categories are ordered by folder name, so prefix folders
 * with numbers (01-, 02-, ...) to control column order.
 */
export function getCategories(): Category[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const categoryDirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  return categoryDirs.map((folder) => {
    const categoryDir = path.join(CONTENT_DIR, folder)
    const { title } = readMeta(categoryDir)
    const questions = POINT_VALUES.map((points) =>
      readQuestion(categoryDir, folder, points),
    ).filter((q): q is Question => q !== null)

    return { id: folder, title, questions }
  })
}

export { POINT_VALUES }
