// ===============================
// ALLSVENSKAN 2026 - STARTTABELL
// ===============================
const allsvenskan2026 = [
    "AIK",
    "Brommapojkarna",
    "Degerfors",
    "Djurgården",
    "Elfsborg",
    "GAIS",
    "Häcken",
    "Halmstad",
    "Hammarby",
    "IFK Göteborg",
    "Kalmar FF",
    "Malmö FF",
    "Mjällby",
    "Sirius",
    "Västerås SK",
    "Örgryte IS"
  ];
  
  // ===============================
  // DELTAGARE + DERAS TIPS
  // ===============================
  const tips = {
    "Olle": [
      "Mjällby",
      "Hammarby",
      "GAIS",
      "Malmö",
      "Djurgården",
      "Sirius",
      "IFK Göteborg",
      "AIK",
      "Häcken",
      "Brommapojkarna",
      "Elfsborg",
      "Halmstad",
      "Degerfors",
      "Örgryte IS",
      "Västerås SK",
      "Kalmar FF"
    ],
  
    "Cristian": [
      "Hammarby",
      "Mjällby",
      "Malmö FF",
      "Djurgården",
      "GAIS",
      "IFK Göteborg",
      "Häcken",
      "Sirius",
      "AIK",
      "Elfsborg",
      "Brommapojkarna",
      "Degerfors",
      "Västerås SK",
      "Halmstad",
      "Kalmar FF",
      "Örgryte IS"
    ],
  
    "Bengt": [
      "Hammarby",
      "Malmö FF",
      "GAIS",
      "Mjällby",
      "Djurgården",
      "IFK Göteborg",
      "Häcken",
      "Sirius",
      "AIK",
      "Elfsborg",
      "Brommapojkarna",
      "Kalmar FF",
      "Västerås SK",
      "Halmstad",
      "Degerfors",
      "Örgryte IS"
    ],
  
    "Mamma": [
      "Hammarby",
      "Mjällby",
      "AIK",
      "Malmö FF",
      "Djurgården",
      "GAIS",
      "Elfsborg",
      "IFK Göteborg",
      "Häcken",
      "Sirius",
      "Brommapojkarna",
      "Degerfors",
      "Västerås SK",
      "Kalmar FF",
      "Örgryte IS",
      "Halmstads BK"
    ],
  
    "Harry": [
      "Hammarby",
      "Mjällby AIF",
      "Malmö FF",
      "GAIS",
      "AIK",
      "Djurgården",
      "IFK Göteborg",
      "Elfsborg",
      "Häcken",
      "Brommapojkarna",
      "Sirius",
      "Örgryte IS",
      "Degerfors",
      "Halmstads BK",
      "Kalmar FF",
      "Västerås SK"
    ]
  };
  
  // ===============================
  // NOLLTABELL (innan säsongen)
  // ===============================
  function createZeroTable() {
    return allsvenskan2026.map((team, index) => ({
      strTeam: team,
      intRank: index + 1,
      intPoints: 0
    }));
  }
  
  // ===============================
  // NORMALISERA LAGNAMN
  // ===============================
  function normalizeName(name) {
    return name
      ?.toLowerCase()
      .replace(/å/g, "a")
      .replace(/ä/g, "a")
      .replace(/ö/g, "o")
      .replace(/\s+/g, " ")
      .trim();
  }
  
  // ===============================
  // HÄMTA LIVE-TABELL
  // ===============================
  async function getTable() {
    try {
      const response = await fetch("https://www.thesportsdb.com/api/v1/json/123/lookuptable.php?l=4347&s=2026");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
      const data = await response.json();
  
      if (!data.table || data.table.length === 0) return createZeroTable();
  
      const liveTable = allsvenskan2026.map((teamName, index) => {
        const apiTeam = data.table.find(team =>
          normalizeName(team.strTeam) === normalizeName(teamName)
        );
        return {
          strTeam: teamName,
          intRank: apiTeam?.intRank ?? index + 1,
          intPoints: apiTeam?.intPoints ?? 0
        };
      });
  
      liveTable.sort((a, b) => a.intRank - b.intRank);
  
      return liveTable;
    } catch (error) {
      console.warn("Kunde inte hämta live-tabell. Använder starttabell istället.", error);
      return createZeroTable();
    }
  }
  
  // ===============================
  // POÄNGBERÄKNING
  // ===============================
  function calculatePoints(actualTable, userTips) {
    let points = 0;
    actualTable.forEach((teamObj, index) => {
      const actualTeam = teamObj.strTeam;
      const actualPos = index + 1;
      const predictedPos = userTips.findIndex(
        team => normalizeName(team) === normalizeName(actualTeam)
      ) + 1;
      if (predictedPos === 0) return;
      const diff = Math.abs(predictedPos - actualPos);
      points += diff === 0 ? -2 : diff;
    });
    return points;
  }
  
  // ===============================
  // VISA POÄNGSTÄLLNING
  // ===============================
  function renderLeaderboard(results) {
    const leaderboard = document.getElementById("leaderboard");
    const leaderboardTitle = document.createElement("h2");
    leaderboardTitle.textContent = "Poängställning (live)";
    leaderboard.appendChild(leaderboardTitle);
  
    const list = document.createElement("ol");
    results.forEach((r, index) => {
      const item = document.createElement("li");
      let medal = "";
      if (index === 0) medal = "🥇 ";
      if (index === 1) medal = "🥈 ";
      if (index === 2) medal = "🥉 ";
      item.textContent = `${medal}${r.name}: ${r.pts} poäng`;
      list.appendChild(item);
    });
    leaderboard.appendChild(list);
  }
  
  // ===============================
  // VISA LIVE-TABELLEN
  // ===============================
  function renderLiveTable(table) {
    const leaderboard = document.getElementById("leaderboard");
    const tableTitle = document.createElement("h2");
    tableTitle.textContent = "Allsvenskans live-tabell 2026";
    leaderboard.appendChild(tableTitle);
  
    const standingsTable = document.createElement("table");
    standingsTable.border = "1";
    standingsTable.cellPadding = "8";
    standingsTable.cellSpacing = "0";
  
    standingsTable.innerHTML = `
      <thead>
        <tr>
          <th>Placering</th>
          <th>Lag</th>
          <th>Poäng</th>
        </tr>
      </thead>
      <tbody>
        ${table
          .map(
            (team, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${team.strTeam}</td>
            <td>${team.intPoints}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    `;
    leaderboard.appendChild(standingsTable);
  }
  
  // ===============================
  // HUVUDFUNKTION
  // ===============================
  async function updateLeaderboard() {
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "<p>Laddar tabell och poäng...</p>";
  
    const table = await getTable();
    let results = [];
    for (const [name, tippning] of Object.entries(tips)) {
      const pts = calculatePoints(table, tippning);
      results.push({ name, pts });
    }
    results.sort((a, b) => a.pts - b.pts);
  
    leaderboard.innerHTML = "";
    renderLeaderboard(results);
    renderLiveTable(table);
  
    const updated = document.createElement("p");
    updated.style.marginTop = "20px";
    updated.innerHTML = `<em>Senast uppdaterad: ${new Date().toLocaleString("sv-SE")}</em>`;
    leaderboard.appendChild(updated);
  }
  
  // ===============================
  // START & AUTO-UPPDATERA VAR 5:E MINUT
  // ===============================
  updateLeaderboard();
  setInterval(updateLeaderboard, 5 * 60 * 1000);