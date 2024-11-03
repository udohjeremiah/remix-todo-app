import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let isConnected = false; // Tracks connection status

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve value across module reloads with HMR.
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClientPromise || !globalWithMongo._mongoClient) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClient = client;
    globalWithMongo._mongoClientPromise = client.connect();
  }

  client = globalWithMongo._mongoClient;
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, ensure a single connection instance without using globals.
  client = new MongoClient(uri, options);

  // Recursive function attempting MongoDB connection with exponential backoff.
  const connectWithRetry = async (
    attempt = 1,
    maxAttempts = 5
  ): Promise<MongoClient> => {
    // Exponential backoff formula
    const delay = Math.pow(5, attempt) * 1000;

    try {
      return await client.connect();
    } catch (error) {
      console.error(
        `Error connecting to MongoDB (Attempt ${attempt}/${maxAttempts}):`,
        error
      );

      if (attempt < maxAttempts) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        // Resolves a Promise after the calculated delay, then retries
        return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
          connectWithRetry(attempt + 1, maxAttempts)
        );
      } else {
        console.error(
          `Maximum retry attempts (${maxAttempts}) reached. Connection failed.`
        );

        // Propagate the error after maximum attempts
        throw error;
      }
    }
  };

  clientPromise = connectWithRetry();
}

async function mongodb(): Promise<MongoClient> {
  if (isConnected && client) {
    // Return the already connected client
    return client;
  }

  try {
    // Connect the client to the server (optional starting in v4.7)
    client = await clientPromise;

    // Send a ping to confirm successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");

    // Mark as connected
    isConnected = true;

    // Return the connected client
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);

    // Reset `isConnected` to false if the connection failed
    isConnected = false;

    // Throw error to prevent usage of an unconnected client
    throw error;
  }
}

// Export the mongodb function to share the MongoClient across functions
export default mongodb;
