import 'package:get/get.dart';
import '../dashboard.dart';

class LoginController extends GetxController {
  var email = ''.obs;
  var password = ''.obs;

  void login() {
    if (email.isNotEmpty && password.isNotEmpty) {
      Get.snackbar('Success', 'Login Berhasil');
      Get.off(DashboardPage());
    } else {
      Get.snackbar('Error', 'Email dan Password harus diisi');
    }
  }
}
