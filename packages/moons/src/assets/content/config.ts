import { defineCollection } from "astro:content";
import { articlePageSchema, eventSchema, pageSchema, personSchema, questionSchema } from "./_schemas";

const articlesCollection = defineCollection({
  schema: articlePageSchema,
});

const eventsCollection = defineCollection({
  schema: eventSchema,
});

const pagesCollection = defineCollection({
  schema: pageSchema,
});

const personsCollection = defineCollection({
  schema: personSchema
});

const questionsCollection = defineCollection({
  schema: questionSchema,
});

export const collections = {
  articles: articlesCollection,
  events: eventsCollection,
  questions: questionsCollection,
  pages: pagesCollection,
  persons: personsCollection,
};
