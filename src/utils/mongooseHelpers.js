import mongoose from "mongoose";

/**
 * Safely converts a string or ObjectId to a valid ObjectId.
 * Returns null if the input is invalid.
 */
export function toObjectId(id) {
  if (!id) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return null; // invalid ObjectId
}

/**
 * Finds a document by ID in a given Mongoose model.
 * Returns null if ID is invalid or document not found.
 */
export async function findByModelId(model, id) {
  const objectId = toObjectId(id);
  if (!objectId) return null;
  return await model.findOne({ _id: objectId });
}
