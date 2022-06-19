/**
 * @file
 * @auth jinguangguo
 * @date 2016/9/19
 */

const bigdecimal = require("bigdecimal");
// import {PRECISION} from './lang';
const PRECISION = 6;
/**
 * 向右移动小数点 ,相当于乘10的_pointcount次幂
 * @param _number 操作的数字
 * @param _pointcount 向右移动的位数
 * @returns 移动以后的数字(number类型)
 */
function moveRight(_number: number, _pointcount: number) {
  if (typeof _number !== "number" && isNaN(_number)) {
    return _number;
  }
  let flag = 1;
  if (_number < 0) {
    flag = -1;
    _number = _number * -1;
  }
  const numStr = _number.toString();
  const strArr = numStr.split(".");
  let rightStr = strArr.length > 1 ? strArr[1] : "";
  // 在不足移动的位数后补0;
  if (rightStr.length < _pointcount) {
    const addZero = [];
    for (let i = rightStr.length; i < _pointcount; i++) {
      addZero.push("0");
    }
    rightStr = rightStr + addZero.join("");
  }
  return (
    Number(
      strArr[0] +
        rightStr.substring(0, _pointcount) +
        "." +
        rightStr.substr(_pointcount)
    ) * flag
  );
}

/**
 * 向左移动小数点,相当于_number除以10的_pointcount次幂
 * @param _number 操作的数字
 * @param _pointcount 向左移动的位数
 * @returns 移动以后的数字(number类型)
 */
function moveLeft(_number: number, _pointcount: number) {
  // 判断是否为数字,非数字直接返回本身
  if (typeof _number !== "number" && isNaN(_number)) {
    return _number;
  }
  let flag = 1;
  if (_number < 0) {
    flag = -1;
    _number = _number * -1;
  }
  // number转换为string ,方便后续操作。
  const numStr = _number.toString();
  // 按照小数点分隔字符串,
  const strArr = numStr.split(".");
  let num = 0;
  const zeroArr = [];
  // 生成移动位数+1的0 ,补到分隔后的第一个字符串中,兼容0.XXX的情况。开头多余的零会在调用Number方法时去掉。
  while (num < _pointcount + 1) {
    zeroArr.push("0");
    num++;
  }
  const leftStr = zeroArr.join("") + strArr[0];
  const leftArr = leftStr.split("");
  // 插入移动后的小数点。
  leftArr.splice(leftStr.length - _pointcount, 0, ".");
  let result = leftArr.join("");
  // 拼接原始值小数点后的数字
  if (strArr.length > 1) {
    result += strArr[1];
  }
  return Number(result) * flag;
}

function getNum(num: number) {
  let result;
  try {
    result = new bigdecimal.BigDecimal("" + num).toPlainString();
  } catch (e) {
    result = num;
  }
  return result;
}

export default {
  /**
   * 加法
   * @param _num1
   * @param _num2
   * @param precision 精度
   * @returns {*}
   */
  add(_num1: number, _num2: number, precision: number) {
    if (!precision) {
      precision = PRECISION;
    }
    _num1 = getNum(_num1);
    _num2 = getNum(_num2);
    return moveLeft(
      moveRight(_num1, precision) + moveRight(_num2, precision),
      precision
    );
  },

  /**
   * 减法
   * @param _num1
   * @param _num2
   * @returns {*}
   */
  reduce(_num1: number, _num2: number, precision: number) {
    if (!precision) {
      precision = PRECISION;
    }
    return moveLeft(
      moveRight(_num1, precision) - moveRight(_num2, precision),
      precision
    );
  },

  /**
   * 乘法
   * @param _num1
   * @param _num2
   * @returns {number}
   */
  multiplication(_num1: number, _num2: number, precision: number) {
    if (!precision) {
      precision = PRECISION;
    }
    _num1 = getNum(_num1);
    _num2 = getNum(_num2);

    // console.log('moveRight(_num1, precision): ' + moveRight(_num1, precision));
    // console.log('moveRight(_num2, precision): ' + moveRight(_num2, precision));
    return moveLeft(
      moveRight(_num1, precision) * moveRight(_num2, precision),
      precision * 2
    );
  },

  /**
   * 除法
   * @param _num1 被除数
   * @param _num2 除数
   * @param precision 精度 整形,几位小数
   * @returns {number}
   */
  division(_num1: number, _num2: number, precision: number) {
    if (!precision) {
      precision = PRECISION;
    }
    _num1 = getNum(_num1);
    _num2 = getNum(_num2);
    return moveRight(_num1, precision) / moveRight(_num2, precision);
  },
};
