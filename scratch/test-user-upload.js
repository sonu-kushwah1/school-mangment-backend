const fs = require("fs");
const path = require("path");

async function runTest() {
  console.log("=== STARTING USER IMAGE UPLOAD INTEGRATION TEST ===");

  const REGISTER_URL = "http://localhost:5001/api/auth/register";
  const LOGIN_URL = "http://localhost:5001/api/auth/login";
  const PROFILE_URL = "http://localhost:5001/api/auth/profile";
  const USER_BY_ID_URL = "http://localhost:5001/api/auth/user";
  const UPLOADS_URL = "http://localhost:5001/uploads";
  
  const scratchDir = path.join(__dirname);
  const testImgPath = path.join(scratchDir, "user_test_avatar.png");
  const updateImgPath = path.join(scratchDir, "user_test_avatar_new.png");
  const uploadsDir = path.join(__dirname, "../uploads");

  // Create dummy image files
  fs.writeFileSync(testImgPath, "dummy png user avatar 1");
  fs.writeFileSync(updateImgPath, "dummy png user avatar 2");

  let token = null;
  let userId = null;
  let firstUploadedFilename = null;
  let secondUploadedFilename = null;

  try {
    const testEmail = `testuser-${Date.now()}@example.com`;
    const testPassword = "Password123";

    // 1. Register a user with an initial profile image
    console.log("\n1. Testing User Registration with Profile Image...");
    const regForm = new FormData();
    regForm.append("fname", "Test User Profile");
    regForm.append("email", testEmail);
    regForm.append("phone", "9876543210");
    regForm.append("role", "admin");
    regForm.append("password", testPassword);

    const imgBlob = new Blob([fs.readFileSync(testImgPath)], { type: "image/png" });
    regForm.append("user_profile", imgBlob, "user_test_avatar.png");

    const regRes = await fetch(REGISTER_URL, {
      method: "POST",
      body: regForm,
    });

    const regData = await regRes.json();
    console.log("Register Response Status:", regRes.status);
    console.log("Register Response Data:", regData);

    if (regRes.status !== 201) {
      throw new Error("Registration failed");
    }

    // 2. Login to get token and verify user profile image in login response
    console.log("\n2. Testing User Login...");
    const loginRes = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const loginData = await loginRes.json();
    console.log("Login Response Status:", loginRes.status);
    console.log("Login Response Data:", loginData);

    if (loginRes.status !== 200 || !loginData.token) {
      throw new Error("Login failed");
    }

    token = loginData.token;
    userId = loginData.user.id;
    firstUploadedFilename = loginData.user.user_profile;

    if (!firstUploadedFilename) {
      throw new Error("user_profile filename is missing from login response!");
    }
    console.log("Uploaded Image Filename:", firstUploadedFilename);

    // Verify file exists on disk
    const localFilePath = path.join(uploadsDir, firstUploadedFilename);
    if (!fs.existsSync(localFilePath)) {
      throw new Error(`File does not exist on disk at ${localFilePath}`);
    }
    console.log("✅ First uploaded file exists on server disk.");

    // Test static serving of user profile image
    console.log("\n3. Testing Static Serving of Uploaded Image...");
    const staticRes = await fetch(`${UPLOADS_URL}/${firstUploadedFilename}`);
    console.log("Static file fetch response status:", staticRes.status);
    if (staticRes.status !== 200) {
      throw new Error("Failed to access static file via HTTP");
    }
    const staticText = await staticRes.text();
    if (staticText !== "dummy png user avatar 1") {
      throw new Error("File content mismatch on static server");
    }
    console.log("✅ Static serving working perfectly.");

    // 4. Update Profile (Self) with a new image
    console.log("\n4. Testing Update Profile (Replacing Image)...");
    const updateForm = new FormData();
    updateForm.append("fname", "Test User Profile Updated");
    
    const updateImgBlob = new Blob([fs.readFileSync(updateImgPath)], { type: "image/png" });
    updateForm.append("user_profile", updateImgBlob, "user_test_avatar_new.png");

    const updateRes = await fetch(PROFILE_URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: updateForm,
    });

    const updateData = await updateRes.json();
    console.log("Update Profile Status:", updateRes.status);
    console.log("Update Profile Data:", updateData);

    if (updateRes.status !== 200) {
      throw new Error("Profile update failed");
    }

    secondUploadedFilename = updateData.user.user_profile;
    if (!secondUploadedFilename || secondUploadedFilename === firstUploadedFilename) {
      throw new Error("Profile image was not updated or filename is same!");
    }

    // Verify old file is deleted
    if (fs.existsSync(localFilePath)) {
      throw new Error("Old image file was NOT deleted after profile update!");
    }
    console.log("✅ Old image file deleted successfully.");

    // Verify new file exists
    const secondLocalFilePath = path.join(uploadsDir, secondUploadedFilename);
    if (!fs.existsSync(secondLocalFilePath)) {
      throw new Error(`New image file does not exist on disk at ${secondLocalFilePath}`);
    }
    console.log("✅ New profile image exists on disk.");

    // 5. Update User by ID (setting image to null)
    console.log("\n5. Testing Update User by ID (Setting Image to null)...");
    const updateByIdRes = await fetch(`${USER_BY_ID_URL}/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_profile: null,
      }),
    });

    const updateByIdData = await updateByIdRes.json();
    console.log("Update User By ID Response Status:", updateByIdRes.status);
    console.log("Update User By ID Response Data:", updateByIdData);

    if (updateByIdRes.status !== 200) {
      throw new Error("Update user by ID failed");
    }

    if (updateByIdData.user.user_profile !== null) {
      throw new Error("user_profile was not set to null in response!");
    }

    // Verify new file is deleted
    if (fs.existsSync(secondLocalFilePath)) {
      throw new Error("Image file was NOT deleted after setting user_profile to null!");
    }
    console.log("✅ Image file deleted from disk after setting user_profile to null.");

    // 6. Set another image, then delete user, verify cleanup
    console.log("\n6. Testing File Cleanup on User Deletion...");
    // Upload image again
    const updateForm2 = new FormData();
    const tempImgBlob = new Blob([fs.readFileSync(testImgPath)], { type: "image/png" });
    updateForm2.append("user_profile", tempImgBlob, "user_test_avatar.png");

    const updateRes2 = await fetch(PROFILE_URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: updateForm2,
    });
    const updateData2 = await updateRes2.json();
    const finalImgFilename = updateData2.user.user_profile;
    const finalLocalFilePath = path.join(uploadsDir, finalImgFilename);

    if (!fs.existsSync(finalLocalFilePath)) {
      throw new Error("Failed to set final image for deletion test");
    }
    console.log("✅ Temp image set for deletion test.");

    // Delete user
    const deleteRes = await fetch(`${USER_BY_ID_URL}/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const deleteData = await deleteRes.json();
    console.log("Delete User Response Status:", deleteRes.status);
    console.log("Delete User Response Data:", deleteData);

    if (deleteRes.status !== 200) {
      throw new Error("User deletion failed");
    }

    // Verify final image is deleted from disk
    if (fs.existsSync(finalLocalFilePath)) {
      throw new Error("Image file was NOT deleted after user record deletion!");
    }
    console.log("✅ Image file cleaned up from server disk after user deletion.");

    console.log("\n🎉 ALL USER PROFILE IMAGE UPLOAD TESTS PASSED SUCCESSFULLY!");

  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message);
  } finally {
    // Clean up local test files
    try {
      if (fs.existsSync(testImgPath)) fs.unlinkSync(testImgPath);
      if (fs.existsSync(updateImgPath)) fs.unlinkSync(updateImgPath);
    } catch (e) {
      console.error("Cleanup error:", e);
    }
  }
}

runTest();
