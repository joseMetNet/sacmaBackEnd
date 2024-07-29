import { 
  compareSync, 
  genSaltSync, 
  hashSync 
} from "bcryptjs";

/**
* @class
* @classdesc BcryptAdapter class with static methods to hash and compare passwords
* @exports BcryptAdapter
*/
export class BcryptAdapter {
  /**
    * @method
    * @param password - password to be hashed
    * @returns hashed password
    * @description Function to hash a password
    * @example
    * BcryptAdapter.hash("password")
  */
  static hash(password: string): string {
    const salt: string = genSaltSync(10);
    return hashSync(password, salt);
  }

  /**
    * @method
    * @param password - password to be compared
    * @param hash - hash to be compared
    * @returns boolean
    * @description Function to compare a password with a hash
    * @example
    * BcryptAdapter.compare("password", "hash")
  */
  static compare(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }

}
