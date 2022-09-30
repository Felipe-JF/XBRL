import { parse } from "https://deno.land/std@0.158.0/encoding/csv.ts";

const file = await Deno.readTextFile("./static/exemplo.csv");

const content = parse(file);

console.log(content);
