# Editing the Jeopardy Board (Markdown CMS)

All categories and questions live in this `content/` folder. Edit these files to
change the board — no code changes needed.

## Structure

```
content/
  01-upper-extremity/      <- one folder per CATEGORY (= one column)
    _meta.md               <- the category title
    100.md                 <- the 100-point question
    200.md
    300.md
    400.md
    500.md
  02-lower-extremity/
    ...
```

- **Column order** is the folder name order. Prefix folders with `01-`, `02-`, etc.
- The board renders **5 columns** (5 categories) and **5 rows** (100–500). Add or
  rename folders to change categories; the app reads whatever is here.

## Category title (`_meta.md`)

```md
---
title: Upper Extremity
---
```

## A question file (e.g. `300.md`)

```md
---
points: 300
image: /images/upper-extremity-300.png   # see "Images" below
imageAlt: AP radiograph of the elbow
answer: C                                 # the correct letter, A–D
options:
  A: First choice
  B: Second choice
  C: Third choice (correct one here)
  D: Fourth choice
explanation: >                            # optional, shown after reveal
  A short teaching point. Markdown is supported (**bold**, etc.).
---

The question stem goes here in the body. **Markdown is supported**, so you can
bold key terms, add line breaks, etc.
```

## Images

1. Drop your radiograph into the `public/images/` folder, e.g.
   `public/images/upper-extremity-300.png`.
2. Reference it from the question's `image:` field as `/images/your-file.png`.
3. If an image is missing, the board shows a placeholder so the game still works.

Supported formats: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`.
