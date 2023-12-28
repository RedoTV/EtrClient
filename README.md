## Тестовый сервер

`ng serve` Для запуски dev сервера. Приложение запускается на `http://localhost:4200/`.

## Build

`ng build` — для компиляции в html,css,js. Скомпилированные файлы располагаются в `dist/browser`.

## Документация (Swagger)

Etr API — `https://dl.gsu.by/etr/docs`

## Структура компонентов

![Alt text](<readme img/docs etrx.drawio.svg>)


Header Component — компонент, со ссылками на другие страницы.

Компоненты, зависящие от адреса:
- Home Component — компонент главной страницы;
- About Component — компонент, в котором отображаются все обновления;
- Contests Component — таблица контестов и тренировок;
- Contest-view Component — подробная информация о каждом контесте;
- Add-contests Component — компонент добавления контестов;
- Students-table Component — таблица учеников;
- Student-view Component — подробная информация об ученике;
- Students-add Component — компонент добавления учеников.

Table-template Component — компонент, отвечающий за таблицы.