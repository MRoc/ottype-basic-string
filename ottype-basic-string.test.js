const type = require("./ottype-basic-string.js");

describe("apply", () => {
  test("insert", () => {
    const op = type.opInsert(1, "x");
    const s0 = "ABC";
    const s1 = type.apply(s0, op);
    expect(s1).toBe("AxBC");
  });
  test("delete", () => {
    const op = type.opDelete(1);
    const s0 = "ABC";
    const s1 = type.apply(s0, op);
    expect(s1).toBe("AC");
  });
});

describe("transform", () => {
  test("insert after insert", () => {
    const op0 = type.opInsert(1, "a");
    const op1 = type.opInsert(0, "b");
    const op2 = type.transform(op0, op1, "left");
    expect(op2).toStrictEqual(type.opInsert(2, "a"));
  });
  test("insert after delete", () => {
    const op0 = type.opInsert(2, "a");
    const op1 = type.opDelete(0);
    const op2 = type.transform(op0, op1, "left");
    expect(op2).toStrictEqual(type.opInsert(1, "a"));
  });
  test("insert after multiple edits", () => {
    const op0 = type.opInsert(2, "a");
    const op1 = [type.opDelete(0), type.opDelete(0), type.opInsert(0, "b")];
    const op2 = type.transform(op0, op1, "left");
    expect(op2).toStrictEqual(type.opInsert(1, "a"));
  });
  test("threw inserts before insert insert", () => {
    const op0 = type.opInsert(4, "a");
    const op1 = type.opInsert(0, "b");
    const op2 = type.opInsert(1, "c");
    const op3 = type.opInsert(2, "d");
    const op4 = type.transform(op0, [op1, op2, op3], "left");
    expect(op4).toStrictEqual(type.opInsert(7, "a"));
  });
});

describe("compose", () => {
  test("single ops compose to array", () => {
    const op0 = type.opInsert(1, "a");
    const op1 = type.opInsert(0, "b");
    const op2 = type.compose(op0, op1);
    expect(op2).toStrictEqual([op0, op1]);
  });
  test("array ops compose to array", () => {
    const op0 = [type.opInsert(1, "a")];
    const op1 = [type.opInsert(0, "b")];
    const op2 = type.compose(op0, op1);
    expect(op2).toStrictEqual([op0[0], op1[0]]);
  });
});

describe("invertWithDoc", () => {
  test("invert insert returns delete", () => {
    const op = type.opInsert(1, "a");
    const doc = "";
    const invertOp = type.invertWithDoc(op, doc);
    expect(invertOp).toStrictEqual(type.opDelete(1));
  });
  test("invert delete returns insert", () => {
    const op = type.opDelete(1);
    const doc = "abc";
    const invertOp = type.invertWithDoc(op, doc);
    expect(invertOp).toStrictEqual(type.opInsert(1, "b"));
  });
});

describe("transformPresence", () => {
  test("insert before moves presence scalar", () => {
    const op = type.opInsert(1, "a");
    const presence = 3;
    const transformed = type.transformPresence(presence, op, false);
    expect(transformed).toBe(4);
  });
  test("delete before moves presence scalar", () => {
    const op = type.opDelete(1);
    const presence = 3;
    const transformed = type.transformPresence(presence, op, false);
    expect(transformed).toBe(2);
  });
  test("insert before moves presence range", () => {
    const op = type.opInsert(1, "a");
    const presence = { index: 3, length: 4 };
    const transformed = type.transformPresence(presence, op, false);
    expect(transformed).toStrictEqual({ index: 4, length: 4 });
  });
});
