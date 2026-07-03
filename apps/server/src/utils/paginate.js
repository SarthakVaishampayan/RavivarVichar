const paginate = async (Model, query = {}, options = {}) => {
  const page = Math.max(1, parseInt(options.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(options.limit) || 10));
  const sort = options.sort || '-createdAt';
  const search = options.search || '';
  const searchFields = options.searchFields || ['title'];

  let filter = { ...query };

  // Text search across specified fields
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = searchFields.map((field) => ({ [field]: searchRegex }));
  }

  const skip = (page - 1) * limit;
  const total = await Model.countDocuments(filter);
  const data = await Model.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = paginate;
