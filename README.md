# ottype-basic-string

This proof-of-concept implementation of a operational transformation (OT) type text is not meant to be used in production and just serves the authors desire to gain domain knowledge.

The API supports two operations: Insert and delete a single char in a text.

```
const type = require("@mroc/ottype-basic-string");

const state0 = "ABC";

const op0 = type.opInsert(1, "x");
const state1 = type.apply(state0, op0);
console.log(state1); // "AxBC";

const op1 = type.opDelete(1);
const state2 = type.apply(state1, op1);
console.log(state1); // "ABC";
```