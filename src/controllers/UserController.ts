import UserService from "../services/UserServices";
import { UserPayload } from "../types/User";

class UserController {
  static async getUser(id: string) {
    try {
      const user = await UserService.getUser(id);
      return {
        data: user,
        status: 200,
        message: "Succesfully get user",
      };
    } catch (error) {
      return error;
    }
  }

  static async updateUser(id: string, data: UserPayload) {
    try {
      const update = await UserService.updateUser(id, data);
      return update;
    } catch (error) {
      return error;
    }
  }

  static async deleteUser(id: string) {
    try {
      return await UserService.deleteUser(id);
    } catch (error) {
      return error;
    }
  }
}

export default UserController;
