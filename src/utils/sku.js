// 源自 https://github.com/zent-contrib/sku/blob/master/src/utils/index.js

// 计算每个sku后面有多少项
export function getLevels(tree) {
  const level = [];
  for (let i = tree.length - 1; i >= 0; i--) {
    if (tree[i + 1] && tree[i + 1].leaf) {
      level[i] = tree[i + 1].leaf.length * level[i + 1] || 1;
    } else {
      level[i] = 1;
    }
  }
  return level;
}

/**
 * 笛卡尔积运算
 * @param  {[type]} tree   [description]
 * @param  {Array}  stocks [description]
 * @return {[type]}        [description]
 */
export function flatten(tree, stocks = [], options) {
  const { optionValue = 'id', optionText = 'value' } = options || {};
  const result = [];
  let skuLen = 0;
  const stockMap = {}; // 记录已存在的stock的数据
  const level = getLevels(tree);
  if (tree.length === 0) return result;
  tree.forEach(sku => {
    const { leaf } = sku;
    if (!leaf || leaf.length === 0) return true;
    skuLen = (skuLen || 1) * leaf.length;
  });
  // 根据已有的stocks生成一个map
  stocks.forEach(stock => {
    const { skus, ...attr } = stock;
    stockMap[skus.map(item => `${item.k_id}_${item.v_id}`).join('|')] = attr;
  });
  for (let i = 0; i < skuLen; i++) {
    const skus = [];
    const mapKey = [];
    tree.forEach((sku, column) => {
      const { leaf } = sku;
      let item = {};
      if (!leaf || leaf.length === 0) return true;
      if (leaf.length > 1) {
        const row = parseInt(i / level[column], 10) % leaf.length;
        item = tree[column].leaf[row];
      } else {
        item = tree[column].leaf[0];
      }
      if (!sku[optionValue] || !item[optionValue]) return;
      mapKey.push(`${sku[optionValue]}_${item[optionValue]}`);
      skus.push({
        k_id: sku[optionValue],
        k: sku[optionText],
        v_id: item[optionValue],
        v: item[optionText]
      });
    });
    const { ...data } = stockMap[mapKey.join('|')] || {};
    // 从map中找出存在的sku并保留其值
    result.push({ ...data, skus });
  }
  return result;
}

/**
 * 判断两个sku是否相同
 * @param  {[type]}  prevSKU [description]
 * @param  {[type]}  nextSKU [description]
 * @return {Boolean}         [description]
 */
export function isEqual(prevSKU, nextSKU, options) {
  const { optionValue = 'id' } = options || {};
  return (
    nextSKU.length === prevSKU.length &&
    nextSKU.every(({ leaf = [] }, index) => {
      const prevLeaf = prevSKU[index].leaf || [];
      return (
        prevSKU[index][optionValue] === nextSKU[index][optionValue] &&
        leaf.length === prevLeaf.length &&
        leaf.map(item => item[optionValue]).join(',') ===
          prevLeaf.map(item => item[optionValue]).join(',')
      );
    })
  );
}

export function objEquals(object1, object2) {
  // For the first loop, we only check for types
  for (var propName in object1) {
    // Check for inherited methods and properties - like .equals itself
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
    // Return false if the return value is different
    if (object1.hasOwnProperty(propName) !== object2.hasOwnProperty(propName)) {
      return false;
      // Check instance type
    } else if (typeof object1[propName] !== typeof object2[propName]) {
      // Different types => not equal
      return false;
    }
  }
  // Now a deeper check using other objects property names
  for (var key in object2) {
    // We must check instances anyway, there may be a property that only exists in object2
    // I wonder, if remembering the checked values from the first loop would be faster or not
    if (object1.hasOwnProperty(key) !== object2.hasOwnProperty(key)) {
      return false;
    } else if (typeof object1[key] !== typeof object2[key]) {
      return false;
    }
    // If the property is inherited, do not check any more (it must be equa if both objects inherit it)
    if (!object1.hasOwnProperty(key)) {
      continue;
    }
    // Now the detail check and recursion
    // This returns the script back to the array comparing
    /** REQUIRES Array.equals**/
    if (object1[key] instanceof Array && object2[key] instanceof Array) {
      // recurse into the nested arrays
      if (objEquals(!object1[key], object2[key])) {
        return false;
      }
    } else if (object1[key] instanceof Object && object2[key] instanceof Object) {
      // recurse into another objects
      // console.log("Recursing to compare ", this[propName],"with",object2[propName], " both named \""+propName+"\"");
      if (objEquals(!object1[key], object2[key])) {
        return false;
      }
      // Normal value comparison for strings and numbers
    } else if (object1[key] !== object2[key]) {
      return false;
    }
  }
  // If everything passed, let's say YES
  return true;
}

