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
function sostavChisla(massivChisel, chislo) {
  const numbers = massivChisel.concat().sort();

  function binarySearch(numbers, target, start = 0, end = numbers.length - 1) {
    let middle = Math.round((end - start) / 2) + start;
    for (; start < end && numbers[middle] !== target;) {
      if (numbers[middle] > target) {
        end = middle - 1;
      } else {
        start = middle + 1;
      }
      middle = Math.round((end - start) / 2) + start;
    }

    if (numbers[middle] === target) {
      return middle;
    } else {
      return -1;
    }
  }

  /**
   * Подбор пары чисел собирающих переданное число.
   * Основной метод, комбинации большей длинны рекурсивно сводятся к этому методу.
   */
  function getTwos(numbers, target, start = 0, end = numbers.length) {
    const result = [];

    const half = target / 2;
    // последний элемент в последовательности точно не является первым в выборке
    const maxFirstPosition = end - 1;
    for (let i = start; i < maxFirstPosition && numbers[i] < half; i++) {
      const secondValue = target - numbers[i];
      const secondIndex = binarySearch(numbers, secondValue, i + 1, end - 1);
      if (secondIndex > 0 && numbers[secondIndex] === secondValue) {
        result.push([numbers[i], numbers[secondIndex]]);
      }
    }

    return result;
  }

  /**
   * рекурсивное сведение общего случая к комбинации 2 чисел
   */
  function getManes(count, numbers, target, start = 0, end = numbers.length) {
    if (count <= 0) {
      return [];
    }

    if (count === 1) {
      if (target === numbers[numbers.length - 1]) {
        return [[numbers[numbers.length - 1]]];
      }

      if (target < numbers[numbers.length - 1]) {
        const i = numbers.findIndex(n => n >= target);
        if (i >= 0 && target === numbers[i]) {
          return [[numbers[i]]];
        }
      }

      return [];
    }

    if (count === 2) {
      return getTwos(numbers, target, start, end);
    }

    let result = [];
    /**
     * Хотябы 1 число должно попадать в этот диапазон.
     * (target / count) * count === target
     *
     * А т.к. входящие числа уникальны - неравенство строгое
     */
    const maxStartValue = target / count;
    for (let i = start; numbers[i] < maxStartValue; i++) {
      /** оставшаяся часть собираемого числа */
      const tempTarget = target - numbers[i];
      // Числа уникальны и отсортированы.
      // А значит все последующие больше numbers[i] и tempTarget в следующих итерациях будет только меньше.
      // Потому прерывание.
      // Чисел нужно ещё (count - 1) штук + прогрессия
      // минимальный случай: count === 3 ==> numbers[i] + 1 + numbers[i] + 2
      if (tempTarget < numbers[i] * (count - 1) + count) {
        break;
      }

      /** все комбинации чисел из которых можно собрать tempTarget */
      const tempResult = getManes(count - 1, numbers, tempTarget, i + 1, end);

      if (!tempResult.length) {
        continue;
      }
      // комбинации в tempResult это (target - numbers[i])
      // а на этом уровне рекурсии нужно собрать комбинацию для target
      tempResult.forEach(a => a.unshift(numbers[i]));
      result = result.concat(tempResult);
    }

    return result;
  }

  /**
   * стартовые проверки, запуск рекурсивного поиска комбинаций
   * @param numbers number[] массив чисел по которым ведётся поиск. должен быть отсортирован по возрастанию
   * @param target number собираемое число
   */
  function getCombinations(numbers, target) {
    if (!numbers.length || target < numbers[0]) {
      return [];
    }

    let result = [];

    { // ones
      // удаление элементов больше target
      // заодно добавление элемента равного target в result, если такой элемент есть во входящем массиве
      if (target === numbers[numbers.length - 1]) {
        result.push([numbers.pop()]);
      } else if (target < numbers[numbers.length - 1]) {
        const i = numbers.findIndex(n => n >= target);
        if (target === numbers[i]) {
          result.push([numbers[i]]);
        }
        numbers.splice(i);
      }
      if (numbers.length < 2 || target <= 2) {
        return result;
      }
    }

    /** количество элементов в максимальном случае прогрессии */
    // (n+1)*n при больших n близко к n**2
    const maxCount = Math.min(numbers.length, 1.41421356237 * Math.sqrt(target));
    for (let count = 2; count <= maxCount; count++) {
      const temp = getManes(count, numbers, target);
      if (!temp.length) {
        continue;
      }
      result = result.concat(temp);
    }

    return result;
  }

  return getCombinations(numbers, chislo);
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

