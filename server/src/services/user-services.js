
import UserModel from '../models/user-model.js';
import CustomError from '../utils/custom-error.js';

export const getMe=async (userId)=>{

    // check if user even exists 
    const user=await UserModel.findById(userId);

    if(!user){
        throw new CustomError("User not found",404);
    }

    return {
        success:true,
        message:"User info",
        user
    };
}

export const updateMe = async (userId,data)=>{
    const allowedFields=["password","name"];

    const updates={};

    for(let key of allowedFields){
        if(data[key]) updates[key]=data[key];
    }

    const user=await UserModel.findById(userId).select("+password");

    if(!user){
        throw new CustomError("User not found",404);
    }

    Object.assign(user,updates);
    await user.save();

    user.password=null;

    return {
        success:true,
        message:"Profile updated successfully",
        user

    }
}

export const getAllUsers = async (query) => {
  const { page = 1, limit = 10, role, status, search } = query;

  const filter = {};

  if (role) filter.role = role;
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const users = await UserModel.find(filter)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await UserModel.countDocuments(filter);

  return {
    success:true,
    message:"fetched users",
    users,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

export const getUserById = async (id) => {
  const user = await UserModel.findById(id)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!user) {
    throw new CustomError("User not found",404);
  }

  return {
    success:true,
    message:"user fetched",
    user
  };
};

export const createUser = async (data) => {
  const user = await UserModel.create({
    ...data,
  });

  return {
    success:true,
    message:"user created successfully",
    user
  };
};

export const updateUser = async (id, data, updatedBy) => {
  const user = await UserModel.findById(id);

  if (!user) {
    throw new CustomError("User not found",404);
  }

  Object.assign(user, data);
  user.updatedBy = updatedBy;

  await user.save();

  return {
    success:true,
    message:"updated user successfully",
    user
  };
};

export const deleteUser = async (id, updatedBy) => {
  const user = await UserModel.findById(id);

  if (!user) {
    throw new CustomError("User not found",404);
  }

  user.status = "INACTIVE";
  user.updatedBy = updatedBy;

  await user.save();

  return {
    success:true,
    message:"user deactivated successsfully",
    user
  };
};
