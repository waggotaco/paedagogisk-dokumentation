import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";

const serverInfo = {
  name: "Paedagogisk Dokumentation",
  version: "1.0.0",
};

const nonEmpty = z.string().trim().min(1).max(8000);
const optionalText = z.string().trim().max(8000).optional();

function result(title, sections) {
  const body = [
    title,
    "",
    ...sections.flatMap(([heading, content]) => [`## ${heading}`, content, ""]),
    "Bemærk: Skabelonen er et fagligt arbejdsredskab. Tilpas den til institutionens praksis, lokale retningslinjer og den konkrete situation.",
  ].join("\n");
  return { content: [{ type: "text", text: body }] };
}

function createServer() {
  const server = new McpServer(serverInfo);

  server.registerTool(
    "create_observation_template",
    {
      description: "Opretter en dansk, struktureret skabelon til en pædagogisk observation. Værktøjet gemmer ikke oplysninger.",
      inputSchema: {
        context: optionalText.describe("Valgfri kontekst, fx aktivitet eller læringsmiljø."),
        focus: optionalText.describe("Valgfrit observationsfokus."),
        age_group: optionalText.describe("Valgfri aldersgruppe; undgå navne og direkte personoplysninger."),
      },
    },
    async ({ context, focus, age_group }) =>
      result("PÆDAGOGISK OBSERVATION", [
        ["Ramme", `Kontekst: ${context || "[Beskriv kort situationen]"}\nAldersgruppe: ${age_group || "[Angiv evt. aldersgruppe]"}\nDato/tid og varighed: [Udfyld]`],
        ["Observationsfokus", focus || "[Hvad ønsker du at få øje på?]"],
        ["Objektiv beskrivelse", "[Beskriv konkret, hvad der blev sagt og gjort. Adskil observation fra fortolkning.]"],
        ["Barnets perspektiv og deltagelse", "[Hvad viser barnet gennem handlinger, initiativer, udsagn eller kropssprog?]"],
        ["Sociale relationer og læringsmiljø", "[Beskriv samspil, deltagelsesmuligheder, materialer og rammer.]"],
        ["Foreløbig refleksion", "[Hvilke spørgsmål rejser observationen? Undgå at drage sikre konklusioner på et spinkelt grundlag.]"],
        ["Mulige næste skridt", "[Hvad kan undersøges eller afprøves?]"],
      ])
  );

  server.registerTool(
    "analyze_pedagogical_situation",
    {
      description: "Giver en faglig analyseramme til en pædagogisk situation. ChatGPT eller fagpersonen udfører selve analysen ud fra de indtastede oplysninger.",
      inputSchema: {
        situation: nonEmpty.describe("Kort, anonymiseret beskrivelse af situationen."),
        question: optionalText.describe("Det centrale faglige spørgsmål."),
        context: optionalText.describe("Relevant kontekst, fx organisering, relationer eller læringsmiljø."),
      },
    },
    async ({ situation, question, context }) =>
      result("ANALYSE AF PÆDAGOGISK SITUATION", [
        ["Situation", situation],
        ["Kontekst", context || "[Hvilke forhold i miljøet og organiseringen har betydning?]"],
        ["Undersøgelsesspørgsmål", question || "[Hvad ønsker vi at forstå bedre?]"],
        ["Observationer og fortolkninger", "[Adskil det konkret observerede fra de voksnes fortolkninger og antagelser.]"],
        ["Barnets perspektiv", "[Hvilke tegn på barnets oplevelse, intentioner og initiativer har vi? Hvad ved vi ikke?]"],
        ["Relationer og deltagelsesmuligheder", "[Hvordan påvirker relationer, fællesskab og rammer situationen?]"],
        ["Faglige hypoteser", "[Opstil flere mulige forklaringer, og angiv hvad der kan be- eller afkræfte dem.]"],
        ["Behov for yderligere viden", "[Hvilke observationer eller perspektiver mangler?]"],
        ["Mulige pædagogiske greb", "[Hvilke små, konkrete ændringer kan afprøves?]"],
      ])
  );

  server.registerTool(
    "create_action_plan",
    {
      description: "Udarbejder en udfyldningsklar handleplansskabelon med mål, handlinger, ansvar og evaluering.",
      inputSchema: {
        focus_area: nonEmpty.describe("Anonymiseret fokusområde eller pædagogisk behov."),
        desired_change: optionalText.describe("Ønsket udvikling eller tegn på progression."),
        timeframe: optionalText.describe("Tidsramme for indsatsen."),
      },
    },
    async ({ focus_area, desired_change, timeframe }) =>
      result("PÆDAGOGISK HANDLEPLAN", [
        ["Fokusområde", focus_area],
        ["Ønsket forandring", desired_change || "[Hvad ønsker vi skal blive anderledes for barnet eller børnegruppen?]"],
        ["Tidsramme", timeframe || "[Startdato, periode og evalueringsdato]"],
        ["Udgangspunkt", "[Hvad ved vi fra konkrete observationer?]"],
        ["Mål", "[Formulér et konkret, realistisk og observerbart mål.]"],
        ["Pædagogiske handlinger", "1. [Handling, hyppighed og situation]\n2. [Handling, hyppighed og situation]\n3. [Tilpasning af læringsmiljø eller organisering]"],
        ["Ansvar", "[Hvem gør hvad?]"],
        ["Tegn på progression", "[Hvilke konkrete tegn vil vise, om indsatsen hjælper?]"],
        ["Opfølgning og evaluering", "[Hvornår samler vi op, og hvordan justerer vi indsatsen?]"],
      ])
  );

  server.registerTool(
    "create_smtte",
    {
      description: "Opretter en SMTTE-model på dansk med sammenhæng mellem sammenhæng, mål, tiltag, tegn og evaluering.",
      inputSchema: {
        theme: nonEmpty.describe("Tema eller pædagogisk fokus."),
        context: optionalText.describe("Beskrivelse af den aktuelle sammenhæng."),
        goal: optionalText.describe("Ønsket mål."),
      },
    },
    async ({ theme, context, goal }) =>
      result("SMTTE-MODEL", [
        ["Tema", theme],
        ["Sammenhæng", context || "[Hvilken situation, børnegruppe og hvilke rammer tager vi udgangspunkt i?]"],
        ["Mål", goal || "[Hvad ønsker vi at opnå? Formulér målet konkret og realistisk.]"],
        ["Tiltag", "[Hvilke handlinger gennemfører de voksne? Hvem gør hvad, hvornår og hvor ofte?]"],
        ["Tegn", "[Hvilke observerbare tegn viser, at vi bevæger os mod målet?]"],
        ["Evaluering", "[Hvornår og hvordan vurderer vi indsatsen? Hvilke data/observationer bruger vi?]"],
        ["Justering", "[Hvad gør vi, hvis tegnene udebliver, eller nye behov viser sig?]"],
      ])
  );

  server.registerTool(
    "evaluate_intervention",
    {
      description: "Giver en evalueringsskabelon til en pædagogisk indsats med fokus på mål, tegn, virkning og justering.",
      inputSchema: {
        intervention: nonEmpty.describe("Kort beskrivelse af indsatsen."),
        goal: optionalText.describe("Det oprindelige mål."),
        observations: optionalText.describe("Anonymiserede observationer eller tegn fra perioden."),
      },
    },
    async ({ intervention, goal, observations }) =>
      result("EVALUERING AF PÆDAGOGISK INDSATS", [
        ["Indsats", intervention],
        ["Oprindeligt mål", goal || "[Hvad var målet?]"],
        ["Observationer og data", observations || "[Hvilke konkrete observationer har vi fra perioden?]"],
        ["Tegn på målopfyldelse", "[Hvilke tegn ser vi, og hvor tydelige eller stabile er de?]"],
        ["Barnets/børnegruppens perspektiv", "[Hvordan kommer oplevelser, initiativer og deltagelse til udtryk?]"],
        ["Hvad virkede – og under hvilke betingelser?", "[Hvilke dele af indsatsen ser ud til at have haft betydning?]"],
        ["Hvad virkede ikke eller er uklart?", "[Hvilke alternative forklaringer eller manglende oplysninger skal overvejes?]"],
        ["Beslutning", "[Fortsæt, tilpas, afslut eller undersøg yderligere – begrund beslutningen.]"],
        ["Næste skridt", "[Ansvarlig, handling og tidspunkt for opfølgning.]"],
      ])
  );

  server.registerTool(
    "create_weekly_summary",
    {
      description: "Strukturerer en ugentlig opsamling på pædagogiske observationer, læringsmiljø og kommende handlinger.",
      inputSchema: {
        week_or_period: optionalText.describe("Uge eller periode."),
        observations: nonEmpty.describe("Kort, anonymiseret opsamling af ugens observationer."),
        focus: optionalText.describe("Ugens pædagogiske fokus."),
      },
    },
    async ({ week_or_period, observations, focus }) =>
      result("UGENTLIG PÆDAGOGISK OPSAMLING", [
        ["Periode", week_or_period || "[Uge/dato]"],
        ["Pædagogisk fokus", focus || "[Hvad har vi særligt haft opmærksomhed på?]"],
        ["Observationer", observations],
        ["Børnenes deltagelse og perspektiver", "[Hvilke initiativer, interesser og deltagelsesmuligheder har vi set?]"],
        ["Fællesskaber og relationer", "[Hvad har vi lagt mærke til i børnenes samspil?]"],
        ["Læringsmiljø og voksenpositioner", "[Hvad i vores organisering og praksis understøttede eller begrænsede deltagelsen?]"],
        ["Faglig refleksion", "[Hvad har vi lært, og hvilke spørgsmål står tilbage?]"],
        ["Næste uges handlinger", "[Hvilke konkrete handlinger vil vi afprøve?]"],
      ])
  );

  return server;
}

const handler = createMcpHandler(createServer);

export default {
  fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/health") {
      return new Response(
        JSON.stringify({
          name: serverInfo.name,
          version: serverInfo.version,
          status: "ok",
          mcp_endpoint: "/mcp",
          tools: 6,
        }),
        { headers: { "content-type": "application/json; charset=utf-8" } }
      );
    }

    return handler(request, env, ctx);
  },
};
