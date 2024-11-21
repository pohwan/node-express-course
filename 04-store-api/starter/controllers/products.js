const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  // $gt: greater than
  // $lt: less then
  const products = await Product.find({ price: { $gt: 30 } })
    .sort("price")
    .select("name price");
  // .limit(5)
  // .skip(1); // skip(n) is to skip the first n results
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  // to avoid passing unneccessary query to the filter.
  // only take neccessary query from req.query. so that even pass unused query, still we get what we want.
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    // search name with regex so that can search more possible items
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    // queryObject.numericFilters = {}
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
    console.log(filters);
  }

  let result = Product.find(queryObject);

  // sort function
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  // select what attribute need to show in json
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  // pagination function
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  // 23 results
  // split to 4 7 7 7 2 pages

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
