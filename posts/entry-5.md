---
  title: 'Entry [5]'
  date: '2022-03-02'
---

Had some stuff to take care off. Missed the last entry.

However, I did do something in the last couple of weeks. I got an idea of a password manager desktop app.

Initially I wanted to build it in Swift, as I'll use it on my Mac mainly. But then decided I might want to have it on my Windows PC as well and that basically cemented my desire to use Electron instead.

Did some research, found a great [boilerplate](https://github.com/cawa-93/vite-electron-builder) that I can use to generate the code and have been going at it for the past couple of days.

The techstack itself is nothing special. On the FE I run:

- Electron
- Vite
- React
- Typescript
- Axios (for calls to the Web API)
- Redux Toolkit

The backend was a bit more hard to decide on. First, I wanted to have one single application, without separating the UI from the backend. I went through the steps of setting up a cloud Database first, so that I can sync the application offline. But then decided against it. For what it's worth, this app will not be used offline and even if I do decide to use it. Well... I'll figure it out.

After a bit of research, I found that setting up a backend in Electron might be harder than I initially thought. And also more time consuming. I don't want to spend a lot of time on this app. It's not something groundbreaking and I just wanted to do it as a side project. So, scrapped that idea and just decided to go with a Web API back-end.

First, I wanted to use Nestjs with Prisma and Postgres, however Nest and Prisma didn't want to play together for some reason. And after a couple of hours of debugging, I decided that it's not worth the time and energy to figure it out. So I decided to rely on the good old Express.js with TypeScript.

Now the backend stack looks as follows:

- Express.js
- Typescript
- PrismaORM
- PostgreSQL

To ensure code quality, structure, etc. I have ESLint and Prettier setup on both the desktop app and the Web API.

For version control I have 2 separate Github repos, that are for the moment private. I'll definately set them to public once the project is done.

The app will still need a day or 2 to be finished, but it's getting there.

For the design I got a friend of mine to build a simple UI and that's that.

I might set a new entry once the app is done.
