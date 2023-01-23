module.exports = {
  "spec": ["./src/**/*.test.js","./src/**/*.test.ts"],
  "extensions": ["ts"],
  "node-option": [
//      "experimental-specifier-resolution=node",
    "loader=ts-node/esm"
  ],
};