export default [
  {
    url: "/",
    name: "Главная",
    slug: "home",
    icon: "HomeIcon",
  },
  {
    url:null,
    name: "Добавить",
    slug: "add",
    icon: "PackageIcon",
    submenu:[
      {
        url: "/category",
        name: "Категории",
        slug: "category",
      },
      {
        url: "/video",
        name: "Видео",
        slug: "video",
        icon: "ArchiveIcon",
      },
      {
        url: "/posts",
        name: "Пост",
        slug: "posts",
        icon: "PocketIcon",
      },
    ]
  },
  {
    url: "/instagram-scraper",
    name: "Scraper",
    slug: 'instagram',
    icon: "BoxIcon",
  },
]
