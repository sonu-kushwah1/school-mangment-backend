const fs = require("fs");
const path = require("path");

async function runTest() {
  console.log("=== STARTING IMAGE UPLOAD INTEGRATION TEST ===");

  const BASE_URL = "http://localhost:5001/api/student";
  const UPLOADS_URL = "http://localhost:5001/uploads";
  const scratchDir = path.join(__dirname);
  const testImgPath = path.join(scratchDir, "test_avatar.png");
  const updateImgPath = path.join(scratchDir, "test_avatar_new.png");
  const uploadsDir = path.join(__dirname, "../uploads");

  // Create dummy image files if they don't exist
  fs.writeFileSync(testImgPath, "dummy png image content 1");
  fs.writeFileSync(updateImgPath, "dummy png image content 2");

  let studentId = null;
  let uploadedFilename = null;
  let updatedFilename = null;

  try {
    // 1. Create a Student with Image Upload
    console.log("\n1. Testing Student Creation with Image...");
    const createForm = new FormData();
    createForm.append("first_name", "TestStudent");
    createForm.append("last_name", "Doe");
    createForm.append("gender", "Male");
    createForm.append("mob_no", "1234567890");
    createForm.append("dob", "2000-01-01");
    createForm.append("blood_group", "O+");
    createForm.append("religion", "TestReligion");
    createForm.append("class_name", "10th");
    createForm.append("email", `teststudent-${Date.now()}@example.com`);
    createForm.append("section", "A");
    createForm.append("fees", "5000");

    const imgBlob = new Blob([fs.readFileSync(testImgPath)], { type: "image/png" });
    createForm.append("student_img", imgBlob, "test_avatar.png");

    const createRes = await fetch(BASE_URL, {
      method: "POST",
      body: createForm,
    });

    const createData = await createRes.json();
    console.log("Create Response Status:", createRes.status);
    console.log("Create Response Data:", createData);

    if (createRes.status !== 201 || !createData.id) {
      throw new Error("Student creation failed");
    }

    studentId = createData.id;

    // 2. Fetch the created Student to verify record and filename
    console.log(`\n2. Fetching student with ID: ${studentId}...`);
    const getRes = await fetch(`${BASE_URL}/${studentId}`);
    const getData = await getRes.json();
    console.log("Get Student Data:", getData);

    uploadedFilename = getData.student_img;
    if (!uploadedFilename) {
      throw new Error("student_img field is empty in database!");
    }
    console.log("Uploaded Image Filename:", uploadedFilename);

    // Verify file exists on server
    const localFilePath = path.join(uploadsDir, uploadedFilename);
    if (!fs.existsSync(localFilePath)) {
      throw new Error(`File does not exist on disk at ${localFilePath}`);
    }
    console.log("✅ File exists on server disk.");

    // 3. Verify Static Serving
    console.log("\n3. Testing Static Serving of Uploaded Image...");
    const staticRes = await fetch(`${UPLOADS_URL}/${uploadedFilename}`);
    console.log("Static file fetch response status:", staticRes.status);
    if (staticRes.status !== 200) {
      throw new Error("Failed to access static file via HTTP");
    }
    const staticText = await staticRes.text();
    if (staticText !== "dummy png image content 1") {
      throw new Error(`Content mismatch. Expected 'dummy png image content 1', got '${staticText}'`);
    }
    console.log("✅ Static serving working perfectly.");

    // 4. Update Student with a New Image
    console.log("\n4. Testing Student Update (Replacing Image)...");
    const updateForm = new FormData();
    // Copy all current details from getData first to satisfy non-null constraints
    for (const key of Object.keys(getData)) {
      if (key !== "student_img" && key !== "id" && getData[key] !== null) {
        updateForm.append(key, String(getData[key]));
      }
    }
    // Update fields to test
    updateForm.set("first_name", "TestStudentUpdated");

    const updateImgBlob = new Blob([fs.readFileSync(updateImgPath)], { type: "image/png" });
    updateForm.append("student_img", updateImgBlob, "test_avatar_new.png");

    const updateRes = await fetch(`${BASE_URL}/${studentId}`, {
      method: "PUT",
      body: updateForm,
    });

    const updateData = await updateRes.json();
    console.log("Update Response Status:", updateRes.status);
    console.log("Update Response Data:", updateData);

    if (updateRes.status !== 200) {
      throw new Error("Student update failed");
    }

    // Verify old file is deleted
    if (fs.existsSync(localFilePath)) {
      throw new Error("Old image file was NOT deleted after update!");
    }
    console.log("✅ Old image file deleted successfully.");

    // Fetch student again to get new image filename
    const getRes2 = await fetch(`${BASE_URL}/${studentId}`);
    const getData2 = await getRes2.json();
    updatedFilename = getData2.student_img;
    console.log("New Image Filename:", updatedFilename);

    const newLocalFilePath = path.join(uploadsDir, updatedFilename);
    if (!fs.existsSync(newLocalFilePath)) {
      throw new Error(`New file does not exist on disk at ${newLocalFilePath}`);
    }
    console.log("✅ New file exists on server disk.");

    // 5. Delete Student
    console.log("\n5. Testing Student Deletion and Image Cleanup...");
    const deleteRes = await fetch(`${BASE_URL}/${studentId}`, {
      method: "DELETE",
    });
    const deleteData = await deleteRes.json();
    console.log("Delete Response Status:", deleteRes.status);
    console.log("Delete Response Data:", deleteData);

    if (deleteRes.status !== 200) {
      throw new Error("Student deletion failed");
    }

    // Verify new file is deleted from disk
    if (fs.existsSync(newLocalFilePath)) {
      throw new Error("New image file was NOT deleted from disk after student deletion!");
    }
    console.log("✅ Image file cleaned up from server disk after deletion.");

    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");

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
