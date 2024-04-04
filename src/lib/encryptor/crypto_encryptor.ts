import { randomBytes, pbkdf2Sync } from "crypto";
import { Encryptor } from ".";

export class CryptoEncryptor implements Encryptor {
	async compare_passwords(password: string, hash: string): Promise<boolean> {
		let [salt] = hash.split("#");

		let hashed_new_pass = await this.hash_password(password, salt);
		return hashed_new_pass == hash;
	}

	async hash_password(password: string, salt?: string | undefined): Promise<string> {
		if (!salt) salt = randomBytes(Number(process.env.SALT_BYTES)).toString("hex");
		let hash = pbkdf2Sync(
			password,
			salt,
			Number(process.env.HASH_ROUNDS),
			Number(process.env.HASH_KEYLEN),
			process.env.HASH_METHOD as string
		).toString(`hex`);

		return `${salt}#${hash}`;
	}
}
