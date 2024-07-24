import { writeFileSync } from "node:fs";
import { csvFormatRows } from "d3-dsv";
import { JSDOM } from "jsdom";

async function main() {
  const response = await fetch(
    "https://www.wmata.com/service/elevators-escalators/Elevator-Escalator-Service-Status.cfm"
  );
  if (!response.ok) {
    return;
  }

  const html = await response.text();
  const dom = new JSDOM(html);

  const trs = dom.window.document.querySelectorAll("tbody tr");
  const rows = Array.from(trs).filter((row) => row.children.length === 4);
	const data = rows.map((row) =>
		Array.from(row.querySelectorAll("td")).map((td) => td.textContent.trim())
	);

	const csv = `station,type_location,reason,estimated_return_to_service\n${csvFormatRows(data)}`
	writeFileSync("outages.csv", csv);
}

main();
