const { Category } = require("./models/category");
const { Link } = require("./models/link");
const { User } = require("./models/user");
const mongoose = require("mongoose");
const { logger } = require("./utils/logger");
const dotenv = require("dotenv");
dotenv.config();

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

async function seed() {
  const db = process.env.DATABASE_CLOUD;
  await mongoose.connect(db, options);

  await Category.deleteMany({});
  await Link.deleteMany({});
  // await User.deleteMany({})

  await mongoose.disconnect();
  return logger.info("Done!");
}

seed();
