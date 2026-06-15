# Bazi → product auto-connection guide

**Short answer to Lucy's question ("if I add products, will it automatically
connect to the product according to bazi?"): yes — automatically, as long as the
product carries the matching stone name.**

## How it works
When a visitor finishes the Bazi reading, the result recommends ONE stone (based
on their chart). The "See [stone]" button then searches the live product
catalogue and links to the first matching product page. It matches on any of:

- `crystal_type`  (preferred)
- `gemstone`
- the product `name`

If nothing matches yet, the button safely falls back to `/products`. So adding a
correctly-tagged product is all it takes — no code change, no copy change.

## What to tag each product with
Set the product's **crystal_type** (in the admin product editor) to one of the
values below, and that product will auto-connect to the matching guardian's
result. (Putting the stone name in the product **name** also works.)

| Element | Guardian | Stone shown in result | Set `crystal_type` to any of |
|---|---|---|---|
| Water 水 | Pixiu 貔貅 | Obsidian | `Black Obsidian`, `Obsidian`, `Smoky Quartz` |
| Fire 火 | Yazi 睚眦 | Carnelian | `Carnelian`, `Red Agate`, `Red Jasper` |
| Wood 木 | Chaofeng 嘲風 | Green Aventurine | `Green Aventurine`, `Aventurine`, `Green Fluorite` |
| Earth 土 | Chiwen 螭吻 | Citrine & Tiger's Eye | `Citrine`, `Tiger's Eye`, `Tiger Eye` |
| Metal 金 | Qiuniu 囚牛 | Clear Quartz & Moonstone | `Clear Quartz`, `Moonstone`, `Quartz` |

Matching is case-insensitive and partial (a product named "Citrine Abundance
Bracelet" matches Earth). Each element needs at least one in-stock product to
guarantee a deep link; otherwise that guardian's CTA points at the full shop.

## Where to change the mapping (devs)
The stone categories and their `crystalTypes` live in
`src/lib/bazi/data/stones.ts`. Swapping suppliers or stone choices only touches
that file — result copy never changes. The product lookup is in
`src/app/api/bazi/calculate/route.ts` (`resolveProductHref`).
