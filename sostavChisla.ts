/**
* Написать функцию sostavChisla(massivChisel: number[], chislo: number),
  которая бы находила все возможные комбинации чисел из massivChisel,
  сумма которых равна chislo. При этом:
  1) massivChisel содержит, только уникальные положительные числа (> 0)
  2) в комбинации не должно быть повторений чисел
  3) все комбинации должны быть уникальными

  Для проверки работоспособности функции запустить runTests()

  @param massivChisel: number[]
  @param chislo: number
  @return Array<Array<number>>
*/
function sostavChisla(massivChisel: number[], chislo: number): number[][] {
  const numbers = massivChisel.concat().sort()

  /**
   * Возвращает индекс задающий минимальный интервал включающий переданную точку.
   * Числа после возвращённого индекса точно не содержат запрошенное число.
   * Числа в получившемся интервале возможно содержат эту точку.
   */
  function slice(numbers: number[], target: number, start: number, end = numbers.length): number {
    for (let i = start; i < end; i++)
      if (numbers[i] >= target)
        return i

    return -1
  }

  /**
   * Подбор пары чисел собирающих переданное число.
   * Основной метод, комбинации большей длинны рекурсивно сводятся к этому методу.
   */
  function getTwos(numbers: number[], target: number, start = 0, end = numbers.length): number[][] {
    /** индекс максимума среди элементов меньше target / 2 */
    // хотябы одно число в паре должно быть <= target / 2
    // однако т.к. числа во входящем массиве уникальны - неравенство строгое
    const middle = slice(numbers, target / 2, start, end) - 1
    if (middle < 0)
      return []

    const result: number[][] = []
    for (let i = start; i <= middle; i++) {
      /** необходимое для образования пары, число */
      // numbers[i] - это первое число в паре
      const secondValue = target - numbers[i]
      /** предполагаемая позиция парного числа */
      // т.к. первое число меньше target / 2, второе должно быть больше
      const second = slice(numbers, secondValue, middle)
      if (numbers[second] !== secondValue)
        continue

      result.push([numbers[i], numbers[second]])
    }

    return result
  }

  /**
   * рекурсивное сведение общего случая к комбинации 2 чисел
   */
  function getManes(count: number, numbers: number[], target: number, start = 0, end = numbers.length): number[][] {
    if (count <= 0)
      return []

    if (count === 1) {
      if (target === numbers[numbers.length - 1])
        return [[numbers[numbers.length - 1]]]

      if (target < numbers[numbers.length - 1]) {
        const i = numbers.findIndex(n => n >= target)
        if (i >= 0 && target === numbers[i])
          return [[numbers[i]]]
      }

      return []
    }

    if (count === 2)
      return getTwos(numbers, target, start, end)

    let result: number[][] = []
    /**
     * Хотябы 1 число должно попадать в этот диапазон.
     * (target / count) * count === target
     *
     * А т.к. входящие числа уникальны - неравенство строгое
     */
    const maxStart = slice(numbers, target / count, start, end)
    for (let i = start; i < maxStart; i++) {
      /** оставшаяся часть собираемого числа */
      const tempTarget = target - numbers[i]
      // Числа уникальны и отсортированы.
      // А значит все последующие больше numbers[i] и tempTarget в следующих итерациях будет только меньше.
      // Потому прерывание.
      // Чисел нужно ещё (count - 1) штук + прогрессия
      // минимальный случай: count === 3 ==> numbers[i] + 1 + numbers[i] + 2
      if (tempTarget < numbers[i] * (count - 1) + count)
        break

      /** все комбинации чисел из которых можно собрать tempTarget */
      const tempResult = getManes(count - 1, numbers, tempTarget, i + 1, end)

      if (!tempResult.length)
        continue
      // комбинации в tempResult это (target - numbers[i])
      // а на этом уровне рекурсии нужно собрать комбинацию для target
      tempResult.forEach(a => a.unshift(numbers[i]))
      result = result.concat(tempResult)
    }

    return result
  }

  /**
   * стартовые проверки, запуск рекурсивного поиска комбинаций
   * @param numbers number[] массив чисел по которым ведётся поиск. должен быть отсортирован по возрастанию
   * @param target number собираемое число
   */
  function getCombinations(numbers: number[], target: number): number[][] {
    if (!numbers.length || target < numbers[0])
      return []

    let result: number[][] = [];

    {// ones
      // удаление элементов больше target
      // заодно добавление элемента равного target в result, если такой элемент есть во входящем массиве
      if (target === numbers[numbers.length - 1])
        result.push([numbers.pop()!])
      else if (target < numbers[numbers.length - 1]) {
        const i = numbers.findIndex(n => n >= target)
        if (target === numbers[i])
          result.push([numbers[i]])
        numbers.splice(i)
      }
      if (numbers.length < 2 || target <= 2)
        return result
    }

    /** количество элементов в максимальном случае прогрессии */
    // (n+1)*n при больших n близко к n**2
    const maxCount = Math.min(numbers.length, 1.41421356237 * Math.sqrt(target))
    for (let count = 2; count <= maxCount; count++) {
      const temp = getManes(count, numbers, target)
      if (!temp.length)
        continue
      result = result.concat(temp)
    }

    return result
  }

  return getCombinations(numbers, chislo)
}


// console.log(sostavChisla([8, 2, 3, 4, 6, 7, 1], 99));

function compareNumericArrays(arr1, arr2) {
  if(arr1.length !== arr2.length) {
    return false;
  }

  arr1 = [...arr1].sort();
  arr2 = [...arr2].sort();

  for(let i=0; i<arr1.length; i++) {
    if(arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

function compareArraysOfNumericArrays(arr1, arr2) {
  if(arr1.length !== arr2.length) {
    return false;
  }

  for(let el1 of arr1) {
    if(arr2.findIndex(el2 => compareNumericArrays(el1, el2)) < 0) {
      return false;
    }
  }

  return true;
}

runTests();

function runTests() {
    const tests = [
    {
      chislo: 5,
      massivChisel: [8, 2, 3, 4, 6, 7, 1],
      result: [[2, 3], [4, 1]]
    },
    {
      chislo: 99,
      massivChisel: [8, 2, 3, 4, 6, 7, 1],
      result: []
    },
    {
      chislo: 8,
      massivChisel: [1, 2, 3, 4, 5, 6, 7, 8],
      result: [[1, 3, 4], [1, 2, 5], [3, 5], [2, 6], [1, 7], [8]]
    },
    {
      chislo: 8,
      massivChisel: [7, 8, 3, 4, 5, 6, 1, 2],
      result: [[1, 3, 4], [1, 2, 5], [3, 5], [2, 6], [1, 7], [8]]
    },
    {
      chislo: 15,
      massivChisel: [7, 8, 3, 4, 5, 6, 1, 2],
      result: [[1, 2, 3, 4, 5], [2, 3, 4, 6], [1, 3, 5, 6], [4, 5, 6], [1, 3, 4, 7], [1, 2, 5, 7], [3, 5, 7], [2, 6, 7], [1, 2, 4, 8], [3, 4, 8], [2, 5, 8], [1, 6, 8], [7, 8]]
    },

  ];

  let errors = 0;
  for(const test of tests) {
    let result;
    try{
      result = sostavChisla(test.massivChisel, test.chislo);

      if(!compareArraysOfNumericArrays(
          result,
          test.result)
      ) {
        errors++;
        console.log('--------------------------------------------')
        console.log("failed for test", test, "Got result", result);
      }
    } catch(e) {
      errors++;
      console.log("failed for", test, 'exception', e.message);
    }
  }

  if(errors === 0) {
    console.log('checkStringForBracects test successfuly completed');
  } else {
    console.log(`checkStringForBracects test failed with ${errors} errors`);
  }
}

