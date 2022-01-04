---
  title: 'Entry [2]'
  date: '2022-01-04'
---

Finally started work on the new project I have in mind.

After some research and thinking, I went ahead with the following back-end stack:

- Nest.js
- GraphQL with Apollo server and the integrated nest.js library
- Prisma for the ORM
- PostgreSQL for the DB ( I was thinking of also going noSQL with MongoDB, however I will need the relations too much, to rely on the less strict relations in MongoDB)

For the moment, the front-end stack is still not defined, as I decided to first focus on the back-end and see how it goes.

Using Nest.js's CLI, I setup the 2 resources I'll need:

`nest generate resource`

And as I am in control of the project and the business logic, I decided to implemente TDD.

This set me back a couple of days, as I had to read on how to test with Nest.js, Prisma and GraphQL.

In the end, I setup a prismaMock with a singleton, like so:

```javascript
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import prisma from './client';

jest.mock('./client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
```

This allows me to write tests, by first mocking the response, expected from the prisma client.

From there, I began writing tests and the graphql queries and mutations, along with manual testing afterwards, to ensure that it's all actually working.

Now I'll need to finish the rest of the resources and finish configuring the many-to-many relationship for one of the features.
