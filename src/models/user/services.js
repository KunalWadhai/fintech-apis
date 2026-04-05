import { User } from "./index.js";

const OMIT_PASSWORD = { passwordHash: 0 };

export const findUserDocumentByEmail = (email) =>
  User.findOne({ email: String(email).toLowerCase().trim() });

export const userExistsByEmail = async (email) => {
  const doc = await User.findOne({ email: String(email).toLowerCase().trim() })
    .select("_id")
    .lean();
  return Boolean(doc);
};

export const createUser = (payload) => User.create(payload);

export const findUserById = (userId, projection = OMIT_PASSWORD) => User.findById(userId, projection);

export const findUserByIdLean = (userId, projection = OMIT_PASSWORD) =>
  User.findById(userId, projection).lean();

export const listUsersWithTotal = async (filter, { skip, limit, sort = { createdAt: -1 } }) => {
  const [items, total] = await Promise.all([
    User.find(filter, OMIT_PASSWORD).sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  return { items, total };
};

export const updateUserById = (id, update) =>
  User.findByIdAndUpdate(id, update, {
    returnDocument: "after",
    runValidators: true,
    projection: OMIT_PASSWORD,
  });
