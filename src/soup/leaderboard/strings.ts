// Leaderboard copy. English, Russian and Kazakh are written for this page; every
// other locale shows the English text, marked lang="en", like the docs articles.
const en = {
  nav: 'Leaderboard',
  eyebrow: 'DECENTRATHON 6.0 / SOUP KERNEL CHALLENGE',
  title: 'Kernel Challenge leaderboard',
  lede: 'Teams of the track ranked by their own Kaggle runs: speed and memory measured by the organizers’ harness in {notebooks} public notebooks.',
  unofficial: 'Unofficial',
  unofficialNote:
    'This board is unofficial: neither the organizers nor the jury made it. Official places will be announced by the organizers.',
  teams: 'Teams',
  notebooks: 'Kaggle notebooks',
  window: 'Runs from 30 October to 1 November 2026',
  tableLabel: 'Kernel Challenge leaderboard',
  rank: '#',
  team: 'Team',
  speedup: 's speed',
  memory: 'm memory',
  peak: 'GPU peak, MiB',
  loss: 'Δ loss',
  kagglePoints: '≈ points',
  of65: 'of 65',
  kaggleNotebookMark:
    'the notebook has no link to a team repository; the notebook author is shown',
  kaggleTemplateMark: 'the organizers’ starter repository, not a team',
  kaggleIncomplete: 'Result without 10/10 checks in the saved run',
  rulesTitle: 'Where the numbers come from',
  kaggleNote:
    'Numbers come from the organizers’ harness files runs/result.json and runs/checks.json saved in {notebooks} public Kaggle notebooks. A team is the BAITC-Hacks repository the notebook clones; each team’s best notebook with 10/10 checks is shown.',
  kaggleScore:
    'Points ≈ 35·ln s / ln {s} + 30·ln m / ln {m}: speed and memory only, at most 65. The best s and m come from these same notebooks; admission (20) and README (15) are not counted.',
  kaggleLimits:
    'One run per notebook, in different Kaggle sessions; the jury reruns everything on hidden data, and rule compliance was not checked. Several different teams are called “team”.',
  kaggleSource: 'Source: an unofficial team table shared by participants',
  search: 'Search',
  searchPlaceholder: 'Team, author or repository',
  filterLabel: 'Show',
  filterAll: 'All',
  filterTeams: 'Teams',
  filterNotebooks: 'Notebooks *',
  filterRepos: 'GitHub repositories',
  withinLoss: 'Δ loss ≤ 0.5%',
  sortBy: 'Sort by',
  sortPoints: 'points',
  sortSpeed: 'speed s',
  sortMemory: 'memory m',
  sortPeak: 'GPU peak',
  shown: 'Shown {n} of {total}',
  nothingFound: 'Nothing found. Try another name or reset the filters.',
  reset: 'Reset',
}
type Strings = typeof en

const ru: Strings = {
  nav: 'Лидерборд',
  eyebrow: 'DECENTRATHON 6.0 / SOUP KERNEL CHALLENGE',
  title: 'Лидерборд Kernel Challenge',
  lede: 'Команды трека по их собственным прогонам в Kaggle: скорость и память, измеренные харнесом организаторов в {notebooks} публичных ноутбуках.',
  unofficial: 'Неофициально',
  unofficialNote:
    'Это неофициальный лидерборд: его не делали ни организаторы, ни жюри. Официальные места объявят организаторы.',
  teams: 'Команды',
  notebooks: 'Ноутбуки Kaggle',
  window: 'Прогоны с 30 октября по 1 ноября 2026',
  tableLabel: 'Лидерборд Kernel Challenge',
  rank: '#',
  team: 'Команда',
  speedup: 's скорость',
  memory: 'm память',
  peak: 'Пик GPU, МиБ',
  loss: 'Δ loss',
  kagglePoints: '≈ баллы',
  of65: 'из 65',
  kaggleNotebookMark:
    'в коде ноутбука нет ссылки на репозиторий команды, показан автор ноутбука',
  kaggleTemplateMark: 'стартовый репозиторий организаторов, а не команда',
  kaggleIncomplete:
    'Результат есть, но без 10/10 проверок в сохранённом прогоне',
  rulesTitle: 'Откуда цифры',
  kaggleNote:
    'Цифры взяты из файлов runs/result.json и runs/checks.json харнеса организаторов, сохранённых в {notebooks} публичных ноутбуках Kaggle. Команда — репозиторий BAITC-Hacks, который клонирует ноутбук; у каждой команды взят лучший ноутбук с 10/10 проверок.',
  kaggleScore:
    'Баллы ≈ 35·ln s / ln {s} + 30·ln m / ln {m}: только скорость и память, максимум 65. Лучшие s и m взяты среди этих же ноутбуков; допуск (20) и README (15) не учтены.',
  kaggleLimits:
    'Один прогон на ноутбук, в разных сессиях Kaggle; жюри перезапустит всё само на скрытых данных, соблюдение правил не проверялось. Несколько разных команд называются «team».',
  kaggleSource: 'Источник: неофициальная таблица команд от участников',
  search: 'Поиск',
  searchPlaceholder: 'Команда, автор или репозиторий',
  filterLabel: 'Показать',
  filterAll: 'Все',
  filterTeams: 'Команды',
  filterNotebooks: 'Ноутбуки *',
  filterRepos: 'Репозитории GitHub',
  withinLoss: 'Δ loss ≤ 0,5%',
  sortBy: 'Сортировка',
  sortPoints: 'баллы',
  sortSpeed: 'скорость s',
  sortMemory: 'память m',
  sortPeak: 'пик GPU',
  shown: 'Показано {n} из {total}',
  nothingFound:
    'Ничего не найдено. Попробуйте другое имя или сбросьте фильтры.',
  reset: 'Сбросить',
}

const kk: Strings = {
  nav: 'Көшбасшылар',
  eyebrow: 'DECENTRATHON 6.0 / SOUP KERNEL CHALLENGE',
  title: 'Kernel Challenge көшбасшылар тақтасы',
  lede: 'Трек командалары өздерінің Kaggle іске қосулары бойынша: {notebooks} ашық ноутбукта ұйымдастырушылар харнесі өлшеген жылдамдық пен жад.',
  unofficial: 'Ресми емес',
  unofficialNote:
    'Бұл ресми емес көшбасшылар тақтасы: оны ұйымдастырушылар да, қазылар да жасаған жоқ. Ресми орындарды ұйымдастырушылар жариялайды.',
  teams: 'Командалар',
  notebooks: 'Kaggle ноутбуктары',
  window: '2026 жылғы 30 қазан — 1 қараша аралығындағы іске қосулар',
  tableLabel: 'Kernel Challenge көшбасшылар тақтасы',
  rank: '#',
  team: 'Команда',
  speedup: 's жылдамдық',
  memory: 'm жад',
  peak: 'GPU шыңы, МиБ',
  loss: 'Δ loss',
  kagglePoints: '≈ ұпай',
  of65: '65-тен',
  kaggleNotebookMark:
    'ноутбук кодында команда репозиторийіне сілтеме жоқ, ноутбук авторы көрсетілген',
  kaggleTemplateMark: 'ұйымдастырушылардың бастапқы репозиторийі, команда емес',
  kaggleIncomplete: 'Нәтиже бар, бірақ сақталған іске қосуда 10/10 тексеру жоқ',
  rulesTitle: 'Сандар қайдан алынды',
  kaggleNote:
    'Сандар {notebooks} ашық Kaggle ноутбугында сақталған ұйымдастырушылар харнесінің runs/result.json және runs/checks.json файлдарынан алынған. Команда — ноутбук клондайтын BAITC-Hacks репозиторийі; әр команданың 10/10 тексеруден өткен үздік ноутбугы көрсетілген.',
  kaggleScore:
    'Ұпай ≈ 35·ln s / ln {s} + 30·ln m / ln {m}: тек жылдамдық пен жад, ең көбі 65. Үздік s пен m осы ноутбуктардан алынған; жіберілу (20) және README (15) есептелмеген.',
  kaggleLimits:
    'Әр ноутбукқа бір іске қосу, әртүрлі Kaggle сессияларында; қазылар бәрін жасырын деректерде қайта іске қосады, ережелердің сақталуы тексерілмеген. Бірнеше әртүрлі команда «team» деп аталады.',
  kaggleSource: 'Дереккөз: қатысушылардың ресми емес командалар кестесі',
  search: 'Іздеу',
  searchPlaceholder: 'Команда, автор немесе репозиторий',
  filterLabel: 'Көрсету',
  filterAll: 'Барлығы',
  filterTeams: 'Командалар',
  filterNotebooks: 'Ноутбуктар *',
  filterRepos: 'GitHub репозиторийлері',
  withinLoss: 'Δ loss ≤ 0,5%',
  sortBy: 'Сұрыптау',
  sortPoints: 'ұпай',
  sortSpeed: 'жылдамдық s',
  sortMemory: 'жад m',
  sortPeak: 'GPU шыңы',
  shown: '{total} ішінен {n} көрсетілді',
  nothingFound:
    'Ештеңе табылмады. Басқа атауды көріңіз немесе сүзгілерді тастаңыз.',
  reset: 'Тастау',
}

const table: Record<string, Strings> = { en, ru, kk }

export function leaderboardStrings(language: string) {
  const strings = table[language]
  return { s: strings ?? en, lang: strings ? language : 'en' }
}
export type LeaderboardStrings = Strings
