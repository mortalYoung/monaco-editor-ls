import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

import "./features/highlight";
import "./features/folding";
import "./features/completion";
import "./features/hover";
import "./features/inlayHints";
import "./features/definition";
import { setModelMarkers } from "./features/codeAction";
import "./features/link";
import "./features/format";
import "./features/typeDefinition";

function getCode() {
  return `-- GROUP BY group_expression [ , group_expression [ , ... ] ] [ WITH { ROLLUP | CUBE } ]
-- GROUP BY { group_expression | { ROLLUP | CUBE | GROUPING SETS } (grouping_set [ , ...]) } [ , ... ]
-- Reference from https://github.com/DTStack/dt-sql-parser/blob/main/test/parser/spark/syntax/fixtures/createDatabase.sql
-- aggregate_name ( [ DISTINCT ] expression [ , ... ] ) [ FILTER ( WHERE boolean_expression ) ]

CREATE TABLE student (id INT, name STRING, age INT) USING CSV;

-- Sum of name per student. Group by \`id\`.
SELECT id, sum(name) FROM student GROUP BY id ORDER BY id;

-- Use column position in GROUP by clause.
SELECT id, sum(quantity) FROM dealer GROUP BY 1 ORDER BY 1;

-- Multiple aggregations.
-- 1. Sum of quantity per dealership.
-- 2. Max quantity per dealership.
SELECT id, sum(quantity) AS sum, max(quantity) AS max FROM dealer GROUP BY id ORDER BY id;

-- Count the number of distinct dealer cities per car_model.
SELECT car_model, count(DISTINCT city) AS count FROM dealer GROUP BY car_model;

-- Sum of only 'Honda Civic' and 'Honda CRV' quantities per dealership.
SELECT id, sum(quantity) FILTER (
            WHERE car_model IN ('Honda Civic', 'Honda CRV')
        ) AS \`sum(quantity)\` FROM dealer
    GROUP BY id ORDER BY id;

-- Aggregations using multiple sets of grouping columns in a single statement.
-- Following performs aggregations based on four sets of grouping columns.
-- 1. city, car_model
-- 2. city
-- 3. car_model
-- 4. Empty grouping set. Returns quantities for all city and car models.
SELECT city, car_model, sum(quantity) AS sum FROM dealer
    GROUP BY GROUPING SETS ((city, car_model), (city), (car_model), ())
    ORDER BY city;

-- Group by processing with \`ROLLUP\` clause.
-- Equivalent GROUP BY GROUPING SETS ((city, car_model), (city), ())
SELECT city, car_model, sum(quantity) AS sum FROM dealer
    GROUP BY city, car_model WITH ROLLUP
    ORDER BY city, car_model;

-- Group by processing with \`CUBE\` clause.
-- Equivalent GROUP BY GROUPING SETS ((city, car_model), (city), (car_model), ())
SELECT city, car_model, sum(quantity) AS sum FROM dealer
    GROUP BY city, car_model WITH CUBE
    ORDER BY city, car_model;

--Select the first row in column age
SELECT FIRST(age) FROM person;

--Get the first row in column \`age\` ignore nulls,last row in column \`id\` and sum of column \`id\`.
SELECT FIRST(age IGNORE NULLS), LAST(id), SUM(id) FROM person;


INSERT INTO
    students PARTITION (student_id = 444444)
SELECT
    name,
    address
FROM
    persons
WHERE
    name = "Dora Williams";`;
}

function App() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const instance = monaco.editor.create(ref.current!, {
      theme: "myCoolTheme",
      value: getCode(),
      language: "SparkSQL",
      fontSize: 20,
      minimap: {
        enabled: false,
      },
    });

    instance.onDidChangeModelContent(() => {
      setModelMarkers(instance.getModel()!);
    });

    return () => {
      instance.dispose();
    };
  }, []);

  return <div ref={ref} style={{ width: "100vw", height: "100vh" }}></div>;
}

export default App;
