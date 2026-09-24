export const site = {
  name: 'ПРОСТОР',
  tagline: 'Интерьерная архитектура. Квартиры и загородные дома.',
};

export const navigation = [
  { label: 'Проекты', href: '/projects/', currentOnChildren: true },
  { label: 'Услуги', href: '/services/' },
  { label: 'Подход', href: '/studio/' },
  { label: 'Контакты', href: '/contact/' },
] as const;

export const contacts = {
  phone: '+7 (812) 604-27-18', email: 'hello@prostor-interior.studio',
  address: 'Санкт-Петербург, Петроградская сторона, Каменноостровский проспект, 38',
  hours: 'Пн–Сб, 10:00–19:00', territory: 'Санкт-Петербург и Ленинградская область'
};
