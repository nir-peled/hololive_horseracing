export interface Encryptor {
	compare_passwords(new_password: string, encrypted_password: string): Promise<boolean>;

	hash_password(password: string, salt?: string | undefined): Promise<string>;
}
