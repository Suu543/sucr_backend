const { Link } = require("../models/link");
const { Category } = require("../models/category");
const slugify = require("slug");
const formidable = require("formidable");
const AWS = require("aws-sdk");
// For unique key in image
const { v4: uuidv4 } = require("uuid"); // Unique String
const dotenv = require("dotenv");
dotenv.config();

// S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.create = (req, res) => {
  console.log("Category - create");
  const { name, image, content } = req.body;

  // image data

  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const type = image.split(";")[0].split("/")[1];

  const slug = slugify(name);
  let category = new Category({ name, content, slug });
  console.log("req,user.", req.user._id);
  category.postedBy = req.user._id;

  // upload image to s3
  const params = {
    Bucket: "sucr-su",
    Key: `category/${uuidv4()}.${type}`,
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  s3.upload(params, async (err, data) => {
    // if(err) console.log(err) 이런식으로 에러 잡기
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Upload to s3 failed..." });
    }
    console.log("AWS UPLOAD RES DATA", data);

    // S3에 저장후 Return 된 값
    category.image.url = data.Location;
    category.image.key = data.Key;

    // posted by
    category.postedBy = req.user._id;

    // Save to DB
    try {
      let data = await category.save();
      res.status(200).json(data);
    } catch (error) {
      console.log("catch error", error);
      return res.status(400).json({
        error: "Error saving category to Database (Duplicated Category)",
      });
    }
  });
};

// https://github.com/aws/aws-sdk-js/issues/296

exports.list = async (req, res) => {
  try {
    let categories = await Category.find({});
    if (categories) res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json({
      error: "Categories could not load...",
    });
  }
};

exports.read = async (req, res) => {
  const { slug } = req.params;
  // console.log("req.body.limit", req.body);
  // let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  // let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  try {
    const category = await Category.findOne({ slug }).populate(
      "postedBy",
      "_id name username"
    );

    try {
      const links = await Link.find({ categories: category })
        .populate("postedBy", "_id name username")
        .populate("categories", "name")
        .populate("media", "media _id")
        .populate("type", "type _id")
        .populate("level", "level _id")
        .sort({ createdAt: -1 });
      // .limit(limit)
      // .skip(skip);

      return res.status(200).json({ category, links });
    } catch (error) {
      return res.status(400).json({
        error: "Could not load links of a category",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Could not load category",
    });
  }
};

exports.update = async (req, res) => {
  const { slug } = req.params;
  // console.log("slug", slug);
  const { name, image, content } = req.body;

  try {
    const updated = await Category.findOneAndUpdate(
      { slug },
      { name, content },
      { new: true }
    );
    // console.log("Updated", updated);

    if (image) {
      // remove the existing image from s3 before uploading new/updated on
      const deleteParams = {
        Bucket: "sucr-su",
        Key: `category/${updated.image.key}`,
      };

      s3.deleteObject(deleteParams, (err, data) => {
        if (err) console.log("S3 DELETE ERROR DURING UPDATE", err);
        else console.log("S3 DELETED DURING UPDATE", data); //deleted
      });

      const base64Data = new Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const type = image.split(";")[0].split("/")[1];

      // hondle update image
      const params = {
        Bucket: "sucr-su",
        Key: `${uuidv4()}.${type}`,
        Body: base64Data,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      };

      s3.upload(params, async (err, data) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: "Upload to s3 failed" });
        }

        console.log("AWS UPLOAD RES DATA", data);
        updated.image.url = data.Location;
        updated.image.key = data.key;

        try {
          const updatedData = await updated.save();
          return res.status(200).json(updatedData);
        } catch (error) {
          console.log("catch error", error);
          return res.status(400).json({
            error: "Error saving category to Database (Duplicated Category)",
          });
        }
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Colud not find category to update",
    });
  }
};

exports.remove = async (req, res) => {
  const { slug } = req.params;
  try {
    const removedData = await Category.findOneAndRemove({ slug });

    const deleteParams = {
      Bucket: "sucr-su",
      Key: `${removedData.image.key}`,
    };

    s3.deleteObject(deleteParams, (err, data) => {
      if (err) console.log("S3 DELETE ERROR DURING ", err);
      else console.log("S3 DELETED DURING ", data); //deleted
    });

    return res.status(200).json({
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Could not delete category",
    });
  }
};

exports.interest = async (req, res) => {
  try {
    let categories = await Category.find({}).sort({ createdAt: -1 }).limit(5);
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json({
      error: "Could not list links",
    });
  }
};

exports.categorySearch = async (req, res) => {
  const { search } = req.body;
  //  console.log("search", search);
  let searchResults;

  try {
    if (search) {
      searchResults = await Category.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { slug: { $regex: search, $options: "i" } },
        ],
      });

      // console.log("searchResults", searchResults);
      return res.status(200).json(searchResults);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};
