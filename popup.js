document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(null, function(items) {

    const siteContainer = document.getElementById("siteData");
    const summaryContainer = document.getElementById("summary");

    let totalProductive = 0;
    let totalUnproductive = 0;
    let totalNeutral = 0;

    for (let site in items) {
      const data = items[site];
      const seconds = Math.round(data.time / 1000);

      const div = document.createElement("div");
      div.className = "site-box";
      div.innerHTML = `
        <strong>${site}</strong><br>
        Time: ${seconds} sec<br>
        Category: ${data.category}
      `;
      siteContainer.appendChild(div);

      if (data.category === "productive") {
        totalProductive += data.time;
      } else if (data.category === "unproductive") {
        totalUnproductive += data.time;
      } else {
        totalNeutral += data.time;
      }
    }

    const totalTime = totalProductive + totalUnproductive + totalNeutral;

    const productivePercent = totalTime > 0
      ? ((totalProductive / totalTime) * 100).toFixed(1)
      : 0;

    summaryContainer.innerHTML = `
      <hr>
      <h3>Summary</h3>
      Productive: ${Math.round(totalProductive / 1000)} sec<br>
      Unproductive: ${Math.round(totalUnproductive / 1000)} sec<br>
      Neutral: ${Math.round(totalNeutral / 1000)} sec<br><br>
      <strong>Productivity Score: ${productivePercent}%</strong>
    `;
  });
});
