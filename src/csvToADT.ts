import { assertEquals } from "asserts";

type RawCSV = readonly string[][];

type ParsedCSV<T extends string> = Record<T, string>[];

function parse<T extends string>(keys: T[], csv: RawCSV): ParsedCSV<T> {
  const [head, ...tail] = csv;

  assertEquals(keys, head as T[]);

  const length = keys.length;

  const state: ParsedCSV<T> = [];
  for (const row of tail) {
    if (row.length !== length) {
      throw new Error("CSV have rows with diferents sizes");
    }
    const map = new Map<T, string>();
    for (const [column, key] of keys.entries()) {
      const value = row[column];
      if (!value) {
        throw new Error("CSV have rows with diferents sizes");
      }
      map.set(key, value);
    }
    state.push(Object.fromEntries(map.entries()) as Record<T, string>);
  }

  return state;
}

`
loan_id,loan_amount,provision_amount
L9209384832,1000,100
L12312312123,1100,20
L2393823489,800,40
`;

console.log(
  parse(
    ["loan_id", "loan_amount", "provision_amount"],
    [
      ["loan_id", "loan_amount", "provision_amount"],
      ["L9209384832", "1000", "100"],
      ["L12312312123", "1100", "20"],
      ["L2393823489", "800", "40"],
    ]
  )
);
