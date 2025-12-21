import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/uploadOnCloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    res.status(200).send({ message: "User registered successfully" });
    
    const {fullName, email, password} = req.body;
    console.log(`Registering user: ${fullName}, Email: ${email}`);

    if(
        [fullName, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne(
        {
        $or: [{ email }, { username }]
    }
    )

    if(existedUser) {
        throw new ApiError(409, "User with given email or username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) {
        throw new ApiError(500, "Failed to upload avatar image");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new ApiError(500, "Failed while registring a user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
});

export { registerUser };