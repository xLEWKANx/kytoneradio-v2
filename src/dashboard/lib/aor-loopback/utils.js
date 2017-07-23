export const mapObject = (obj, cb) => {
  let newObj = {};
  for (let key in obj) {
    newObj[key] = cb(key, obj[key]);
  }
  return newObj;
};
