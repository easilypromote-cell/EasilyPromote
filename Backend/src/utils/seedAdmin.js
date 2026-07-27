const User = require("../models/User");

async function seedDefaultAdmin() {
  try {
    const adminCount = await User.countDocuments({
      role: { $in: ["admin", "super_admin"] },
    });

    if (adminCount === 0) {
      const email = process.env.DEFAULT_ADMIN_EMAIL || "admin@easilypromote.com";
      const password = process.env.DEFAULT_ADMIN_PASSWORD || "AdminPassword123!";

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        existingUser.role = "super_admin";
        existingUser.emailVerified = true;
        await existingUser.save();
        console.log(`[SeedAdmin] Upgraded existing user ${email} to super_admin.`);
      } else {
        await User.create({
          name: "System Super Admin",
          email,
          password,
          role: "super_admin",
          emailVerified: true,
          isActive: true,
        });
        console.log(`[SeedAdmin] Default Super Admin account created: ${email}`);
      }
    }
  } catch (err) {
    console.error("[SeedAdmin] Failed to seed default admin:", err.message);
  }
}

module.exports = seedDefaultAdmin;
