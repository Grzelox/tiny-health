import { parseCSV, parseCSVRecords } from "./csv";

describe("parseCSV", () => {
  it("parses simple comma-separated rows", () => {
    const csv = "a,b,c\n1,2,3";
    expect(parseCSV(csv)).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
  });

  it("handles quoted fields containing commas", () => {
    const csv = 'name,color\nBurek,"Brązowo-biały"';
    expect(parseCSV(csv)).toEqual([
      ["name", "color"],
      ["Burek", "Brązowo-biały"],
    ]);
  });

  it("handles escaped quotes inside quoted fields", () => {
    const csv = 'name,notes\nMysza,"Lubi mówić ""pisk"""';
    expect(parseCSV(csv)).toEqual([
      ["name", "notes"],
      ["Mysza", 'Lubi mówić "pisk"'],
    ]);
  });

  it("ignores trailing blank lines", () => {
    const csv = "a,b\n1,2\n\n";
    expect(parseCSV(csv)).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });
});

describe("parseCSVRecords", () => {
  it("maps rows to objects keyed by header", () => {
    const csv = "name,bornAt\nMysza,2024-01-15\nBurek,2019-06-01";
    expect(parseCSVRecords(csv)).toEqual([
      { name: "Mysza", bornAt: "2024-01-15" },
      { name: "Burek", bornAt: "2019-06-01" },
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(parseCSVRecords("")).toEqual([]);
  });

  it("fills missing trailing fields with empty strings", () => {
    const csv = "name,bornAt,notes\nMysza,2024-01-15";
    expect(parseCSVRecords(csv)).toEqual([{ name: "Mysza", bornAt: "2024-01-15", notes: "" }]);
  });
});
