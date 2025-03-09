import { hashPassword, comparePassword } from "../SignUpPage/hashUtils.js";

describe("Password Hashing Tests", () => {
    test("✅ Successfully hashes a password", async () => {
        const password = "SecureTest123!";
        const hashedPassword = await hashPassword(password);
        expect(hashedPassword).not.toBe(password);
        expect(hashedPassword.length).toBeGreaterThan(20);
    });

    test("✅ Successfully verifies correct password", async () => {
        const password = "SecureTest123!";
        const hashedPassword = await hashPassword(password);
        const isValid = await comparePassword(password, hashedPassword);
        expect(isValid).toBe(true);
    });

    test("❌ Fails verification for incorrect password", async () => {
        const password = "SecureTest123!";
        const hashedPassword = await hashPassword(password);
        const isValid = await comparePassword("WrongPassword!", hashedPassword);
        expect(isValid).toBe(false);
    });
});