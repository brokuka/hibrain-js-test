const days = [
  {
    rus: "Понедельник",
    en: "MONDAY",
  },
  {
    rus: "ВТОРНИК",
    en: "Tuesday",
  },
  {
    rus: "СРЕДА",
    en: "Wednesday",
  },
  {
    rus: "ЧЕТВЕРГ",
    en: "Thursday",
  },
  {
    rus: "ПЯТНИЦА",
    en: "Friday",
  },
  {
    rus: "СУББОТА",
    en: "Saturday",
  },
  {
    rus: "ВОСКРЕСЕНЬЕ",
    en: "Sunday",
  },
];

let str = `Старший братец ПОНЕДЕЛЬНИК –
работяга, не бездельник.
Он неделю открывает
всех трудиться зазывает.

ВТОРНИК следует за братом
у него идей богато.

А потом СРЕДА-сестрица,
не пристало ей лениться.

Брат ЧЕТВЕРГ и так, и сяк,
он мечтательный чудак.

ПЯТНИЦА-сестра сумела
побыстрей закончить дело.

Предпоследний брат СУББОТА
не выходит на работу.

В гости ходит ВОСКРЕСЕНЬЕ,
очень любит угощенье
`;

let matched = str.match(/[А-Я]+/g);

days.map(({ rus, en }, index) => {
  let rusUpperCase = rus.toUpperCase();
  let enUpperCase = en.toUpperCase();
  let filter = matched.filter((match) => match === rusUpperCase);

  return console.log((filter[index] = enUpperCase));
});
