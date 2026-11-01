# Pædagogisk Dokumentation – offentlig pluginpakke

Denne ZIP samler den danske dokumentationsskill med den hostede MCP-server.

## Pakkeindhold
- `plugin.json`: pluginmetadata, listingoplysninger, release notes og 5 positive + 3 negative MCP-testcases.
- `mcp.json`: peger på den aktive Cloudflare MCP-server.
- `skills/paedagogisk-dokumentation/SKILL.md`: den pædagogiske dokumentationsskill.
- `assets/logo.png` og `assets/composer-icon.png`: samme godkendte ikon til begge visninger.
- `PRIVATLIVSPOLITIK-OPDATERET-TIL-WEBSITE.html`: opdateret privatlivsside, som skal publiceres på GitHub Pages, før indsendelse.

## MCP-server
`https://paedagogisk-dokumentation.waggotaco.workers.dev/mcp`

Serverens `/health`-endpoint er `https://paedagogisk-dokumentation.waggotaco.workers.dev/health`.

## Før endelig indsendelse i OpenAI-portalen
1. Upload denne ZIP som en ny version af plugin'et.
2. Tilslut MCP-serveren i portalens MCPs-fane, gennemfør portalens domæne-verifikation og kør tool scan.
3. Publicér den opdaterede privatlivspolitik på den angivne GitHub Pages-adresse. Den opdaterede HTML er vedlagt, men skal lægges på websitet.
4. Tilføj en offentlig, reviewer-tilgængelig demooptagelse i portalens review-oplysninger. Den er ikke indsat i manifestet, fordi der ikke foreligger en faktisk optagelse eller offentlig URL.
5. Kontrollér developer identity-verifikation, land, kategori og alle automatiske fund.
6. Indsend først til review, når portalen viser, at de obligatoriske MCP- og reviewkrav er opfyldt.

## Vigtigt om funktionerne
MCP-serveren leverer seks strukturerede skabelonværktøjer. Den er ikke en separat AI-model og foretager ikke selvstændige pædagogiske vurderinger. ChatGPT anvender skillens instruktioner og bruger MCP-resultaterne som struktureret støtte.

## Databeskyttelse
Serveren er stateless og har ingen applikationsdatabase. Cloudflare er hostingudbyder og kan behandle tekniske forespørgselsdata efter egne vilkår. Brugere skal undlade direkte identificerende og fortrolige oplysninger om børn og familier og følge arbejdspladsens godkendte AI-procedurer.
