import { Cookie, createCookie, createSessionStorage } from "@remix-run/node";
import { ObjectId } from "mongodb";

import mongodb from "~/lib/mongodb.server";

if (!process.env.MONGODB_DBNAME) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_DBNAME"');
}
if (!process.env.MONGODB_COLL_SESSIONS) {
  throw new Error(
    'Invalid/Missing environment variable: "MONGODB_COLL_SESSIONS"'
  );
}
if (
  !process.env.SESSION_SECRET_CURRENT ||
  !process.env.SESSION_SECRET_PREVIOUS ||
  !process.env.SESSION_SECRET_OLD
) {
  throw new Error(
    'Invalid/Missing environment variables for session cookie signing: "SESSION_SECRET_CURRENT", "SESSION_SECRET_PREVIOUS", "SESSION_SECRET_OLD".'
  );
}

interface SessionData {
  _id: string;
}

interface MongoDBSessionStorage {
  cookie: Cookie;
  options: {
    db: string | undefined;
    coll: string;
  };
}

const dbName = process.env.MONGODB_DBNAME;
const collName = process.env.MONGODB_COLL_SESSIONS;
const secrets = [
  process.env.SESSION_SECRET_CURRENT,
  process.env.SESSION_SECRET_PREVIOUS,
  process.env.SESSION_SECRET_OLD,
];
const cookie = createCookie("__session", {
  httpOnly: true,
  // The `expires` argument to `createData` and `updateData` is the same
  // `Date` at which the cookie itself expires and is no longer valid.
  maxAge: 60 * 60 * 24 * 30, // 30 days
  sameSite: "lax",
  secrets,
  secure: process.env.NODE_ENV === "production",
});

async function createMongoDBSessionStorage({
  cookie,
  options,
}: MongoDBSessionStorage) {
  // Configure your database client.
  const client = await mongodb();
  const collection = client.db(options.db).collection(options.coll);

  // Create an index to auto-purge documents from the database when the `expireAt` date is reached.
  await collection.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });

  return createSessionStorage<SessionData>({
    cookie,
    async createData(data, expires) {
      let _id: ObjectId | null = null;
      const { _id: _, ...dataWithoutId } = data; // eslint-disable-line -- `_` is unused by design

      if (data._id) {
        _id = new ObjectId(data._id);

        // Update an existing document or insert a new one with the specified `_id`.
        await collection.findOneAndUpdate(
          { _id: new ObjectId(_id) },
          { $set: { ...dataWithoutId, expireAt: expires } },
          { upsert: true }
        );
      } else {
        // Insert a new document without an `_id`, allowing MongoDB to generate one automatically.
        const { insertedId } = await collection.insertOne({
          ...dataWithoutId,
          expireAt: expires,
        });

        _id = insertedId;
      }

      return _id.toString();
    },
    async readData(id) {
      const session = await collection.findOne({ _id: new ObjectId(id) });
      return session ? { _id: session._id.toString() } : null;
    },
    async updateData(id, data, expires) {
      const { _id: _, ...dataWithoutId } = data; // eslint-disable-line -- `_` is unused by design

      if (!data._id || data._id === id) {
        // Partially update the document without changing the `_id`.
        await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...dataWithoutId, expireAt: expires } },
          { upsert: true }
        );

        return;
      }

      // Remove the existing document by its original `_id`
      // and insert a new document with the desired `_id`.
      await collection.deleteOne({ _id: new ObjectId(id) });
      await collection.insertOne({
        ...data,
        _id: new ObjectId(data._id),
        expireAt: expires,
      });
    },
    async deleteData(id) {
      await collection.deleteOne({ _id: new ObjectId(id) });
    },
  });
}

const { getSession, commitSession, destroySession } =
  await createMongoDBSessionStorage({
    cookie,
    options: {
      db: dbName,
      coll: collName,
    },
  });

export { getSession, commitSession, destroySession };
