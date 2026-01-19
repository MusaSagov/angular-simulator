
//3. Создать функцию, которая принимает 2 числа и возвращает их сумму. Полностью типизировать параметры, значение, возвращаемое функцией.

function sum(a: number, b: number): number {
  const result = a + b;
  console.log(`Sum: ${result}`);
  return result;
}

sum(3, 6);

//4. Создать переменную status, которая может быть только: "loading", "success", "error".

type Status = 'loading' | 'success' | 'error';

//5. Создать переменную textFormat, которая может быть только: 'uppercase', 'lowercase', 'capitalize'".

type textFormat = 'uppercase' | 'lowercase' | 'capitalize';

//6. Создать интерфейс, который описывает юзера. Поля на ваш выбор. Одно поле должно быть опциональным.

interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}


//7. Создать интерфейс, который расширяется интерфейсом User с задания №6 и имеет свои дополнительные поля 

interface IDeveloper extends User {
    id: number;
    age?: number;
    github: string;
    skills: string[];
}
//8. Создать функцию, которая принимает строку и вариант,  как именно форматировать строку (задание №5) и на основе этого возвращает форматированную строку.

function formatText(text: string, format: textFormat): string {
  if (format === 'uppercase') {
    return text.toUpperCase();
  }
  if (format === 'lowercase') {
    return text.toLowerCase();
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
console.log(formatText("hello world", "capitalize"));
console.log(formatText("hello world", "uppercase"));
console.log(formatText("hello world", "lowercase"));

//9. Создать функцию, которая принимает строку и символ, возвращает строку без переданного символа.  (есть специальные методы для этого, гуглим)

function removeChar(text: string, char: string): string {
    if (!char) return text
    return text.replaceAll(char, '');
}

console.log(removeChar("hello world", "l"));
console.log(removeChar("привет мирр", "р"));
console.log(removeChar("test@@test", "@"));

//10. Создать массив объектов на основе интерфейса с задания №6. Отфильтровать его по одному из параметров

const users: User[] = [
  { id: 1, name: 'Алексей Смирнов', email: 'alex@dev.ru', age: 28 },
  { id: 2, name: 'Мария Петрова', email: 'maria@test.ru' },
  { id: 3, name: 'Иван Иванов', email: 'ivan@mail.ru', age: 22 },
  { id: 4, name: 'Елена Козлова', email: 'elena@work.ru', age: 35 }
]

const adults: User[] = users.filter(user => user.age && user.age > 25);
console.log(adults);
