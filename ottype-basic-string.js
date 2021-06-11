exports.name = "text";
exports.uri = "http://sharejs.org/types/basic-string";

exports.create = (initial) => {
  if (initial != null && typeof initial !== "string") {
    throw Error("Initial data must be a string");
  }
  return initial || "";
};

exports.opInsert = (index, char) => {
  return { o: "i", i: index, c: char };
};

exports.opDelete = (index) => {
  return { o: "d", i: index };
};

exports.apply = (str, ops) => {
  for (const c of makeArray(ops)) {
    switch (c.o) {
      case "i":
        str = str.substring(0, c.i) + c.c + str.substring(c.i);
        break;
      case "d":
        str = str.substring(0, c.i) + str.substring(c.i + 1);
        break;
      default:
        throw new Error(`Unknown op '${c.o}'`);
    }
  }

  return str;
};

exports.transform = (op, otherOp, side) => {
  if (side !== "left" && side !== "right") {
    throw Error("side (" + side + ") must be 'left' or 'right'");
  }

  otherOp = makeArray(otherOp);

  op = makeArray(op).map((o, i) => {
    return { ...o, i: o.i + calculateShift(otherOp, i) };
  });

  return exports.normalize(op);
};

exports.compose = (op0, op1) => {
  return [...makeArray(op0), ...makeArray(op1)];
};

exports.invertWithDoc = (op, doc) => {
  op = makeArray(op)
    .reverse()
    .map((o) =>
      o.o === "i" ? exports.opDelete(o.i) : exports.opInsert(o.i, doc[o.i])
    );
  return exports.normalize(op);
};

exports.normalize = (obj) => {
  if (obj.length === 1) {
    return obj[0];
  }
  return obj;
};

function makeArray(obj) {
  if (!Array.isArray(obj)) {
    obj = [obj];
  }
  return obj;
}

function calculateShift(ops, index) {
  return makeArray(ops)
    .filter((op) => op.i <= index)
    .map((op) => (op.o === "i" ? +1 : -1))
    .reduce((a, b) => a + b, 0);
}
