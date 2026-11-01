# Pædagogisk Dokumentation – MCP-server

En lille, stateless MCP-server til strukturerede danske skabeloner for pædagogisk dokumentation.

## Funktioner

Serveren eksponerer seks MCP-værktøjer:

- `create_observation_template`
- `analyze_pedagogical_situation`
- `create_action_plan`
- `create_smtte`
- `evaluate_intervention`
- `create_weekly_summary`

Værktøjerne returnerer strukturerede skabeloner og arbejdsrammer. De er ikke en selvstændig AI-model og foretager ikke automatisk faglige vurderinger. ChatGPT/den tilknyttede skill kan bruge værktøjernes output som struktur for den videre tekstgenerering og refleksion.

## Deployment med Cloudflare

1. Upload indholdet af denne mappe til roden af GitHub-repository'et.
2. I Cloudflare Workers & Pages skal repository'et forbindes til en Worker.
3. Build command: lad feltet være tomt.
4. Deploy command: `npm run deploy` (eller behold Cloudflares `npx wrangler deploy`).
5. Når deployment er færdig, er MCP-endpointet normalt `https://<worker-navn>.<konto>.workers.dev/mcp`.
6. Test `https://<worker-navn>.<konto>.workers.dev/health` i browseren. Det skal returnere JSON med `status: "ok"`.

## Lokal udvikling

Kræver Node.js og npm:

```bash
npm install
npm run dev
```

Lokal MCP-adresse: `http://localhost:8787/mcp`.

## Databeskyttelse

- Serveren har ingen database, konto-/brugerprofil eller vedvarende lagring.
- Kodefunktionerne logger ikke værktøjsinput og sender ikke indhold videre til tredjeparts-API'er.
- Forespørgsler behandles for at levere værktøjssvar. Cloudflare leverer selve hostinginfrastrukturen og kan behandle tekniske request-oplysninger efter egne vilkår.
- Undlad at indsætte navne, CPR-numre, kontaktoplysninger eller andre direkte identificerende oplysninger om børn og familier. Brug anonymiserede beskrivelser, og følg altid institutionens/informationsansvarliges instrukser.

## Vigtigt

Dette er en første teknisk version. Test værktøjerne og gennemgå privatlivsteksten, før serveren kobles til en offentlig ChatGPT-liste. En offentlig MCP-adresse er tilgængelig for klienter, der kender adressen; denne version har ikke brugerlogin eller adgangskontrol.
