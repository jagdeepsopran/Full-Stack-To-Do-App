import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function registerController(req, res) {
  try {
    let { fullName, username, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({
        success: false,
        message: "user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = {
      fullName,
      email,
      username,
      password: hashedPassword,
    };

    await User(updatedUser).save();

    return res.status(201).json({
      success: true,
      message: "user created successfully",
      updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
}

export async function loginController(req, res) {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "user not exists , please register",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(200).json({
        success: false,
        message: "invalid credentials!!",
      });
    }

    // Authentication and authorization using JWT Token

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "user logged in successfully",
        token,
      });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
}

export async function logoutController(req, res) {
  try {
    return res.status(200).cookie("token", "").json({
      success: true,
      message: "logout successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "logout failed",
    });
  }
}

export async function requestPasswordResetController(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate a reset token (can be stored in the user model)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry

    // Save the reset token and expiry to the user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset token via email (use your email service here)
    const transporter = nodemailer.createTransport({
      service: "gmail", // Your email service provider
      auth: {
        user: process.env.GMAIL, // Use environment variables for this in production
        pass: process.env.GMAIL_PASS, // Use environment variables for this in production
      },
    });

    const resetLink = `${req.headers.origin}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.GMAIL, // Sender address
      to: email, // Recipient address
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function verifyResetTokenController(req, res) {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Ensure the token hasn't expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token is valid", // Token is valid for password reset
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function resetPasswordController(req, res) {
  try {
    const { token, password } = req.body;

    console.log("token-> ", token, "newp -> ", password);

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Ensure token is valid
    });

    console.log(user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token and expiry
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function isAuth(req, res) {
  const token = req.cookies.token; // Access HttpOnly cookie

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const _id = decoded.userId;

    const userInfo = await User.findOne({ _id });

    return res.status(200).json({ valid: true, userInfo });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// export async function logoutController(req, res) {
//   try {
//     return res
//       .status(200)
//       .cookie("token", "", {
//         httpOnly: true,  // Match the original cookie's properties
//         sameSite: "strict", // Match the original cookie's properties
//         secure: process.env.NODE_ENV === "production", // Use secure in production
//         expires: new Date(0), // Expire the cookie immediately
//       })
//       .json({
//         success: true,
//         message: "Logout successful",
//       });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       message: "Logout failed",
//     });
//   }
// }
